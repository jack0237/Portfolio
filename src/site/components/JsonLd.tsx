// JSON-LD injecté côté serveur ; « < » échappé contre l'injection (doc Next.js, guide JSON-LD).
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
