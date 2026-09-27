# AUDIT.md : QA de l'Accueil (FR / EN) et contrôle rapide des pages portées

Auditeur : `ux-qa-auditor`. Date : 2026-09-26. Branche `redesign/nextjs`.
Méthode : `npm run build` (OK, Next 16.3.6), `next start -p 3417`, Playwright + Chrome (GPU ANGLE, défilement molette par petits pas), axe-core 4.x injecté, Lighthouse 13 (Chrome headless, hors `package.json`), mesures DOM et de contraste sur captures (fond échantillonné sous chaque texte, 98e centile de luminance). Build local **sans variables Firebase** : l'état vide du blog, des projets et du CV est attendu et n'est pas signalé.

Captures : `docs/screenshots/qa/`.

## Synthèse

**Verdict : aucun bloquant. Mise en production possible après correction des 6 points « À corriger », dont 3 prioritaires (F01, F03, F04).**

| Gravité | Nombre |
|---|---|
| Bloquant | 0 |
| À corriger | 6 |
| Mineur | 9 |
| Suggestion | 4 |

### Scores Lighthouse (Lighthouse 13, `next start` local, sans Firebase)

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS | TBT | Poids |
|---|---|---|---|---|---|---|---|---|---|
| `/` mobile | **84** | 100 | 100 | 100 | **3,8 s** | 0 | 130 ms | 455 Ko |
| `/` desktop | 96 | 100 | 100 | 100 | 0,8 s | 0 | 160 ms | 482 Ko |
| `/en` mobile | **82** | 100 | 100 | 100 | **3,8 s** | 0 | 220 ms | 455 Ko |
| `/en` desktop | 100 | 100 | 100 | 100 | 0,7 s | 0 | 60 ms | 481 Ko |

Mesures complémentaires (PerformanceObserver, Chrome réel) : 1440 px LCP 380 ms (élément : mot géant) ; 390 px LCP 244 ms sans bridage, **2,1 s (FR) et 2,7 s (EN)** avec CPU x4 et réseau 1,6 Mb/s (élément : poster du relief) ; CLS 0 au chargement et 0,0001 après défilement complet.

Budgets DESIGN 10.2 : polices 176 Ko (≤ 180, OK) ; poids total 455 Ko mobile (≤ 500, OK) et 482 Ko desktop (≤ 900, OK) ; **JS initial ~136 Ko compressés** (budget 120 Ko hors animation, F13) ; **LCP mobile au-dessus du budget** (F05).

### Ce qui est conforme (vérifié)

- Responsive 390, 768, 1024, 1280, 1440, 1920, FR et EN : **aucun débordement horizontal** à aucun moment du défilement, **aucune erreur ni avertissement console**, les 27 blocs `[data-reveal]` finissent tous à opacité 1.
- Titres : un seul H1 (« Wilfried NGUEGUIM »), un H2 par scène (Projets, Services, Stack, Blog, Parlons-en), H3/H4 conformes à SEO 3.3.
- Landmarks : `header`, `nav` nommée, `main#main`, sections nommées par leur H2, `footer`. axe-core (WCAG 2.2 A/AA + bonnes pratiques) : une seule violation, modérée (F08).
- Clavier : lien d'évitement premier focusable, visible, fonctionnel ; ordre de tabulation = ordre de lecture ; focus visible partout (anneau cyan 2 px, blanc sur les boutons cyan) ; les cartes d'automatisation focalisées sont amenées à l'écran.
- Menu mobile : `dialog` modal, Échap ferme et rend le focus au bouton « Ouvrir le menu », le lien Contact ferme le menu et mène à `#contact`.
- Ancres : « Voir mes projets » et « Contact » posent le H2 à 297 px (1440) / 173 px (390), jamais sous la navbar (voir toutefois F01 pour le contenu).
- `prefers-reduced-motion` : `data-motion="reduced"`, **aucun canvas, aucun épinglage, 4 chunks d'animation (GSAP, Lenis, moteur, relief) jamais téléchargés**. Interrupteur du footer : `role="switch"`, `aria-checked`, `aria-describedby` ; bascule en direct (canvas et épinglages retirés), mémorisé, rechargement sans chunk d'animation.
- Contraste sur le relief (canvas animé, 3 à 4 s après chargement) : pire cas « Étape 01 » 5,3:1, phrase de valeur 7,0:1, alias 7,3:1, titre 12,5:1, mot géant 13,8:1, liens de navbar 7,3:1. Tout passe AA **sauf là où l'onglet de contact recouvre le texte** (F03). Ailleurs sur la page (mode réduit, 134 textes mesurés) : aucun échec réel (les seuls signalements sont des artefacts de mesure : bordures de boutons, cadres des schémas).
- Sélecteur de langue : vrais liens `/` et `/en`, `hreflang`, `lang`, `aria-current` sur le segment actif.
- Métadonnées : title, description, OG (image 1200 x 630, 200), Twitter, canonical, hreflang fr / en / x-default, JSON-LD Person + WebSite + ProfilePage conformes à SEO 3.2 et CONTENT 0 ; `robots.txt`, `sitemap.xml` (alternates), manifest, favicon, CV PDF en 200.
- Texte : **0 tiret cadratin**, **aucun numéro de téléphone**, aucun reste du template ni `[À COMPLÉTER]` sur l'Accueil (FR et EN).
- 404 globale : bilingue, `noindex`, deux liens retour, parties anglaises en `lang="en"`.
- Pages portées (`/projects`, `/resume`, `/blog`, EN, `/admin`, redirection `/certifications` vers `/resume#certifications`) : 200, aucune erreur console, aucun débordement à 390 et 1440, `/admin` en `noindex, nofollow`.

## Point connu : la fiche Relanceo épinglée (palier riche)

Tracé de l'épinglage pas à pas (molette 60 px) à plusieurs tailles d'écran :

| Fenêtre | Épinglée ? | Haut de la fiche | Haut du titre | Navbar | Constat |
|---|---|---|---|---|---|
| 1920 x 1080 | oui | 213 px | 238 px | 72 px | Titre visible ; fiche vide au départ |
| 1600 x 900 | oui | 123 px | 148 px | 72 px | Titre visible ; fiche vide au départ |
| 1536 x 864 | oui | 105 px | 130 px | 72 px | Titre visible ; fiche vide au départ |
| 1440 x 900 | oui | 104 px | 129 px | 72 px | Titre visible ; fiche vide au départ |
| **1440 x 815** | oui | **62 px** | 87 px | 72 px | **Ligne « FIG. 01 » sous la navbar**, titre à 15 px d'elle |
| 1366 x 768, 1280 x 800, 1024 x 768 | non (repli) | | | | Garde-fou `fits` : révélation simple, OK |

- **« Titre caché sous la navbar » : plus reproduit à 1440 x 900** (le garde-fou `fits` et la fiche plus courte l'ont réglé), mais le principe demeure : la fiche est centrée (`start: "center center"`), donc son haut passe sous la navbar dès que la hauteur libre est inférieure à ~144 px (fenêtres de 800 à 830 px de haut avec la fiche actuelle, cas courant d'un portable 1440 x 900 avec la barre du navigateur). Voir F02.
- **« Paraît vide au tout début » : confirmé et plus gênant qu'annoncé.** Au démarrage de l'épinglage, les 8 blocs sont à opacité 0 : l'écran entier n'affiche que « FIG. 01 · SAAS · EN PRODUCTION » en filigrane, et le H2 « Projets » est déjà passé sous la navbar (bas du H2 à 49 px). Il faut environ 140 px de molette pour voir le titre « Relanceo », ~500 px pour le problème et la liste, ~1000 px pour le bouton. Et le CTA principal du hero, « Voir mes projets », amène exactement sur ce vide : H2 « PROJETS » puis un écran bleu nuit sans rien. Voir F01.

## Findings

| ID | Gravité | Page, viewport | Description | Preuve | Correction recommandée | Rôle | Statut (2026-09-26) |
|---|---|---|---|---|---|---|---|
| F01 | **À corriger** (prioritaire) | Accueil FR/EN, palier riche (≥ 1024 px avec épinglage : 1440 x 900, 1536, 1600, 1920) | Fiche Relanceo épinglée **vide au démarrage** : 8 blocs à opacité 0, seul « FIG. 01 » visible sur un écran bleu nuit ; H2 « Projets » déjà sous la navbar. Le CTA principal « Voir mes projets » atterrit sur ce vide (H2 seul puis écran vide) : un recruteur pressé croit la section cassée. | `relanceo-1440x900-pin-00.png`, `sweep-fr-1440-02-projects.png`, `anchor-1440-voir-projets.png` ; tracé : opacités `[0,0,0,0,0,0,0,0]` à y = 1071, titre complet seulement ~140 px plus bas, dernier bloc à ~1000 px | Ne jamais épingler une fiche vide : afficher d'entrée « FIG. 01 », le nom et le sous-titre (révélés à l'entrée de scène, comme les autres `[data-reveal]`) et réserver le scrub aux blocs suivants ; ou démarrer l'épinglage quand la fiche est déjà révélée (`start: "top top+=<nav+24>"` et révélation avant l'épinglage). Ramener l'ancre `#projects` (et l'ancre après clic) sur un état où le contenu est visible. Réduire la course (`end: +=120%`) si le scrub est conservé. | frontend-developer (chorégraphie à valider par design-director) | **Corrigé** (2026-09-26) : en-tête (FIG., nom, sous-titre) révélé dès l'entrée de scène (0,8 s, `top 85%`) ; les 5 blocs suivants sont scrubbés (`scrub: 1`) sur une course qui démarre avant l'épinglage (`top 85%`) et finit avec lui (`+=120%`), plus une pause finale. Mesuré à l'épinglage (1440 x 900, 1440 x 815, 1920 x 1080, EN) : opacités `1,1,1,1,0.98,0.83,0.39,0`. Ancre « Voir mes projets » : H2 + nom + sous-titre + problème visibles (`after-anchor-*`). Tous les blocs à 1 en sortie. |
| F02 | **À corriger** | Accueil FR/EN, palier riche, fenêtres de 800 à 830 px de haut (ex. 1440 x 815) | Point connu, en partie résolu : la fiche épinglée est centrée ; quand la hauteur libre est < ~144 px, son haut passe sous la navbar : ligne « FIG. 01 » coupée, titre collé à 15 px de la navbar. | `relanceo-1440x815-pin-04.png`, `relanceo-1440x815-pin-00.png` ; haut de fiche 62 px < navbar 72 px | Épingler sous la navbar plutôt qu'au centre (`start: "top top+=96"` par exemple) et calculer `fits` sur `innerHeight - navH - 2 x 24`. | frontend-developer | **Corrigé** : épinglage `start: top top+=<navbar + 24>` (96 px) au lieu du centrage ; garde-fou `fits` sur `innerHeight - 120`. Haut de fiche à 96 px, titre à 121 px (navbar 72) à 1440 x 815, 1440 x 900, 1920 x 1080 ; 1440 x 800 et 1280 x 800 : repli non épinglé (`after-relanceo-*`). |
| F03 | **À corriger** (prioritaire) | Accueil FR/EN, 1024 à 1279 px (et carrousel épinglé à 1440) | L'onglet « Me contacter » fixe (44 px) est plus large que la marge latérale `lg` (40 px) : il **recouvre le titre de métier et l'alias du hero** (« automatisation IA », « alias Jack0237 », EN « Full-stack & AI automation developer » coupé), le cadre de citation Relanceo et tout contenu aligné à droite. Contraste mesuré de l'alias sous l'onglet : 1,18:1. À 1280 px, l'onglet touche le titre (4 px). À 1440 px, la 3e carte d'automatisation va jusqu'au bord de la fenêtre et passe sous l'onglet (texte « Doublons », « Gemini » et anneau de focus masqués). | `sweep-fr-1024-00-hero.png`, `sweep-en-1024-00-hero.png`, `sweep-fr-1024-02-projects.png`, `sweep-en-1280-00-hero.png`, `kbd-1440-carte3-sous-onglet.png` | Marge latérale ≥ 56 px quand l'onglet est affiché (ou onglet réservé à ≥ 1280 px) ; `padding-right` de la zone de contenu égal à la largeur de l'onglet ; fin de course du carrousel alignée sur le bord du conteneur (1376 px) et non sur celui de la fenêtre. | frontend-developer, design-director (arbitrage marge ou seuil) | **Corrigé** : onglet affiché seulement dès 1280 px ; nouveau token `--margin-end` = max(`--margin`, largeur de l'onglet + 24 px) appliqué au bord droit du `.container`, de la grille apparente, des croix et du carrousel. Onglet à 24 px du texte à 1280 / 1440 (bord du titre 1212 / 1372, onglet 1236 / 1396) ; absent à 1024 / 1180. Fin de course du carrousel au bord du conteneur (1372 à 1440, 1212 à 1280, 1692 à 1920) (`after-tab-*`, `after-carousel-*-end`). |
| F04 | **À corriger** (prioritaire) | Accueil, carrousel des automatisations, 390 et 1440 | En arrivant à la dernière carte, le bouton « Automatisation suivante » devient `disabled` : **le focus clavier est perdu** (retombe sur `body`, WCAG 2.4.3). Tab suivant = carte 01 ; en palier riche, le `onFocus` du carrousel **rembobine alors à 01 / 03**. Idem pour « précédente » à la première carte. | Log Playwright : `02/03 (focus bouton) → 03/03 (focus BODY) → Tab → 01/03 (ARTICLE)` à 1440 et 390 ; `carousel-1440-after-next-x2.png`, `carousel-390-after-next-x2.png` | Remplacer `disabled` par `aria-disabled="true"` + clic sans effet (le bouton garde le focus), ou déplacer le focus sur l'autre bouton au moment de la désactivation. | frontend-developer | **Corrigé** : `aria-disabled` au lieu de `disabled` (le bouton garde le focus, clic sans effet en bout de course) ; l'entrée dans la piste au clavier (Tab ou Maj+Tab depuis l'extérieur) renvoie le focus sur la carte affichée sans rembobiner ; défilement de la fenêtre de visualisation remis à 0 en palier riche. Trace clavier réelle 1440 et 390 : `02/03 → 03/03 (focus bouton) → Entrée (03/03, focus bouton) → Tab → 03/03 (carte 3)`. |
| F05 | **À corriger** | Accueil FR/EN, mobile | **LCP mobile 3,8 s** (Lighthouse, budget 2,5 s ; perf 84 / 82). L'élément LCP mobile est le **poster du relief** (fond CSS `image-set`), non découvrable dans le HTML, sans préchargement ni `fetchpriority` ; « element render delay » 2,2 s. Bridage CPU x4 en Chrome réel : 2,1 s (FR), 2,7 s (EN). DESIGN 10.3 prévoyait le mot géant comme LCP. | `lh-*-mobile` (insights `lcp-discovery`, `lcp-breakdown`), PerformanceObserver ci-dessus | Précharger le poster mobile (`<link rel="preload" as="image" imagesrcset=… type="image/avif" media="(max-aspect-ratio: 1/1)" fetchpriority="high">`, idem desktop), ou le rendre en `<picture><img fetchpriority="high" decoding="async">`. Vérifier aussi les 3 CSS bloquantes (~620 ms estimés en mobile). | frontend-developer | **Corrigé en partie** : poster préchargé (`ReactDOM.preload`, AVIF, `media` par ratio, `fetchpriority=high`), insight `lcp-discovery` au vert ; moteur GSAP chargé après `load` (ne concurrence plus l'élément LCP). Lighthouse mobile `/` : perf 92 (84), LCP 3,2 s (3,8), TBT ~100 ms, stable sur 5 essais ; `/en` 91 à 93, 3,2 s. Chrome réel CPU x4 + 1,6 Mb/s sans cache : 2,2 à 3,0 s. Reste au-dessus de 2,5 s en simulation : JS du framework téléchargé avant le LCP (voir F13). |
| F06 | **À corriger** | `/blog/<id inconnu>` (FR, et probablement toute `notFound()` dans les groupes `(fr)` / `(en)`) | La 404 d'article est la **404 par défaut de Next** : page blanche, texte anglais « This page could not be found. », titre « 404: This page could not be found. », sans navbar ni footer, avec l'onglet braise par-dessus. La 404 globale, elle, est soignée. | `404-_blog_does_not_exist.png` (comparer à `404-_nope_xyz.png`) | Ajouter `not-found.tsx` dans `app/(fr)` et `app/(en)` en reprenant le rendu de `global-not-found` (textes existants), dans la bonne langue. | frontend-developer | **Corrigé** : `app/(fr)/not-found.tsx` et `app/(en)/not-found.tsx` (composant `NotFoundPage`) : rendu de la 404 globale dans la langue du groupe, navbar + footer, `noindex`, sans onglet. `/blog/does-not-exist` : 404 stylée FR (`after-_blog_does-not-exist-*`). |
| F07 | Mineur | Accueil, 1440 x 900, carrousel épinglé | Les boutons du carrousel épinglé commencent à 68 px, sous la navbar (72 px) : le haut de l'anneau de focus (décalé de 3 px) est masqué. | Trace clavier : bouton « suivante » `top: 68` après le premier clic ; `kbd-1440-carte3-sous-onglet.png` | Décaler l'épinglage des automatisations de la hauteur de la navbar + 16 px. | frontend-developer | **Corrigé** : épinglage des automatisations à navbar + 16 px + débord des contrôles ; boutons à 88 px (navbar 72). |
| F08 | Mineur | Toutes les pages ≥ 1024 px | axe `region` (modéré) : l'onglet de contact est hors de tout landmark. Il est aussi le dernier élément du DOM, donc le dernier atteint au clavier. | axe-core, 1440 FR et EN | L'envelopper dans un `<aside aria-label="Contact">` (ou le placer dans le `header`). | frontend-developer | **Corrigé** : onglet enveloppé dans `<aside aria-label>` (masqué avec lui sous 1280 px). |
| F09 | Mineur | Accueil, footer (FR/EN) | Les intitulés de colonnes du footer sont des H2 (« Pages », « Profils », « Contact ») : 8 H2 au lieu de 5 scènes, dont un second « Contact ». DESIGN 5.4 les décrit comme étiquettes mono. | Plan des titres (axe / DOM) | Étiquettes `<p class="meta">` avec des `nav aria-label` pour les listes, ou `h2` visuellement inchangés mais renommés sans doublon. | seo-strategist, frontend-developer | **Corrigé** : intitulés de colonnes du footer en `<p class="meta">` ; 5 H2 sur l'Accueil. |
| F10 | Mineur | Accueil, 390 px | Les libellés des schémas de flux (SVG mis à l'échelle) font **~8 px** de haut à 390 px (12 px à 768, 15 px à 1440) : illisibles sur mobile (l'`aria-label` couvre les lecteurs d'écran). | `carousel-390.png`, mesure `svg text` 8 px | Variante mobile du schéma (verticale, texte ≥ 11 px), ou texte HTML superposé. | design-director | Non traité (design-director). |
| F11 | Mineur | Accueil hero, ≥ 1024 px | L'étiquette « ÉTAPE 01 » chevauche la croix de repère en haut à gauche (croix à 95 px, texte à 103 px sur le même x). | `sweep-fr-1440-00-hero.png`, `sweep-fr-1920-00-hero.png` | Décaler l'étiquette ou la croix de 12 px. | design-director | **Corrigé** : étiquette « Étape 01 » décalée de 12 px (≥ 1024 px), plus de chevauchement avec la croix. |
| F12 | Mineur | `/admin` (≥ 1024 px), 404 d'article | L'onglet braise « Me contacter » est affiché sur l'Admin (DESIGN 2.2 : jamais de braise sur l'Admin) et sur la 404 par défaut. | `legacy-1440_admin.png`, `404-_blog_does_not_exist.png` | Ne pas monter `ContactTab` sur l'Admin (et sur les pages d'erreur). | frontend-developer | **Corrigé** : onglet masqué sur l'Admin et les pages 404 (`.admin-root ~ .contact-aside`, `.nf ~ .contact-aside`). |
| F13 | Mineur | Accueil, toutes tailles | JS initial ≈ 136 Ko compressés (budget 120 Ko hors animation) ; Lighthouse : 54 Ko de JS inutilisé, 13 Ko de polyfills anciens (`Array.prototype.at`, `flat`, `Object.hasOwn`…). | Lighthouse `unused-javascript`, `legacy-javascript-insight` | Cibler des navigateurs modernes (`browserslist`), vérifier ce qui charge le chunk de 70 Ko sur l'Accueil. | frontend-developer | Non traité (hors périmètre < 10 lignes). |
| F14 | Mineur (connu) | `/projects`, `/resume`, `/blog` en FR | Les pages portées affichent le texte anglais du template sur les routes FR (« THE SHOWCASE », « Curated deployments… », « CREDENTIALS & MASTERY », « DOWNLOAD DATA.PDF », « ENCRYPTED THOUGHTS »). Attendu avant leur refonte, mais visible dès la mise en prod. | `legacy-1440_projects.png`, `legacy-1440_resume.png`, `legacy-1440_blog.png` | À traiter à la refonte de chaque page ; à défaut, traduire les 5 à 6 titres en attendant. | content-writer | Non traité (content-writer). |
| F15 | Mineur | Accueil, 1440 | La navbar reste transparente jusqu'à 16 px de défilement, puis passe à 92 % + flou 14 px (écart DESIGN 5.1 déjà consigné dans MIGRATION) : conforme à l'intention de lisibilité, à entériner dans DESIGN.md. | MIGRATION.md 3e passage | Mettre DESIGN 5.1 à jour. | design-director | **Corrigé** : DESIGN 5.1 mis à jour. |
| S16 | Suggestion | Accueil, scène Stack | Les logos n'ont pas de nom visible (nom seulement dans le `<title>` SVG) : Express, Traefik, Supabase, API Gemini ne sont pas reconnaissables par un recruteur. | `sweep-fr-390-04-stack.png` | Légende mono sous chaque logo, ou infobulle au survol et au focus. | design-director | Non traité. |
| S17 | Suggestion | `/robots.txt` | Directive `Host:` non standard (ignorée par Google). | `curl /robots.txt` | La retirer. | seo-strategist | **Corrigé** : `host` retiré de `robots.ts`. |
| S18 | Suggestion | Accueil | URL racine écrite `https://jack0237.com` (canonical, hreflang) et `https://jack0237.com/` (sitemap, JSON-LD) : équivalentes, mais à harmoniser. | `curl /` et `/sitemap.xml` | Choisir une forme partout. | seo-strategist | Non traité (seo-strategist). |
| S19 | Suggestion | Dépôt | Fichiers non suivis : `public/images/portrait/portrait-desature-{480,1200}.*`, `-800.avif` et `public/images/hero/mist-poster-basse-*` (brume, plus utilisée). Le JSON-LD pointe vers `-800.webp`, qui est suivi : pas d'impact, mais à trancher (commit ou suppression). | `git status` | Supprimer les posters de brume inutilisés ; commiter ou supprimer les variantes de portrait. | frontend-developer | Non traité (décision de suppression laissée à l'orchestrateur). |

## Correctifs du 2026-09-26 (frontend-developer)

Build OK, `next start`, Playwright + Chrome (molette par pas de 60 px), Lighthouse 13 mobile. Captures avant / après : `docs/screenshots/qa/fixes/` (`before-*` = captures de l'audit, `after-*` = après correctifs). Balayage de contrôle 390, 768, 1024, 1280 (EN), 1440, 1440 réduit : aucun débordement horizontal, aucune erreur console, 27 `[data-reveal]` à opacité 1, 5 H2.

| Page | Performance | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` mobile (5 essais) | 92 à 93 (84) | 3,2 s (3,8) | 90 à 120 ms | 0 |
| `/en` mobile (5 essais) | 91 à 93 (82) | 3,2 à 3,3 s (3,8) | 90 à 130 ms | 0 |

LCP observé sans bridage : ~200 ms. L'écart avec la simulation vient du JS du framework (React / Next, ~120 Ko compressés) terminé avant le LCP en local, que Lantern compte dans le chemin critique. Essayé sans gain et retiré : `experimental.inlineCss`.

## Priorités proposées

1. F01 + F02 (fiche Relanceo) et F03 (onglet de contact) : ce sont les défauts visibles au premier parcours desktop d'un recruteur.
2. F04 (focus perdu dans le carrousel) : accessibilité clavier.
3. F05 (LCP mobile) et F06 (404 d'article).
4. Mineurs et suggestions au fil des passages suivants.

## Annexes

- Scripts d'audit (hors dépôt) : balayage responsive, trace de l'épinglage Relanceo, axe-core, contraste sur captures, trace clavier, carrousel, menu, mouvement réduit, 404, pages portées, Web Vitals.
- Captures de balayage : `sweep-fr-<largeur>-<nn>-<scène>.png` (FR, 6 largeurs), `sweep-en-{390,1024,1280}-00-hero.png`.
- Rapports Lighthouse JSON conservés hors dépôt (mobile et desktop, FR et EN) ; scores repris ci-dessus.
