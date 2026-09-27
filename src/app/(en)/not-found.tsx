import type { Metadata } from "next";
import { NotFoundPage } from "@/site/components/NotFoundPage";

// notFound() dans le groupe (en) : 404 du site plutôt que celle de Next (QA F06).
export const metadata: Metadata = {
  title: "404 | Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage locale="en" />;
}
