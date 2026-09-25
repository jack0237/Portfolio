import Projects from "@/components/Projects/Projects";
import { LegacyShell } from "@/components/LegacyShell";
import { pageMetadata } from "@/site/metadata";

// Page héritée portée telle quelle (refonte à venir, DESIGN 13).
export const metadata = pageMetadata("projects", "fr");

export default function Page() {
  return (
    <LegacyShell locale="fr" alternates={{ fr: "/projects", en: "/en/projects" }} current="projects">
      <Projects />
    </LegacyShell>
  );
}
