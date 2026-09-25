import Certifications from "@/components/Certifications/Certifications";
import Resume from "@/components/Resume/ResumeNew";
import { LegacyShell } from "@/components/LegacyShell";
import { pageMetadata } from "@/site/metadata";

// CV + Certifications (fusionnés, /certifications redirige ici : SEO 2.4). Pages héritées, refonte à venir.
export const metadata = pageMetadata("resume", "en");

export default function Page() {
  return (
    <LegacyShell locale="en" alternates={{ fr: "/resume", en: "/en/resume" }} current="resume">
      <Resume />
      <Certifications />
    </LegacyShell>
  );
}
