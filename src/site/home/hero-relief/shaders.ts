// Shaders du relief topographique (hero, candidat A de docs/ASSETS.md 1 bis).
// Réécriture du prototype de raymarching en maillage déplacé : trois grilles 256 x 256
// (niveaux de détail emboîtés, ancrées au monde) dont la hauteur est calculée dans le
// vertex shader. Le fragment shader garde l'éclairage, les courbes de niveau, le fil
// et la brume du prototype, sans aucune boucle de raymarching.

const COMMON = /* glsl */ `
precision highp float;
precision highp int;
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),u.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x), u.y); }
const mat2 R = mat2(0.8, -0.6, 0.6, 0.8);
float pathX(float z){ return 1.6*sin(z*0.11) + 0.9*sin(z*0.047 + 1.3); }
float terrainO(vec2 p, int oct){
  float h = 0., a = 0.62, f = 0.2; vec2 q = p;
  for(int i=0;i<7;i++){ if(i>=oct) break; float n = noise(q*f); float m = n*2. - 1.; n = 1. - sqrt(m*m + 0.012); h += a*n*n; q = R*q*2.03; a *= 0.4; }
  h = h*3.0 - 1.1;
  float dx = p.x - pathX(p.y);
  float valley = exp(-dx*dx*0.35);
  return mix(h, h*0.25 - 0.55, valley*0.85);
}
`;

/** Partie propre aux fragment shaders (gl_FragCoord). */
const FRAG = /* glsl */ `
// Bruit de valeur avec dérivées (x : valeur, yz : gradient)
vec3 noiseD(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f); vec2 du=6.*f*(1.-f);
  float a=h21(i), b=h21(i+vec2(1,0)), c=h21(i+vec2(0,1)), d=h21(i+vec2(1,1));
  float k=a-b-c+d;
  return vec3(a+(b-a)*u.x+(c-a)*u.y+k*u.x*u.y, du*vec2((b-a)+k*u.y, (c-a)+k*u.x)); }
// Même relief que terrainO, avec son gradient (x : altitude, yz : d/dx, d/dz)
vec3 terrainD(vec2 p, int oct){
  float h = 0., a = 0.62, f = 0.2; vec2 q = p; vec2 g = vec2(0.); mat2 J = mat2(1.);
  for(int i=0;i<7;i++){ if(i>=oct) break;
    vec3 nd = noiseD(q*f);
    vec2 dn = f * (transpose(J) * nd.yz);
    float m = nd.x*2. - 1.; float s = sqrt(m*m + 0.012); float r = 1. - s;
    vec2 dr = -(m/s) * 2. * dn;
    h += a*r*r; g += a*2.*r*dr;
    q = R*q*2.03; J = 2.03*R*J; a *= 0.4; }
  h = h*3.0 - 1.1; g *= 3.0;
  float dx = p.x - pathX(p.y);
  float dpx = 1.6*0.11*cos(p.y*0.11) + 0.9*0.047*cos(p.y*0.047 + 1.3);
  vec2 ddx = vec2(1., -dpx);
  float v = exp(-dx*dx*0.35); vec2 dv = v*(-0.7*dx)*ddx;
  float res = h + 0.85*v*(-0.75*h - 0.55);
  vec2 dres = g + 0.85*(dv*(-0.75*h - 0.55) + v*(-0.75*g));
  return vec3(res, dres);
}
const vec3 BG = vec3(0.027, 0.035, 0.043);
const vec3 CYAN = vec3(0.0, 0.94, 1.0);
const vec3 CYAN_DIM = vec3(0.0, 0.72, 0.77);
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uCam;
uniform vec3 uFar;
float vignette(){ vec2 q = gl_FragCoord.xy / uRes; return 0.55 + 0.45*pow(16.*q.x*q.y*(1.-q.x)*(1.-q.y), 0.22); }
vec3 finish(vec3 col){
  col *= vignette();
  col += (h21(gl_FragCoord.xy + fract(uTime)*100.) - 0.5) / 255. * 2.5;
  return pow(max(col, 0.), vec3(0.93));
}
float axisOf(vec3 rd){ return pow(max(dot(normalize(vec3(rd.x, 0., rd.z)), uFar), 0.), 4.); }
vec3 fogOf(float axis){ return vec3(0.05,0.066,0.08) + vec3(0.015,0.085,0.1)*axis; }
`;

/** Terrain : grille ancrée au monde, hauteur calculée ici. */
export const TERRAIN_VS = /* glsl */ `#version 300 es
${COMMON}
in vec2 aGrid;
uniform mat4 uVP;
uniform vec2 uOrigin;
uniform float uSize;
uniform int uOct;
uniform vec4 uHole;
out vec3 vWorld;
void main(){
  vec2 xz = uOrigin + aGrid*uSize;
  float y = terrainO(xz, uOct);
  // Zone couverte par le niveau plus fin : on enfonce la grille sous le relief
  // (masquée par le test de profondeur, sans discard, donc early-z conservé).
  if (xz.x > uHole.x && xz.x < uHole.z && xz.y > uHole.y && xz.y < uHole.w) y -= 4.0;
  vWorld = vec3(xz.x, y, xz.y);
  gl_Position = uVP * vec4(vWorld, 1.0);
}`;

export const TERRAIN_FS = /* glsl */ `#version 300 es
${COMMON}${FRAG}
uniform float uCz;
uniform float uZp;
uniform int uFragOct;
in vec3 vWorld;
out vec4 o;
void main(){
  vec3 p = vWorld;
  vec3 v = p - uCam; float d = length(v); vec3 rd = v / d;
  float axis = axisOf(rd);
  vec3 fogCol = fogOf(axis);
  // Altitude et normale par pixel, dérivées analytiques (un seul passage de bruit)
  vec3 hd = terrainD(p.xz, uFragOct);
  float h = hd.x;
  vec3 n = normalize(vec3(-hd.y, 1., -hd.z));
  vec3 L = normalize(vec3(uFar.x, 0.55, uFar.z));
  float back = max(dot(n, L), 0.);
  float rim = pow(1. - max(dot(n, -rd), 0.), 3.);
  float lit = pow(back, 2.2);
  vec3 col = vec3(0.018,0.022,0.028) + vec3(0.13,0.16,0.19)*lit + vec3(0.42,0.52,0.58)*rim*lit*(0.5+0.5*axis);
  // Courbes de niveau (tous les 0,18 d'altitude), cyan atténué, effacées au loin
  float cl = h/0.18;
  float w = fwidth(cl);
  float line = 1. - smoothstep(0., 1.2*w, abs(fract(cl+0.5)-0.5));
  float major = 1. - smoothstep(0., 1.4*w, abs(fract(cl/5.+0.5)-0.5)*5.);
  col += CYAN_DIM * (line*0.13 + major*0.24) * exp(-d*0.05);
  // Le fil cyan posé dans la vallée, et l'impulsion qui le parcourt
  float dx = abs(p.x - pathX(p.z));
  float ww = 0.034 + d*0.003; // un peu plus large que le prototype : rendu à 60 % de résolution
  float route = 1. - smoothstep(ww*0.4, ww, dx);
  float glowR = exp(-dx*dx/(ww*ww*60.));
  float pulse = exp(-pow((p.z - uZp)*0.55, 2.));
  vec3 routeCol = CYAN * route * (0.7 + 1.8*pulse) + CYAN * glowR * (0.07 + 0.4*pulse);
  routeCol *= smoothstep(1.5, 3.5, p.z - uCz);
  // Brouillard de distance et de basse altitude, qui dérive lentement
  float t = uTime;
  float mist = noise(p.xz*0.35 + vec2(t*0.06, t*0.02))*0.6 + noise(p.xz*0.9 - vec2(t*0.09, 0.))*0.4;
  float fogD = 1. - exp(-d*0.045);
  float fogH = exp(-max(p.y + 0.55, 0.)*2.2) * (0.35 + 0.65*mist) * (1. - exp(-d*0.25));
  col = mix(col, fogCol, clamp(fogD + fogH*0.75, 0., 1.));
  col = mix(col, fogCol*1.15, smoothstep(35., 70., d));
  col += routeCol * exp(-d*0.022);
  o = vec4(finish(col), 1.);
}`;

/** Ciel et brume lointaine : triangle plein écran dessiné en dernier, seulement là où il n'y a pas de relief. */
export const SKY_VS = /* glsl */ `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 1.0, 1.0); }`;

export const SKY_FS = /* glsl */ `#version 300 es
${COMMON}${FRAG}
uniform vec3 uRt; uniform vec3 uUp; uniform vec3 uFw; uniform float uFl;
out vec4 o;
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  vec3 rd = normalize(uv.x*uRt + uv.y*uUp + uFl*uFw);
  float axis = axisOf(rd);
  float hor = exp(-max(rd.y+0.02, 0.)*9.);
  float hor2 = exp(-max(rd.y+0.01, 0.)*28.);
  vec3 sky = mix(BG, vec3(0.055,0.075,0.095), hor) + vec3(0.10,0.17,0.2)*hor2*(0.35+0.65*axis) + vec3(0.0,0.22,0.25)*pow(hor2,2.)*axis;
  vec3 col = mix(fogOf(axis)*1.15, sky, smoothstep(-0.03, 0.02, rd.y));
  o = vec4(finish(col), 1.);
}`;

/** Halo de brume éclairée autour de l'impulsion : panneau face caméra, mélange additif. */
export const HALO_VS = /* glsl */ `#version 300 es
${COMMON}
in vec2 aPos;
uniform mat4 uVP;
uniform vec3 uRt; uniform vec3 uUp;
uniform float uZp; uniform float uSize;
out vec3 vW;
flat out vec3 vP;
void main(){
  float x = pathX(uZp);
  vec3 P = vec3(x, terrainO(vec2(x, uZp), 7) + 0.12, uZp);
  vP = P;
  vW = P + (uRt*aPos.x + uUp*aPos.y) * uSize;
  gl_Position = uVP * vec4(vW, 1.0);
}`;

export const HALO_FS = /* glsl */ `#version 300 es
${COMMON}${FRAG}
uniform int uMode;
uniform float uFade;
in vec3 vW;
flat in vec3 vP;
out vec4 o;
void main(){
  vec3 rd = normalize(vW - uCam);
  vec3 op = vP - uCam; float tc = max(dot(op, rd), 0.);
  float dl = length(op - rd*tc);
  vec3 c = uMode == 0
    ? CYAN * exp(-dl*dl*9.) * 0.22 / (1. + tc*0.08) * uFade
    : vec3(0.0, 0.25, 0.28) * exp(-dl*dl*0.9) * 0.06;
  o = vec4(c * vignette(), 1.);
}`;
