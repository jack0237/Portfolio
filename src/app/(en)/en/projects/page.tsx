import Projects from "@/components/Projects/Projects";
import { LegacyShell } from "@/components/LegacyShell";
import { getProjects } from "@/lib/api";
import { pageMetadata } from "@/site/metadata";

// Page héritée portée telle quelle (refonte à venir, DESIGN 13). Projets lus dans l'API côté serveur,
// ISR 300 s + revalidation à la demande (tag `projects`).
export const revalidate = 300;
export const metadata = pageMetadata("projects", "en");

export default async function Page() {
  const projects = await getProjects();
  return (
    <LegacyShell locale="en" alternates={{ fr: "/projects", en: "/en/projects" }} current="projects">
      <Projects projects={projects} emptyLabel="No projects published yet." />
    </LegacyShell>
  );
}
