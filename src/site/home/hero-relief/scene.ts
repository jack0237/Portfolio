// Scène WebGL2 du hero « Relief topographique » (docs/ASSETS.md 1 bis, candidat A).
// Chargée par import dynamique depuis HeroVisual, uniquement en palier riche (DESIGN 10.4) :
// jamais téléchargée sur mobile, en mode réduit ou avec l'interrupteur du footer.
// WebGL2 brut, aucune bibliothèque (DESIGN 10.1).
import { HALO_FS, HALO_VS, SKY_FS, SKY_VS, TERRAIN_FS, TERRAIN_VS } from "./shaders";

export type ReliefOptions = {
  /** Classe CSS du canvas (fondu d'entrée). */
  canvasClass?: string;
  /** Appelé après la première image : le canvas peut apparaître par-dessus le poster. */
  onReady: () => void;
  /** La scène renonce (WebGL indisponible, rendu logiciel, moins de 45 i/s, contexte perdu) : retour au poster. */
  onFail: (reason: string) => void;
};

export type ReliefHandle = { dispose: () => void };

type Stats = { samples: number[]; gpu: number[]; renderer: string; width: number; height: number; fps: number };

// Réglages
const T0 = 6; // instant de départ, proche du poster
const WRAP_S = 900; // au-delà, retour doux au départ (précision du bruit en coordonnées lointaines)
const RENDER_SCALE = 0.6; // résolution interne en px CSS : le relief est flou par nature (brume)
const MAX_BUFFER_W = 1600;
const LEVELS = [
  // n : sommets par côté (index 16 bits, n <= 256) ; taille du carré (unités monde) ;
  // centre devant la caméra ; octaves de bruit au sommet et au pixel.
  // Les niveaux lointains restent peu denses : des triangles sous le pixel coûtent cher en fragments.
  { n: 160, size: 14, ahead: 6, oct: 7, fragOct: 4 },
  { n: 128, size: 44, ahead: 18, oct: 6, fragOct: 4 },
  { n: 96, size: 150, ahead: 64, oct: 5, fragOct: 3 },
];
const FPS_MIN = 45;
const FPS_WINDOW_MS = 2000;
const WARMUP_MS = 1200;

const pathX = (z: number) => 1.6 * Math.sin(z * 0.11) + 0.9 * Math.sin(z * 0.047 + 1.3);

type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

function isSoftwareRenderer(gl: WebGL2RenderingContext) {
  let name = String(gl.getParameter(gl.RENDERER) || "");
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  if (dbg) name += " " + String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
  return { name, soft: /swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(name) };
}

export function createHeroRelief(host: HTMLElement, opts: ReliefOptions): ReliefHandle | null {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  if (opts.canvasClass) canvas.className = opts.canvasClass;
  const debug = /[?&]relief-stats\b/.test(location.search);
  // Mesure seulement : ?relief-stats&relief-scale=1 force la résolution interne.
  const forced = debug ? Number(new URLSearchParams(location.search).get("relief-scale")) : 0;
  const renderScale = forced > 0 && forced <= 2 ? forced : RENDER_SCALE;
  const forcedGrid = debug ? (new URLSearchParams(location.search).get("relief-grid") || "").split(",").map(Number) : [];
  const levels = LEVELS.map((lv, i) => {
    const g = forcedGrid[i];
    return g >= 16 && g <= 256 ? { ...lv, n: Math.round(g) } : lv;
  });

  const gl = canvas.getContext("webgl2", {
    antialias: false,
    alpha: false,
    depth: true,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) {
    opts.onFail("webgl2");
    return null;
  }
  const ctx: WebGL2RenderingContext = gl; // pour les fonctions déclarées plus bas
  const rend = isSoftwareRenderer(gl);
  if (rend.soft) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    opts.onFail("software");
    return null;
  }

  // ---------- Ressources GPU (recréées après une perte de contexte) ----------
  type Prog = { p: WebGLProgram; u: (n: string) => WebGLUniformLocation | null };
  let terrain: Prog, sky: Prog, halo: Prog;
  let gridVaos = new Map<number, WebGLVertexArrayObject | null>();
  let quadVao: WebGLVertexArrayObject | null = null;
  let triVao: WebGLVertexArrayObject | null = null;
  const buffers: WebGLBuffer[] = [];
  let timer: { ext: { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number }; pending: WebGLQuery[] } | null = null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = (vs: string, fs: string): Prog => {
    const p = gl.createProgram()!;
    const a = compile(gl.VERTEX_SHADER, vs);
    const b = compile(gl.FRAGMENT_SHADER, fs);
    gl.attachShader(p, a);
    gl.attachShader(p, b);
    gl.bindAttribLocation(p, 0, "aGrid");
    gl.bindAttribLocation(p, 0, "aPos");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = [gl.getShaderInfoLog(a), gl.getShaderInfoLog(b), gl.getProgramInfoLog(p)].filter(Boolean).join("\n");
      throw new Error(log || "link");
    }
    gl.deleteShader(a);
    gl.deleteShader(b);
    const cache = new Map<string, WebGLUniformLocation | null>();
    return {
      p,
      u: (n) => {
        if (!cache.has(n)) cache.set(n, gl.getUniformLocation(p, n));
        return cache.get(n)!;
      },
    };
  };
  const vao = (data: Float32Array, index?: Uint16Array) => {
    const v = gl.createVertexArray();
    gl.bindVertexArray(v);
    const b = gl.createBuffer()!;
    buffers.push(b);
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    if (index) {
      const ib = gl.createBuffer()!;
      buffers.push(ib);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
    }
    gl.bindVertexArray(null);
    return v;
  };

  const init = () => {
    terrain = program(TERRAIN_VS, TERRAIN_FS);
    sky = program(SKY_VS, SKY_FS);
    halo = program(HALO_VS, HALO_FS);
    gridVaos = new Map();
    for (const { n: G } of levels) {
      if (gridVaos.has(G)) continue;
      const grid = new Float32Array(G * G * 2);
      for (let j = 0, k = 0; j < G; j++)
        for (let i = 0; i < G; i++) {
          grid[k++] = i / (G - 1);
          grid[k++] = j / (G - 1);
        }
      // Rangées dans l'ordre des z croissants : la caméra regarde vers +z, le proche est dessiné d'abord (early-z).
      const idx = new Uint16Array((G - 1) * (G - 1) * 6);
      for (let j = 0, k = 0; j < G - 1; j++)
        for (let i = 0; i < G - 1; i++) {
          const a = j * G + i;
          idx[k++] = a;
          idx[k++] = a + 1;
          idx[k++] = a + G;
          idx[k++] = a + 1;
          idx[k++] = a + G + 1;
          idx[k++] = a + G;
        }
      gridVaos.set(G, vao(grid, idx));
    }
    quadVao = vao(new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]));
    triVao = vao(new Float32Array([-1, -1, 3, -1, -1, 3]));
    if (debug) {
      const ext = gl.getExtension("EXT_disjoint_timer_query_webgl2") as { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number } | null;
      timer = ext ? { ext, pending: [] } : null;
    }
  };

  try {
    init();
  } catch (e) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    opts.onFail("shader");
    if (debug) console.warn("[relief]", e);
    return null;
  }
  host.appendChild(canvas);

  // ---------- État ----------
  let raf = 0;
  let running = false;
  let disposed = false;
  let lost = false;
  let ready = false;
  let visibleOnScreen = true;
  let elapsed = 0; // secondes de scène (n'avance que pendant le rendu)
  let last = 0;
  let wrapping = false;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let fpsStart = 0;
  let fpsFrames = 0;
  let resumeAt = 0;
  let bw = 0;
  let bh = 0;
  const stats: Stats = { samples: [], gpu: [], renderer: rend.name, width: 0, height: 0, fps: 0 };
  if (debug) (window as unknown as { __reliefStats: Stats }).__reliefStats = stats;

  const resize = () => {
    const r = host.getBoundingClientRect();
    const s = Math.min(renderScale, MAX_BUFFER_W / Math.max(1, r.width));
    const w = Math.max(1, Math.round(r.width * s));
    const h = Math.max(1, Math.round(r.height * s));
    if (w !== bw || h !== bh) {
      bw = canvas.width = w;
      bh = canvas.height = h;
      stats.width = w;
      stats.height = h;
    }
    resetFps();
    if (!running) draw(); // image à jour même en pause
  };

  const resetFps = () => {
    fpsFrames = 0;
    fpsStart = 0;
    resumeAt = performance.now();
  };

  const vp = new Float32Array(16);

  const draw = () => {
    if (lost || disposed || !bw) return;
    const t = T0 + elapsed;
    const cz = t * 0.22;
    const ro: V3 = [pathX(cz) - 3.2 + mouse.x * 0.35, 1.9 + mouse.y * -0.18, cz];
    const ta: V3 = [pathX(cz + 16) + 0.6, -1.0, cz + 16];
    const fw = norm(sub(ta, ro));
    const rt = norm(cross([0, 1, 0], fw));
    const up = cross(fw, rt);
    const fl = 1.55;
    const far = norm([pathX(cz + 60) - ro[0] + 22, 0, 60]);
    const zp = cz + 2 + ((t * 2.2) % 36);
    const pulseFade = smooth(1.5, 3.5, zp - cz);

    // Matrice vue-projection (repère du prototype : x droite, y haut, z devant)
    const aspect = bw / bh;
    const n = 0.05;
    const f = 260;
    const sx = (2 * fl) / aspect;
    const sy = 2 * fl;
    const A = (f + n) / (f - n);
    const B = (-2 * f * n) / (f - n);
    const tx = -dot(rt, ro);
    const ty = -dot(up, ro);
    const tz = -dot(fw, ro);
    for (let c = 0; c < 3; c++) {
      vp[c * 4 + 0] = sx * rt[c];
      vp[c * 4 + 1] = sy * up[c];
      vp[c * 4 + 2] = A * fw[c];
      vp[c * 4 + 3] = fw[c];
    }
    vp[12] = sx * tx;
    vp[13] = sy * ty;
    vp[14] = A * tz + B;
    vp[15] = tz;

    let query: WebGLQuery | null = null;
    if (timer) {
      query = gl.createQuery();
      if (query) gl.beginQuery(timer.ext.TIME_ELAPSED_EXT, query);
    }

    gl.viewport(0, 0, bw, bh);
    gl.clearColor(0.027, 0.035, 0.043, 1);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    const common = (p: Prog) => {
      gl.useProgram(p.p);
      gl.uniform2f(p.u("uRes"), bw, bh);
      gl.uniform1f(p.u("uTime"), t);
      gl.uniform3f(p.u("uCam"), ro[0], ro[1], ro[2]);
      gl.uniform3f(p.u("uFar"), far[0], far[1], far[2]);
    };

    // 1. Relief, du niveau le plus fin au plus grossier
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    common(terrain);
    gl.uniformMatrix4fv(terrain.u("uVP"), false, vp);
    gl.uniform1f(terrain.u("uCz"), cz);
    gl.uniform1f(terrain.u("uZp"), zp);
    const hx = fw[0];
    const hz = fw[2];
    const hl = Math.hypot(hx, hz) || 1;
    let hole: [number, number, number, number] = [1e9, 1e9, -1e9, -1e9];
    levels.forEach((lv, li) => {
      const cell = lv.size / (lv.n - 1);
      const cxw = ro[0] + (hx / hl) * lv.ahead;
      const czw = ro[2] + (hz / hl) * lv.ahead;
      const ox = Math.floor((cxw - lv.size / 2) / cell) * cell;
      const oz = Math.floor((czw - lv.size / 2) / cell) * cell;
      gl.bindVertexArray(gridVaos.get(lv.n) ?? null);
      gl.uniform2f(terrain.u("uOrigin"), ox, oz);
      gl.uniform1f(terrain.u("uSize"), lv.size);
      gl.uniform1i(terrain.u("uOct"), lv.oct);
      gl.uniform1i(terrain.u("uFragOct"), lv.fragOct);
      gl.uniform4f(terrain.u("uHole"), hole[0], hole[1], hole[2], hole[3]);
      gl.drawElements(gl.TRIANGLES, (lv.n - 1) * (lv.n - 1) * 6, gl.UNSIGNED_SHORT, 0);
      // Le niveau suivant s'enfonce sous celui-ci, avec 1,5 maille de recouvrement (pas de fissure)
      const next = levels[li + 1];
      const m = next ? (next.size / (next.n - 1)) * 1.5 : 0;
      hole = [ox + m, oz + m, ox + lv.size - m, oz + lv.size - m];
    });

    // 2. Ciel et brume lointaine, seulement là où le relief n'a rien dessiné
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(false);
    common(sky);
    gl.uniform3f(sky.u("uRt"), rt[0], rt[1], rt[2]);
    gl.uniform3f(sky.u("uUp"), up[0], up[1], up[2]);
    gl.uniform3f(sky.u("uFw"), fw[0], fw[1], fw[2]);
    gl.uniform1f(sky.u("uFl"), fl);
    gl.bindVertexArray(triVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 3. Halo de l'impulsion (lumière dans la brume), additif
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    common(halo);
    gl.uniformMatrix4fv(halo.u("uVP"), false, vp);
    gl.uniform3f(halo.u("uRt"), rt[0], rt[1], rt[2]);
    gl.uniform3f(halo.u("uUp"), up[0], up[1], up[2]);
    gl.uniform1f(halo.u("uZp"), zp);
    gl.uniform1f(halo.u("uFade"), pulseFade);
    gl.bindVertexArray(quadVao);
    // halo serré, masqué par le relief placé devant
    gl.depthFunc(gl.LESS);
    gl.uniform1i(halo.u("uMode"), 0);
    gl.uniform1f(halo.u("uSize"), 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // lueur large, sans occultation (comme le prototype)
    gl.disable(gl.DEPTH_TEST);
    gl.uniform1i(halo.u("uMode"), 1);
    gl.uniform1f(halo.u("uSize"), 2.8);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);

    if (timer && query) {
      gl.endQuery(timer.ext.TIME_ELAPSED_EXT);
      timer.pending.push(query);
      while (timer.pending.length) {
        const q = timer.pending[0];
        if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) break;
        const disjoint = gl.getParameter(timer.ext.GPU_DISJOINT_EXT);
        const ns = gl.getQueryParameter(q, gl.QUERY_RESULT) as number;
        if (!disjoint) stats.gpu.push(ns / 1e6);
        gl.deleteQuery(q);
        timer.pending.shift();
      }
      if (stats.gpu.length > 1200) stats.gpu.splice(0, 600);
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (!running) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    if (!wrapping) elapsed += dt;
    if (elapsed > WRAP_S && !wrapping) {
      // Retour au départ en fondu : le canvas s'efface sur le poster, on repart, il revient.
      wrapping = true;
      canvas.style.opacity = "0";
      window.setTimeout(() => {
        elapsed = 0;
        canvas.style.opacity = "";
        wrapping = false;
      }, 1400);
    }
    // Parallaxe lissée, indépendante de la fréquence d'affichage
    const k = 1 - Math.exp(-dt * 2.4);
    mouse.x += (mouse.tx - mouse.x) * k;
    mouse.y += (mouse.ty - mouse.y) * k;

    const c0 = debug ? performance.now() : 0;
    draw();
    if (debug) {
      gl.finish();
      stats.samples.push(performance.now() - c0);
      if (stats.samples.length > 1200) stats.samples.splice(0, 600);
    }
    if (!ready) {
      ready = true;
      opts.onReady();
    }

    // Garde-fou DESIGN 10.4 : moins de 45 i/s pendant 2 s, on rend la main au poster
    if (now - resumeAt > WARMUP_MS) {
      if (!fpsStart) fpsStart = now;
      else fpsFrames++;
      const span = now - fpsStart;
      if (span >= FPS_WINDOW_MS) {
        const fps = (fpsFrames * 1000) / span;
        stats.fps = fps;
        if (fps < FPS_MIN) {
          fail("slow");
          return;
        }
        fpsStart = now;
        fpsFrames = 0;
      }
    }
    raf = requestAnimationFrame(frame);
  };

  const shouldRun = () => !disposed && !lost && visibleOnScreen && !document.hidden;
  const update = () => {
    const want = shouldRun();
    if (want && !running) {
      running = true;
      last = 0;
      resetFps();
      raf = requestAnimationFrame(frame);
    } else if (!want && running) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  // ---------- Écouteurs ----------
  const io = new IntersectionObserver(
    (entries) => {
      visibleOnScreen = entries.some((e) => e.isIntersecting);
      update();
    },
    { threshold: 0 },
  );
  io.observe(host);
  const resizeObs = new ResizeObserver(() => resize());
  resizeObs.observe(host);
  const onVis = () => update();
  document.addEventListener("visibilitychange", onVis);
  const fine = window.matchMedia("(pointer: fine)");
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !fine.matches) return;
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  const onLost = (e: Event) => {
    e.preventDefault(); // autorise la restauration
    lost = true;
    canvas.style.opacity = "0"; // le poster reprend la main pendant la perte
    update();
  };
  const onRestored = () => {
    lost = false;
    buffers.length = 0;
    try {
      init();
    } catch {
      fail("restore");
      return;
    }
    bw = bh = 0;
    resize();
    update();
    canvas.style.opacity = "";
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  resize();
  update();

  function fail(reason: string) {
    if (disposed) return;
    dispose();
    opts.onFail(reason);
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    io.disconnect();
    resizeObs.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("webglcontextlost", onLost);
    canvas.removeEventListener("webglcontextrestored", onRestored);
    if (!lost) {
      for (const b of buffers) ctx.deleteBuffer(b);
      [...gridVaos.values(), quadVao, triVao].forEach((v) => v && ctx.deleteVertexArray(v));
      [terrain, sky, halo].forEach((p) => p && ctx.deleteProgram(p.p));
    }
    ctx.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.remove();
  }

  return { dispose };
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
