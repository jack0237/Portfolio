// Client de l'API du portfolio (https://api.jack0237.com, Fastify + PostgreSQL), remplace Firebase.
//
// Deux usages :
// - Lectures publiques côté serveur (Server Components, sitemap) : fetch ISR, revalidate 300 s et tags
//   identiques au contrat de revalidation de l'API (`blogs`, `blog-<id>`, `projects`, `experiences`,
//   `skills`, `certifications`). Une écriture dans l'API appelle /api/revalidate avec ces tags.
//   API injoignable ou en erreur : liste vide (jamais d'échec de build, jamais de contenu inventé).
// - Admin (navigateur) : `adminFetch` envoie le cookie de session de api.jack0237.com
//   (`credentials: "include"`) et remonte les erreurs de l'API sous forme d'`ApiError`.
//
// Ce module n'importe rien de spécifique au serveur : il est utilisable des deux côtés.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.jack0237.com").replace(/\/+$/, "");

export const REVALIDATE_SECONDS = 300;
/** Au-delà, une lecture est abandonnée : l'API down ne doit pas bloquer le build ni une page. */
const READ_TIMEOUT_MS = 8000;

export const COLLECTIONS = ["blogs", "projects", "experiences", "skills", "certifications"] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

/** Identifiants acceptés par l'API (`^[A-Za-z0-9_-]{1,128}$`). Tout le reste est une 404 côté site. */
export const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

type Meta = { id: string; createdAt?: string; updatedAt?: string };

export type BlogPost = Meta & {
  title: string;
  date?: string;
  readTime?: string | number;
  eyebrow?: string;
  tags?: string[];
  /** URL complète (média de l'API ou externe) ou clé d'image locale historique (`blogImg1`...). */
  image?: string;
  lang?: string;
  /** Corps Markdown : seulement avec `getBlogPosts({ withContent: true })` ou `getBlogPost()`. */
  content?: string;
  publishedAt?: string;
  /** Horodatage de publication (ms), dérivé de `publishedAt`, sinon d'un identifiant `Date.now()`. */
  timestamp?: number;
};

export type Project = Meta & {
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
  category?: string;
  status?: string;
  link?: string;
  sortOrder?: number;
};

export type Experience = Meta & {
  title: string;
  company?: string;
  date?: string;
  description?: string;
  sortOrder?: number;
};

export type Skill = Meta & { label: string; level?: number; sortOrder?: number };

export type Certification = Meta & {
  title: string;
  issuer?: string;
  date?: string;
  status?: "completed" | "ongoing";
  link?: string;
  sortOrder?: number;
};

type ListResponse<T> = { items?: T[]; total?: number };

export function apiUrl(path: string): string {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// ------------------------------------------------------------------ lectures publiques (serveur)

function isIsrRegeneration(): boolean {
  return (
    typeof window === "undefined" &&
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  );
}

/** Liste d'une collection en ISR. Erreur réseau ou HTTP : journalisée, liste vide (voir ci-dessous). */
async function readList<T>(collection: CollectionName, params: Record<string, string> = {}): Promise<T[]> {
  const qs = new URLSearchParams({ limit: "500", ...params });
  try {
    const res = await fetch(apiUrl(`/v1/${collection}?${qs}`), {
      next: { revalidate: REVALIDATE_SECONDS, tags: [collection] },
      signal: AbortSignal.timeout(READ_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as ListResponse<T>;
    return Array.isArray(json.items) ? json.items : [];
  } catch (err) {
    console.error(`[api] lecture de ${collection} impossible :`, (err as Error).message);
    // Au build et en dev : état vide, le build ne casse jamais. En régénération ISR (production) : on
    // lève, Next.js garde alors la page déjà en cache au lieu de la remplacer par une version vide.
    if (isIsrRegeneration()) throw err;
    return [];
  }
}

const isStr = (x: unknown): x is string => typeof x === "string" && x.trim() !== "";

function toPost(raw: Partial<BlogPost>): BlogPost | null {
  if (!raw || !isStr(raw.id) || !isStr(raw.title)) return null;
  const published = raw.publishedAt ? Date.parse(raw.publishedAt) : NaN;
  const fromId = /^\d{12,14}$/.test(raw.id) ? Number(raw.id) : undefined;
  return {
    ...raw,
    id: raw.id,
    title: raw.title,
    date: isStr(raw.date) ? raw.date : undefined,
    readTime: isStr(raw.readTime) || typeof raw.readTime === "number" ? raw.readTime : undefined,
    eyebrow: isStr(raw.eyebrow) ? raw.eyebrow : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.filter(isStr) : undefined,
    image: isStr(raw.image) ? raw.image : undefined,
    lang: isStr(raw.lang) ? raw.lang : undefined,
    timestamp: Number.isFinite(published) ? published : fromId,
  };
}

/** Tous les articles, du plus récent au plus ancien (tri fait par l'API sur `publishedAt`). */
export async function getBlogPosts(opts: { withContent?: boolean } = {}): Promise<BlogPost[]> {
  const items = await readList<Partial<BlogPost>>("blogs", opts.withContent ? { withContent: "true" } : {});
  return items.map(toPost).filter((p): p is BlogPost => p !== null);
}

export async function getLatestPosts(count = 3): Promise<BlogPost[]> {
  return (await getBlogPosts()).slice(0, count);
}

/**
 * Un article complet, ou null s'il n'existe pas (la page renvoie alors une vraie 404).
 * Une autre erreur (API en panne) lève une exception : 500 plutôt qu'une fausse 404,
 * et en ISR la version déjà en cache continue d'être servie.
 */
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  if (!ID_PATTERN.test(id)) return null;
  const res = await fetch(apiUrl(`/v1/blogs/${encodeURIComponent(id)}`), {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["blogs", `blog-${id}`] },
    signal: AbortSignal.timeout(READ_TIMEOUT_MS),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`[api] article ${id} : HTTP ${res.status}`);
  return toPost((await res.json()) as Partial<BlogPost>);
}

export const getProjects = () => readList<Project>("projects");
export const getExperiences = () => readList<Experience>("experiences");
export const getSkills = () => readList<Skill>("skills");
export const getCertifications = () => readList<Certification>("certifications");

/** Date ISO 8601 de publication (JSON-LD, sitemap, Open Graph). */
export function postDateISO(post: BlogPost): string | undefined {
  return post.timestamp ? new Date(post.timestamp).toISOString() : undefined;
}

// ------------------------------------------------------------------ images d'articles

/** Clés historiques envoyées par n8n (`image: "blogImg1"`) : visuels de repli de `public/images/blog/`. */
const LEGACY_IMAGE_KEYS: Record<string, BlogFallback> = {
  blogImg1: "grille",
  blogImg2: "fil",
  blogImg3: "brume",
};
export const BLOG_FALLBACKS = ["grille", "fil", "brume"] as const;
export type BlogFallback = (typeof BLOG_FALLBACKS)[number];

export type BlogImage =
  | { kind: "url"; src: string }
  | { kind: "fallback"; name: BlogFallback; avif: string; webp: string; og: string };

function fallback(name: BlogFallback): BlogImage {
  const base = `/images/blog/blog-fallback-${name}`;
  return { kind: "fallback", name, avif: `${base}.avif`, webp: `${base}.webp`, og: `${base}-og.jpg` };
}

/**
 * Image d'un article : URL https (média de l'API ou externe), clé historique connue, sinon un visuel
 * de repli choisi de façon stable à partir de `seed` (horodatage ou rang).
 */
export function resolveBlogImage(image: string | undefined, seed = 0): BlogImage {
  if (image && /^https:\/\//.test(image)) return { kind: "url", src: image };
  if (image && LEGACY_IMAGE_KEYS[image]) return fallback(LEGACY_IMAGE_KEYS[image]);
  return fallback(BLOG_FALLBACKS[Math.abs(Math.trunc(seed)) % BLOG_FALLBACKS.length]);
}

// ------------------------------------------------------------------ admin (navigateur)

/** Origines d'où l'admin fonctionne (cookie `SameSite=Strict` de api.jack0237.com, CORS de l'API). */
export const ADMIN_ORIGINS = ["https://jack0237.com", "https://www.jack0237.com", "http://localhost:3000"];

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Requête d'admin : cookie de session inclus, jamais de cache. Corps objet envoyé en JSON,
 * `FormData` envoyé tel quel (upload). Réponse 204 : null. Erreur : `ApiError` avec le message de l'API.
 */
export async function adminFetch<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<T> {
  const { method = "GET", body } = init;
  const headers: Record<string, string> = {};
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers["content-type"] = "application/json";
    payload = JSON.stringify(body);
  }
  let res: Response;
  try {
    res = await fetch(apiUrl(path), { method, headers, body: payload, credentials: "include", cache: "no-store" });
  } catch {
    throw new ApiError(0, "API injoignable. Vérifiez la connexion ou l'état de api.jack0237.com.");
  }
  if (res.status === 204) return null as T;
  const json = (await res.json().catch(() => null)) as { error?: string; message?: string } | null;
  if (!res.ok) throw new ApiError(res.status, json?.message || `Erreur HTTP ${res.status}`, json?.error);
  return json as T;
}
