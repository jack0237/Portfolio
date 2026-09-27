"use client";

import dynamic from "next/dynamic";

// /admin : rendu 100 % client (session de l'API api.jack0237.com, éditeur Markdown, Bootstrap).
const Admin = dynamic(() => import("./Admin"), {
  ssr: false,
  loading: () => <p style={{ padding: "200px 0", textAlign: "center" }}>Loading…</p>,
});

export default function AdminLoader() {
  return <Admin />;
}
