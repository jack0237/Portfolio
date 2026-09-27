import Certifications from "@/components/Certifications/Certifications";
import Resume from "@/components/Resume/ResumeNew";
import { LegacyShell } from "@/components/LegacyShell";
import { getCertifications, getExperiences, getSkills } from "@/lib/api";
import { pageMetadata } from "@/site/metadata";

// CV + Certifications (fusionnés, /certifications redirige ici : SEO 2.4). Pages héritées, refonte à venir.
// Données lues dans l'API côté serveur, ISR 300 s + revalidation à la demande
// (tags `experiences`, `skills`, `certifications`).
export const revalidate = 300;
export const metadata = pageMetadata("resume", "fr");

export default async function Page() {
  const [experiences, skills, certifications] = await Promise.all([
    getExperiences(),
    getSkills(),
    getCertifications(),
  ]);
  return (
    <LegacyShell locale="fr" alternates={{ fr: "/resume", en: "/en/resume" }} current="resume">
      <Resume
        experiences={experiences}
        skills={skills}
        emptyExperiences="Aucune expérience publiée pour le moment."
        emptySkills="Aucune compétence publiée pour le moment."
      />
      <Certifications certifications={certifications} emptyLabel="Aucune certification publiée pour le moment." />
    </LegacyShell>
  );
}
