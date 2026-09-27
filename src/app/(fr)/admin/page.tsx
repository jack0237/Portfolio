import type { Metadata } from "next";
import AdminLoader from "@/components/Admin/AdminLoader";
import "@/components/legacy.css";

// Admin : noindex, nofollow (SEO 2.2). Non bloqué dans robots.txt pour que Google lise le noindex.
// Rendu client uniquement, protégé par l'authentification Firebase (règles Firestore inchangées).
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function Page() {
  return (
    <main id="main" className="legacy admin-root">
      <AdminLoader />
    </main>
  );
}
