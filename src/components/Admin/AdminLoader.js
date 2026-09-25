"use client";

import dynamic from "next/dynamic";

// /admin : rendu 100 % client (auth Firebase, éditeur Markdown, Bootstrap).
const Admin = dynamic(() => import("./Admin"), {
  ssr: false,
  loading: () => <p style={{ padding: "200px 0", textAlign: "center" }}>Loading…</p>,
});

export default function AdminLoader() {
  return <Admin />;
}
