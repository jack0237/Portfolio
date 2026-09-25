import type { Dictionary } from "@/i18n/dictionaries";
import { STACK_LOGO_PATHS } from "@/site/stack-logos/paths";
import { Scene } from "./Scene";

const NAMES: Record<string, string> = {
  react: "React",
  nodejs: "Node.js",
  express: "Express",
  postgresql: "PostgreSQL",
  expo: "Expo / React Native",
  flutter: "Flutter",
  n8n: "n8n",
  docker: "Docker",
  traefik: "Traefik",
  firebase: "Firebase",
  supabase: "Supabase",
};

// Scène 04, « L'équipement » (DESIGN 7.8) : logos monochromes (Simple Icons, CC0),
// nom de chaque outil en texte accessible, pas de barres de pourcentage.
// Liste = candidats de DESIGN 7.8 (à valider par l'utilisateur).
export function StackScene({ dict }: { dict: Dictionary }) {
  const s = dict.home.stack;
  return (
    <Scene
      id="stack"
      step={4}
      label={dict.home.steps[3]}
      title={s.title}
      titleId="stack-title"
      tone="bg"
      className="stack"
      aside={<p className="scene__intro" data-reveal>{s.intro}</p>}
    >
      <div className="stack__groups">
        {s.groups.map((g) => (
          <div key={g.label} className="stack__group" data-reveal>
            <h3 className="meta stack__label">{g.label}</h3>
            <ul className="stack__logos" role="list" aria-label={g.aria}>
              {g.tools.map((tool) => {
                const name = tool === "gemini" ? s.gemini : NAMES[tool] ?? tool;
                return (
                  <li key={tool} className="stack__logo" data-name={name}>
                    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={name}>
                      <title>{name}</title>
                      {(STACK_LOGO_PATHS[tool] ?? []).map((d, i) => (
                        <path key={i} d={d} />
                      ))}
                    </svg>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="stack__baseline" aria-hidden="true">
        <span className="thread-head" />
      </div>
    </Scene>
  );
}
