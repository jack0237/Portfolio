import Certifications from "@/components/Certifications/Certifications";
import Resume from "@/components/Resume/ResumeNew";
import { LegacyShell } from "@/components/LegacyShell";
import { getCertifications, getExperiences, getSkills } from "@/lib/api";
import { pageMetadata } from "@/site/metadata";

// CV + Certifications (fusionnés, /certifications redirige ici : SEO 2.4). Pages héritées, refonte à venir.
// Données lues dans l'API côté serveur, ISR 300 s + revalidation à la demande
// (tags `experiences`, `skills`, `certifications`).
export const revalidate = 300;
export const metadata = pageMetadata("resume", "en");

export default async function Page() {
  const [experiences, skills, certifications] = await Promise.all([
    getExperiences(),
    getSkills(),
    getCertifications(),
  ]);
  return (
    <LegacyShell locale="en" alternates={{ fr: "/resume", en: "/en/resume" }} current="resume">
      <Resume
        experiences={experiences}
        skills={skills}
        emptyExperiences="No experience published yet."
        emptySkills="No skills published yet."
      />
      <Certifications certifications={certifications} emptyLabel="No certifications published yet." />
    </LegacyShell>
  );
}
