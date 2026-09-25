# MIGRATION.md : CRA vers Next.js (branche `redesign/nextjs`)

Journal de travail de `frontend-developer`. Mis à jour au fil de l'eau pour pouvoir reprendre après une interruption.

## Checklist

> Reprise 2026-09-25 : premier passage interrompu (agent bloqué). État vérifié : deps installées (next 16, react 19, gsap, lenis), next.config.ts + redirections blog, firebase.js migré (auth navigateur seulement), polices dans `src/fonts/`, logos dans `src/site/stack-logos/`, images dans `public/images/` et `public/og/`, favicons dans `public/`, CV renommé `public/CV-Wilfried-NGUEGUIM.pdf`, fichiers CRA supprimés. **Pas encore de dossier `src/app/`**, `src/lib/firestore.ts` référencé mais absent.

- [x] Branche `redesign/nextjs` créée depuis `master` (2026-09-25)
- [x] package.json Next.js + dépendances, suppression CRA
- [x] Config Next (next.config.ts, tsconfig, redirections blog.*, vercel.json)
- [x] Firebase : REACT_APP_* vers NEXT_PUBLIC_*
- [x] Assets copiés depuis docs/assets-staging
- [x] Socle : tokens (`src/app/tokens.css`), polices next/font/local (`src/site/fonts.ts`), grille, navbar, footer + interrupteur « Réduire les animations », onglet contact (mailto), sélecteur FR/EN, motion (`src/site/motion/`) (2026-09-25, 2e passage)
  - Layouts racines `app/(fr)` (lang=fr, `/`) et `app/(en)` (lang=en, `/en`), textes dans `src/i18n/dictionaries.ts`
- [x] Accueil : 6 scènes FR + EN codées (`src/site/home/`), articles via `src/lib/firestore.ts` (API REST, ISR 300 s, liste vide si config absente)
- [x] SEO Accueil : metadata FR/EN, hreflang + x-default, JSON-LD Person/WebSite/ProfilePage, OG `public/og`, sitemap.ts, robots.ts, manifest.ts, global-not-found (noindex admin : avec le portage Admin)
- [x] Corrections Accueil après revue manuelle 1440 x 900 (2026-09-25, 3e passage)
  - Hero : titre et alias sortis de la rangée du mot géant (bloc `.hero__side`, colonne droite, au-dessus de « Wilfried »). Mesuré sans chevauchement à 1280 / 1440 / 1920, FR et EN.
  - **Portrait retiré du hero (décision utilisateur)**, desktop et mobile, avec son `fetchPriority`. Emplacement vide `src/site/home/HeroVisual.tsx` (rend `null`) pour le futur visuel (3D probable) conçu par l'équipe design. JSON-LD `image` et images OG inchangés.
  - Navbar : transparente seulement au repos en haut du hero, fond dès 16 px de défilement (écouteur scroll + rAF au lieu de l'IntersectionObserver « sortie du hero »). Fond `--color-bg` 92 % + flou 14 px + filet `--color-line` (fond plein sans backdrop-filter). **Écart DESIGN 5.1** (85 % sans flou) : les textes clairs des scènes restaient lisibles sous les liens.
  - Mobile : les `.sr-only` des cartes d'automatisations (position absolue) échappaient au défilement du carrousel et élargissaient la page à 672 px ; `.auto-card { position: relative }`.
- [x] Pages existantes portées (2026-09-25, 3e passage), visuel d'origine en attendant la refonte
  - Routes : `/projects`, `/en/projects`, `/resume`, `/en/resume` (CV + Certifications, ancre `#certifications`), `/blog`, `/en/blog`, `/blog/[id]` (URL unique, SEO 2.6), `/admin`. Redirection 308 `/certifications` et `/en/certifications` vers `/resume#certifications`.
  - Enveloppe `src/components/LegacyShell.tsx` : navbar + footer du nouveau socle, contenu hérité dans `main.legacy` ; variables et utilitaires de l'ancien thème limités à `.legacy` (`src/components/legacy.css`), polices Space Grotesk / Manrope / Material Symbols chargées sur ces pages seulement.
  - Projets, CV, Certifications : composants client (SDK Firebase via `utils/storage.js`, inchangé). Blog et article : composants serveur, lecture REST `src/lib/firestore.ts` (`getBlogPosts({ withContent })`, `getBlogPost(id)`), ISR 300 s ; fausse pagination et articles de démonstration retirés, état vide si aucun article.
  - Article : `notFound()` pour un identifiant inconnu ou invalide (erreur Firestore autre que 404 = 500, pas de fausse 404), `generateMetadata` (title, description tirée du contenu, canonical, OG `article`), JSON-LD `BlogPosting` (`datePublished` depuis l'identifiant `Date.now()`), `lang` de l'article sur `<article>`.
  - Admin : `noindex, nofollow`, rendu client seul (`next/dynamic` ssr:false), Bootstrap CSS chargé uniquement ici, garde si Firebase non configuré. Schéma Firestore et règles inchangés.
  - Sitemap : pages FR / EN avec alternates + articles Firestore (`revalidate` 300 s), `/admin` exclu.
  - `bootstrap`, `react-bootstrap` (Admin) et `react-icons` (CV, Certifications) encore utilisés : conservés.
- [x] Build OK (`npm run build`, Next 16.3.6 Turbopack, TypeScript OK) + vérification `next start` : `/` et `/en` 200, URL inconnue 404, robots/sitemap/hreflang/OG vérifiés au curl, aucun avertissement console en palier riche (2026-09-25)
- [x] Build + `next start` (2026-09-25, 3e passage) : `/`, `/en`, `/projects`, `/en/projects`, `/resume`, `/en/resume`, `/blog`, `/en/blog`, `/admin` en 200 ; `/blog/does-not-exist` et URL inconnue en 404 ; `/certifications` en 308 ; `/admin` porte `noindex, nofollow`.
- [x] Captures Accueil avec vrai défilement molette (Playwright, Chrome) dans `docs/screenshots/` : `home-desktop-*` (1440 x 900), `home-mobile-*` (390 x 844), `home-en-desktop-01-hero`. QA complète encore à faire par `ux-qa-auditor`.
- [x] DESIGN.md suivi mis à jour (section 13)
- [x] Fluidité des animations (2026-09-25, 4e passage), règles de timing en DESIGN 6.5
  - Titres de scène : 0,4 s vers 0,9 s, `expo.out`, décalage 0,08 vers 0,1, déclenchement `top 85%` vers `top 80%`.
  - Relanceo épinglé : `end +=60%` vers `+=120%`, `scrub: true` vers `scrub: 1`, blocs en `power2.out` (au lieu de `none`), décalage par bloc conservé. Repli non épinglé (mobile, standard) : 0,4 s vers 0,7 s, y 24 vers 40, `power3.out`, décalage 0,1.
  - Carrousel des automatisations : `scrub: 1`. L'index (compteur, points, boutons) suit maintenant la progression de l'animation lissée et n'émet qu'au changement ; `goTo` passe par `lenis.scrollTo` quand Lenis est actif. Vérifié : suivant / suivant / précédent donnent 02 / 03 / 02.
  - Dissolution du mot géant et fil cyan : `scrub: 0.8`. Bandes : 0,7 s vers 0,9 s. Entrée du hero inchangée.
  - Révélation partagée `[data-reveal]` (hors Relanceo, qui a la sienne) via `ScrollTrigger.batch` : opacité 0 vers 1, y 30 vers 0, 0,8 s, `power3.out`, décalage 0,1, `once`, `clamp(top 85%)`, `onLeave` aussi (arrivée directe sous un bloc), `clearProps` en fin. Posée sur : phrases d'accroche des scènes, cartes de services, groupes de la stack, entrées du journal (ou état vide), liens de fin de scène, titre des automatisations, contenu de la scène finale (voix, actions, pied). État caché posé par le moteur uniquement : visible sans JS et en palier réduit.
  - Tokens : `--dur-instant` 120 vers 150 ms, `--dur-base` 400 vers 300 ms, `--dur-slow` 700 vers 900 ms, nouveaux `--dur-reveal` (800 ms) et `--ease-ui` (cubic out) ; les transitions d'interface passent de `linear` à `--ease-ui`.
  - Dissolution du mot géant (masque piloté par `--dissolve`, repeinture à chaque image) mesurée par trace Chrome (Playwright) : 1440 x 900, 0 image au-delà de 20 ms, p95 16,9 ms, peinture environ 0,1 ms par image (x8 en nombre de peintures par rapport à sans masque). Mobile 390 px avec CPU ralenti x4 : peinture environ doublée, p95 33 ms avec ou sans masque (bruit du ralentissement). Pas de saccade attribuable : approche conservée ; `will-change: transform` testé sans gain, non retenu.
  - Correctif au passage : un `onUpdate` qui lisait la constante du tween avant sa création faisait échouer silencieusement tout le reste du moteur (carrousel, révélations, arrivée). Le script de vérification contrôle maintenant que le moteur a bien démarré (éléments cachés au départ, API du carrousel présente).
  - Vérifié : build OK ; `next start` + Playwright (Chrome), défilement molette par pas de 60 px, FR / EN, 1440 x 900 (riche) et 390 x 844 (standard) : aucune erreur console, 27 `[data-reveal]` tous à opacité 1 en fin de parcours, aucun débordement horizontal ; palier réduit : rien de caché ; interrupteur « Réduire les animations » : voir ci-dessous.

## Notes du 2e passage (2026-09-25)

- Architecture : deux layouts racines par groupe de routes, `app/(fr)/` (`/`) et `app/(en)/en/` (`/en`) ; `global-not-found.tsx` (flag `experimental.globalNotFound`). Les futures pages suivent le même schéma (`(fr)/projects`, `(en)/en/projects`). Changer de langue recharge la page (changement de layout racine), c'est voulu.
- Code du nouveau site : `src/site/` (composants, scènes, motion), `src/i18n/dictionaries.ts` (textes FR/EN de CONTENT.md), `src/lib/` (constantes, Firestore). Les pages héritées de `src/components/` (.js) ne sont ni importées ni incluses dans le TS (include = .ts/.tsx) : intactes, non compilées.
- Firestore : lecture REST publique côté serveur (`NEXT_PUBLIC_FIREBASE_PROJECT_ID` requis, clé API optionnelle), tri sur l'identifiant `Date.now()`, ISR 300 s. Sans variable : état vide de la scène Blog, build OK. **À renseigner dans Vercel** avant mise en ligne.
- Motion : `html[data-motion]` = reduced / standard / rich (DESIGN 10.4), posé par un script inline avant rendu ; GSAP (ScrollTrigger, SplitText, DrawSVG) et Lenis chargés par `import()` seulement hors mode réduit. Riche : Lenis, bandes, épinglage Relanceo, carrousel horizontal épinglé. Standard : révélations, fil, scroll natif. DrawSVG sert aux schémas de flux ; les lignes à trait non proportionnel (fil du hero, branches, arrivée) passent par scaleX / clip-path.
- Données build : `NEXT_PUBLIC_BUILD_DATE` et `NEXT_PUBLIC_CV_SIZE` injectées par `next.config.ts` (footer, JSON-LD, poids du CV).
- Stack de la scène 04 : logos candidats de DESIGN 7.8 (liste encore à valider), tracés dans `src/site/stack-logos/paths.ts` (généré depuis les SVG).

### Omis volontairement (inconnu ou non fourni)
- Capture Relanceo (ASSETS 5) : la partie A affiche un cadre avec la citation, sans image.
- Ville, heure locale et statut de disponibilité du hero ; lien « Étude de cas ».
- Brume WebGL (poster AVIF seul) ; mémorisation du choix de langue ; `knowsAbout` du JSON-LD.

### Liens temporairement en 404
Plus aucun depuis le 3e passage. « Contact » mène à `#contact` ; les CTA de contact ouvrent `mailto:`.

### Points ouverts après le 3e passage
- Sans variables `NEXT_PUBLIC_FIREBASE_*` (build local), Projets / CV / Certifications restent vides (requête Firestore client sans réponse) et Blog affiche son état vide ; `/blog/[id]` n'a pas pu être testé avec un vrai article. À vérifier en préproduction Vercel.
- Données de repli de `utils/storage.js` et `Projects.js` : projets et expériences du template d'origine (soumya-jit.tech, « Vercel Inc. »…), affichés si les collections Firestore sont vides (SEO P0-1). À purger lors de la refonte.
- Relanceo (palier riche) : épinglé avec `top` à 29 px, le haut du titre passe sous la navbar pendant l'épinglage ; blocs révélés au scrub, la scène paraît vide au tout début. À arbitrer en QA.
- Admin : Bootstrap souligne l'onglet « Me contacter ». Sans incidence publique (page noindex).

### Prochain passage
1. Validation utilisateur de l'Accueil sur les captures, puis QA `ux-qa-auditor`.
2. ~~Visuel de remplacement du hero~~ : fait (relief topographique, voir ci-dessous).
3. Refonte des pages héritées (Projets, CV, Blog, Article, Admin a minima) ; retrait de Bootstrap / react-icons à ce moment.

## Hero : relief topographique (candidat A), 4e passage (2026-09-25)

- [x] `src/site/home/HeroVisual.tsx` (client) : poster rendu côté serveur, scène WebGL importée dynamiquement (`import("./hero-relief/scene")`) seulement si `computeTier() === "rich"`, après `requestIdleCallback`. Réagit en direct à `prefers-reduced-motion`, à la largeur, au pointeur et à l'interrupteur du footer (événement `jack0237:motion`) : la scène est détruite et le poster reste.
- [x] `src/site/home/hero-relief/scene.ts` + `shaders.ts` : **WebGL2 brut, aucune dépendance** (Three.js écarté, DESIGN 10.1). Le raymarching du prototype est remplacé par 3 grilles emboîtées ancrées au monde (160², 128², 96² sommets ; 14, 44 et 150 unités), hauteur calculée dans le vertex shader, zone recouverte par le niveau plus fin enfoncée sous le relief (pas de `discard`, early-z conservé). Normales et altitude par pixel en dérivées analytiques (un seul passage de bruit). Ciel dessiné en dernier (seulement là où il n'y a pas de relief), halo de l'impulsion en panneau additif. Résolution interne 60 % des px CSS (max 1600 px de large).
- [x] Poster : `public/images/hero/relief-poster-{desktop,mobile}.{avif,webp}` (copiés du staging), `image-set` AVIF/WebP, desktop si ratio ≥ 1:1. Sous 1024 px le contenu du hero est aligné en haut : le poster est descendu à 34 % de la hauteur avec un fondu, la vallée passe sous les CTA et jamais derrière le texte (écart assumé avec la maquette mobile du staging, où le texte était en bas).
- [x] Voile de lisibilité en `::after` (dégradés de la maquette sur desktop, dégradé haut vers bas sur mobile). Canvas `aria-hidden`, fondu d'entrée 1,2 s une fois la première image dessinée.
- [x] Garde-fous : pause hors écran (IntersectionObserver) et onglet masqué ; moins de 45 i/s sur 2 s (après 1,2 s de chauffe) = destruction, retour au poster et `sessionStorage["jack0237-relief-off"]` pour la visite ; rendu logiciel (SwiftShader…) ou `failIfMajorPerformanceCaveat` = poster ; perte de contexte : rendu arrêté, canvas masqué, reprise après `webglcontextrestored` ; redimensionnement par ResizeObserver ; nettoyage complet au démontage (`WEBGL_lose_context`). Retour doux au point de départ après 15 min continues (précision du bruit).
- [x] `HeroScene.tsx` : `<HeroVisual />` remplace le `div.hero__mist` (enfant direct de la section). `home.css` : règles `.hero__mist` retirées (le poster de brume n'est plus téléchargé). Fichiers `public/images/hero/mist-poster-basse-*` désormais inutilisés, laissés en place (à supprimer si le choix est confirmé).
- Mesures (Playwright, Chrome, headless avec GPU, **Intel Iris Xe** ANGLE D3D11, 1440 x 900, tampon 864 x 540) :
  - Temps GPU par image (`EXT_disjoint_timer_query_webgl2`) : **2,14 ms médiane, 2,4 à 2,6 ms p95** ; 60 i/s stables ; JS par image ~0,2 ms. (Prototype : 52 ms.) Essais : maillage 256² x 3 à 75 % = 4,7 ms, 60 % = 2,3 ms.
  - Sortie du hero à la molette (dissolution du mot géant) avec la scène active : intervalles rAF p50 16,7 ms, p95 16,8 ms, 1 image > 20 ms sur 495 (33 ms) ; GPU 3,6 ms p50 / 4,4 ms p95 pendant le défilement. Référence sans scène : p50 16,7, p95 16,9, 0 image > 20 ms.
  - Code 3D : chunk séparé **14,9 Ko, 6,3 Ko gzip** (5,8 Ko brotli), absent du HTML initial.
  - Vérifié : mobile 390 x 844 (palier standard), `prefers-reduced-motion`, interrupteur du footer mémorisé : **chunk 3D jamais téléchargé**, aucun canvas. Interrupteur actionné en direct : canvas retiré. Hors écran : rendu en pause, reprise au retour. Perte / restauration de contexte : OK. Garde-fou (28 ms de fil principal forcés par image) : scène démarrée puis retirée, poster, drapeau de session posé.
  - Contraste (fond seul, 98e centile de luminance par zone) desktop / mobile : NGUEGUIM 14,0 / 18,2 ; Wilfried 12,2 / 18,2 ; titre 13,7 / 18,3 ; alias 7,2 / 9,0 ; phrase de valeur 7,2 / 8,1 ; « Étape 01 » 5,4 / 5,6. Tout passe AA (avant le déplacement du poster mobile, l'alias tombait à 2,6).
  - Captures : `docs/screenshots/home-desktop-01-hero-relief.png`, `home-mobile-01-hero-relief.png`.
- Mesure en local : `?relief-stats` expose `window.__reliefStats` (temps GPU, fps) ; `&relief-scale=` et `&relief-grid=a,b,c` servent aux essais (actifs seulement avec `relief-stats`).
- Build OK (`npm run build`), vérifié sur `next start -p 3217` (arrêté ensuite).

### À intégrer après le passage timing
Rien en attente : le passage timing étant terminé, les retouches de `home.css` (retrait de `.hero__mist`) ont été faites directement. `engine.ts`, `tokens.css`, `globals.css` non modifiés.
