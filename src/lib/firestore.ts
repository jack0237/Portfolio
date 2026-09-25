// Lecture Firestore côté serveur via l'API REST publique (règles : lecture ouverte).
// Aucun SDK Firebase n'est chargé sur les pages publiques (DESIGN 10.3, SEO 2.8).
// Le workflow n8n et le schéma des documents `blogs` ne changent pas.
// Si la configuration manque (build local sans .env), on renvoie une liste vide :
// la scène Blog affiche alors son état vide, sans casser le build.

export const BLOG_REVALIDATE_SECONDS = 300;

export type BlogPost = {
  id: string;
  title: string;
  date?: string;
  readTime?: string | number;
  eyebrow?: string;
  tags?: string[];
  image?: string;
  lang?: string;
  /** Corps Markdown : seulement avec getBlogPosts({ withContent: true }) ou getBlogPost(). */
  content?: string;
  /** Horodatage dérivé de l'identifiant `Date.now()` écrit par n8n, si valide. */
  timestamp?: number;
};

type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};

type FsDocument = { name: string; fields?: Record<string, FsValue> };

function decode(v: FsValue | undefined): unknown {
  if (!v) return undefined;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(decode);
  if (v.mapValue) {
    const out: Record<string, unknown> = {};
    for (const [k, fv] of Object.entries(v.mapValue.fields ?? {})) out[k] = decode(fv);
    return out;
  }
  return undefined;
}

const str = (x: unknown) => (typeof x === "string" && x.trim() ? x : undefined);

function toPost(doc: FsDocument): BlogPost | null {
  const id = doc.name.split("/").pop() ?? "";
  const f = doc.fields ?? {};
  const title = str(decode(f.title));
  if (!id || !title) return null;
  const rawRead = decode(f.readTime);
  const tags = decode(f.tags);
  const ts = /^\d{12,14}$/.test(id) ? Number(id) : undefined;
  return {
    id,
    title,
    date: str(decode(f.date)),
    readTime: typeof rawRead === "number" || typeof rawRead === "string" ? rawRead : undefined,
    eyebrow: str(decode(f.eyebrow)),
    tags: Array.isArray(tags) ? tags.filter((t): t is string => typeof t === "string") : undefined,
    image: str(decode(f.image)),
    lang: str(decode(f.lang)),
    content: f.content?.stringValue,
    timestamp: ts,
  };
}

function config() {
  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return projectId ? { projectId, apiKey } : null;
}

/** Tous les articles, triés du plus récent au plus ancien (tri sur l'identifiant Date.now()). */
export async function getBlogPosts(opts: { withContent?: boolean } = {}): Promise<BlogPost[]> {
  const cfg = config();
  if (!cfg) {
    console.warn("[firestore] NEXT_PUBLIC_FIREBASE_PROJECT_ID absent : articles non chargés.");
    return [];
  }
  const base = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    cfg.projectId
  )}/databases/(default)/documents/blogs`;
  const posts: BlogPost[] = [];
  let pageToken: string | undefined;
  try {
    // Pagination bornée : le blog compte quelques dizaines d'articles.
    for (let page = 0; page < 10; page++) {
      const params = new URLSearchParams({ pageSize: "100" });
      const fields = ["title", "date", "readTime", "eyebrow", "tags", "image", "lang"];
      if (opts.withContent) fields.push("content");
      for (const field of fields) {
        params.append("mask.fieldPaths", field);
      }
      if (cfg.apiKey) params.set("key", cfg.apiKey);
      if (pageToken) params.set("pageToken", pageToken);
      const res = await fetch(`${base}?${params}`, {
        next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: ["blogs"] },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { documents?: FsDocument[]; nextPageToken?: string };
      for (const d of json.documents ?? []) {
        const p = toPost(d);
        if (p) posts.push(p);
      }
      pageToken = json.nextPageToken;
      if (!pageToken) break;
    }
  } catch (err) {
    // Journalisé côté serveur ; l'interface affiche l'état vide, sans message technique.
    console.error("[firestore] lecture des articles impossible :", err);
    return [];
  }
  const key = (p: BlogPost) => p.timestamp ?? (Number(p.id) || 0);
  return posts.sort((a, b) => key(b) - key(a));
}

export async function getLatestPosts(count = 3): Promise<BlogPost[]> {
  return (await getBlogPosts()).slice(0, count);
}

/** Identifiants acceptés : ceux écrits par n8n (Date.now()) ou l'admin. Tout le reste est une 404. */
const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

/** Un article complet, ou null s'il n'existe pas (la page renvoie alors une vraie 404). */
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  if (!ID_PATTERN.test(id)) return null;
  const cfg = config();
  if (!cfg) {
    console.warn("[firestore] NEXT_PUBLIC_FIREBASE_PROJECT_ID absent : article non chargé.");
    return null;
  }
  const params = new URLSearchParams();
  if (cfg.apiKey) params.set("key", cfg.apiKey);
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    cfg.projectId
  )}/databases/(default)/documents/blogs/${encodeURIComponent(id)}${params.size ? `?${params}` : ""}`;
  const res = await fetch(url, { next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: ["blogs", `blog-${id}`] } });
  if (res.status === 404) return null;
  // Autre erreur : on lève (500) plutôt qu'une fausse 404 ; en ISR, la version en cache reste servie.
  if (!res.ok) throw new Error(`[firestore] article ${id} : HTTP ${res.status}`);
  return toPost((await res.json()) as FsDocument);
}

/** Date ISO 8601 de publication, dérivée de l'identifiant Date.now() (SEO 2.3). */
export function postDateISO(post: BlogPost): string | undefined {
  return post.timestamp ? new Date(post.timestamp).toISOString() : undefined;
}
