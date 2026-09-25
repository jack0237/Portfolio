import { HomePage } from "@/site/home/HomePage";
import { homeMetadata } from "@/site/metadata";

// ISR : les articles publiés par n8n apparaissent sans rebuild (DESIGN 12.2).
export const revalidate = 300;
export const metadata = homeMetadata("fr");

export default function Page() {
  return <HomePage locale="fr" />;
}
