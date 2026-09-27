import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";

// Revalidation à la demande appelée par portfolio-api après chaque écriture (création, mise à jour,
// suppression), voir README de l'API, section « Intégration côté site ».
//   POST /api/revalidate
//   Authorization: Bearer <REVALIDATE_SECRET>
//   { "collection": "blogs", "id": "1790536265275", "action": "create",
//     "tags": ["blogs", "blog-1790536265275"], "paths": ["/", "/blog", "/blog/1790536265275"] }
// Réponses : 200 (revalidé), 400 (corps invalide), 401 (secret absent ou faux, ou route non configurée).
//
// Les tags sont ceux posés par src/lib/api.ts sur les fetch ISR : ils couvrent aussi les pages EN.
// `{ expire: 0 }` : la prochaine visite relit l'API au lieu de servir la version périmée, pour qu'un
// article publié ou supprimé soit visible (ou retiré) tout de suite. Le trafic est faible, le coût nul.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLLECTIONS = new Set(["blogs", "projects", "experiences", "skills", "certifications"]);
const ACTIONS = new Set(["create", "update", "delete"]);
const TAG_RE = /^[A-Za-z0-9_-]{1,160}$/;
const PATH_RE = /^\/(?!\/)[A-Za-z0-9_\-/.]{0,300}$/;
const MAX_ITEMS = 20;

/** Comparaison en temps constant (empreintes de même longueur, quel que soit le secret reçu). */
function secretMatches(received: string, expected: string): boolean {
  const a = createHash("sha256").update(received).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function stringList(value: unknown, re: RegExp): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_ITEMS) return null;
  if (!value.every((v) => typeof v === "string" && re.test(v))) return null;
  return value as string[];
}

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  // Sans secret configuré, la route refuse tout (jamais de revalidation ouverte).
  if (!secret || !token || !secretMatches(token, secret)) {
    return json(401, { error: "UNAUTHORIZED" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "INVALID_JSON" });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { error: "INVALID_BODY" });
  const { collection, id, action, tags: rawTags, paths: rawPaths } = body as Record<string, unknown>;

  if (typeof collection !== "string" || !COLLECTIONS.has(collection)) return json(400, { error: "INVALID_COLLECTION" });
  if (id !== undefined && (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(id))) {
    return json(400, { error: "INVALID_ID" });
  }
  if (action !== undefined && (typeof action !== "string" || !ACTIONS.has(action))) {
    return json(400, { error: "INVALID_ACTION" });
  }
  const tags = stringList(rawTags, TAG_RE);
  const paths = stringList(rawPaths, PATH_RE);
  if (!tags) return json(400, { error: "INVALID_TAGS" });
  if (!paths) return json(400, { error: "INVALID_PATHS" });

  // La collection elle-même est toujours revalidée, même si l'appelant n'envoie pas de tags.
  const allTags = Array.from(new Set([collection, ...tags]));
  for (const tag of allTags) revalidateTag(tag, { expire: 0 });
  for (const path of paths) revalidatePath(path);

  return json(200, { revalidated: true, tags: allTags, paths, now: Date.now() });
}
