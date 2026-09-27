# DESIGN.md : direction artistique et socle du portfolio

Source de vérité visuelle de l'équipe. Rédigé par `design-director` le 2026-09-25, à partir de `docs/BRIEF.md` (décisions du 2026-09-25) et `docs/MOODBOARD.md`.

Périmètre de cette version : **socle global** (tokens, typographie, grille, navbar, footer, motion, performance) et **page d'Accueil**. Les autres pages réutiliseront ce socle sans le redéfinir.

Statut : **proposition, en attente de validation utilisateur**. Aucun développement avant validation (règle `portfolio-team`).

Conventions de ce document :
- Les textes entre crochets `[...]` sont des emplacements que `content-writer` rédige dans `docs/CONTENT.md`. Les quelques libellés écrits ici (CTA, titres de scènes) sont des propositions, sans tiret cadratin, à valider.
- Aucun chiffre, client ou témoignage n'est inventé. Là où une donnée réelle manque, c'est une question ouverte (section 14).

---

## 1. Direction retenue

**Ambiance C « Expédition cinématique »**, avec deux emprunts à B « Grand titre éditorial » : un mot géant dans le hero, et une serif italique pour la voix personnelle.

Idée directrice : **la page d'accueil est une expédition en six étapes**, du point de départ (qui je suis) à l'arrivée (on travaille ensemble). Un **fil cyan unique**, comme la trajectoire de vol de la carte de White Desert, traverse toute la page de scène en scène et relie les étapes. Ce fil n'est pas un décor : il matérialise ce que fait Jack0237 au quotidien, relier des systèmes (un déclencheur, des étapes, une sortie), c'est-à-dire l'automatisation.

### 1.1 Personnalité visuelle

| Adjectifs (ce qu'on vise) | Anti-adjectifs (ce qu'on refuse) |
|---|---|
| immersif | gadget |
| précis | flou, approximatif |
| narratif | décoratif sans raison |
| affirmé | tape-à-l'oeil, néon partout |
| humain | froid, impersonnel |

### 1.2 Références retenues et ce qu'on en tire

| Référence | Ce qu'on prend précisément |
|---|---|
| [white-desert.com](https://white-desert.com/) (site aimé) | Mot géant posé en bas du hero, contraste très grand / très petit ; accroche en italique serif ; trajectoire cyan sur carte sombre ; transitions en bandes verticales ; un seul accent chaud fonctionnel (onglet vertical collé au bord droit) ; coordonnées en microtypo. |
| [moneyincheck.org](https://moneyincheck.org/) (site aimé) | Grille fine apparente ; accent rare réservé à l'action ; sélecteur de langue en pastille ; barre de métadonnées datée ; une idée par écran. |
| [dennissnellenberg.com](https://dennissnellenberg.com/) | Le nom de famille comme mot géant d'un portfolio de développeur, avec le portrait qui chevauche les lettres. |
| [lusion.co](https://lusion.co/) | Croix de repère aux angles des scènes, rythme de narration au scroll, indicateur d'étape. |
| [igloo.inc](https://www.igloo.inc/) | Petites étiquettes numériques en monospace posées sur une scène immersive : le pont entre l'imaginaire « expédition » et le langage tech. |

### 1.3 Changements majeurs par rapport à l'existant

| Existant | Nouveau |
|---|---|
| Préchargeur `Pre.js` (1,2 s imposé) | Supprimé. Le contenu s'affiche immédiatement, le hero est le premier écran. |
| Particules `react-tsparticles` | Supprimées. Remplacées par la grille fine et le fil cyan, qui ont une raison d'être. |
| Effet machine à écrire `typewriter-effect` | Supprimé (demandé par le brief). |
| Tilt `react-parallax-tilt`, glassmorphism, halo violet `#571bc1`, rose `#ff2d9b` | Supprimés. Plus de violet ni de rose. |
| Space Grotesk + Manrope + Material Symbols | Mona Sans + Newsreader Italic + JetBrains Mono ; icônes SVG Lucide (section 3). |
| Fond `#131313` gris neutre | Noir profond légèrement bleuté `#07090B` (ambiance glacier nocturne). |
| Cyan utilisé en aplats, halos et bordures lumineuses | Cyan réservé aux trajectoires, liens, focus et à l'action principale. Jamais en halo. |
| Bio longue et calendrier GitHub sur l'accueil | Déplacés vers la page CV (brief). |
| PDF `Soumyajit_Behera-BIT_MESRA.pdf` dans `src/Assets` | Résidu du template d'origine : à retirer lors de l'implémentation. |

---

## 2. Design tokens

Nommage à trois niveaux : primitives (valeurs brutes) puis sémantiques (rôle). Les composants n'utilisent **que** les tokens sémantiques.

### 2.1 Couleurs

| Token sémantique | Valeur | Rôle |
|---|---|---|
| `--color-bg` | `#07090B` | Fond de page, noir profond bleuté |
| `--color-panel` | `#0F1720` | Panneaux, cartes, scènes alternées (bleu nuit) |
| `--color-raised` | `#16202A` | Survol de panneau, surfaces surélevées, champs de formulaire |
| `--color-line` | `#1E2A35` | Lignes de grille, séparateurs (décoratif) |
| `--color-line-strong` | `#2C3A47` | Bordures de cartes (décoratif) |
| `--color-text` | `#F2F6F8` | Texte principal, mot géant (blanc glacier) |
| `--color-text-2` | `#A3B1BA` | Texte secondaire, paragraphes longs |
| `--color-text-3` | `#7A8A95` | Métadonnées, légendes, placeholders, bordures de champs interactifs |
| `--color-cyan` | `#00F0FF` | **Accent principal** : fil de trajectoire, liens, focus, CTA principal, points actifs |
| `--color-cyan-dim` | `#00B8C4` | Cyan au repos pour les tracés secondaires (branches du fil, schémas n8n non actifs) |
| `--color-ember` | `#FF7A3D` | **Second accent** « braise » : contact uniquement (voir 2.2) |
| `--color-on-accent` | `#07090B` | Texte posé sur un aplat cyan ou braise |

#### Contrastes WCAG vérifiés (calcul de luminance relative WCAG 2.x, 2026-09-25)

| Premier plan | sur `bg` #07090B | sur `panel` #0F1720 | sur `raised` #16202A | Usage autorisé |
|---|---|---|---|---|
| `text` #F2F6F8 | 18,34 | 16,60 | 15,16 | Tout texte (AAA) |
| `text-2` #A3B1BA | 9,07 | 8,21 | 7,50 | Tout texte (AAA) |
| `text-3` #7A8A95 | 5,60 | 5,07 | 4,63 | Tout texte (AA), y compris petit corps |
| `cyan` #00F0FF | 14,16 | 12,81 | 11,70 | Texte, liens, focus (AAA) |
| `cyan-dim` #00B8C4 | 8,22 | 7,44 | 6,79 | Texte et tracés (AAA) |
| `ember` #FF7A3D | 7,70 | 6,96 | 6,36 | Texte et aplats (AAA) |
| `on-accent` #07090B sur `cyan` | 14,16 | | | Libellé de bouton cyan (AAA) |
| `on-accent` #07090B sur `ember` | 7,70 | | | Libellé de bouton braise (AAA) |
| `line` #1E2A35 | 1,37 | 1,24 | | **Décoratif uniquement**, jamais seul porteur d'information |
| `line-strong` #2C3A47 | 1,71 | 1,55 | | **Décoratif uniquement** |

Règles :
- Texte blanc sur braise : **interdit** (2,38:1). Toujours `on-accent` sombre sur un aplat braise ou cyan.
- Les bordures de composants interactifs (champs, boutons secondaires) utilisent `text-3` ou plus clair (au moins 3:1 exigé par WCAG 1.4.11).
- Cyan et braise ne se distinguent pas assez entre eux (1,84:1) pour porter une information par la seule couleur : chaque état a aussi une forme ou un libellé.

### 2.2 Second accent : « braise » `#FF7A3D`

Retenu, avec un rôle unique et un usage verrouillé, sur le modèle de l'onglet orange de White Desert.

- **Rôle** : la **prise de contact humaine**. Le cyan dit « explorer le travail », la braise dit « parler à Wilfried ». C'est aussi la seule couleur chaude du site, ce qui lui donne la valeur d'un feu de camp dans un paysage glacé (cohérent avec la métaphore de l'expédition).
- **Où** : l'onglet de contact fixe (bord droit, desktop), le bouton « Me contacter » de la scène finale, la pastille du lien Contact dans le menu mobile, et le point de statut « disponible » si l'utilisateur le valide (question ouverte).
- **Règle de rareté** : **un seul élément braise visible à l'écran à la fois**. L'onglet fixe se masque quand la scène finale (qui a son propre bouton braise) entre dans l'écran.
- **Interdits** : jamais en texte courant, jamais en dégradé, jamais en halo ou ombre, jamais dans les schémas ni sur le fil de trajectoire, jamais sur la page Admin.
- Si l'utilisateur préfère le cyan seul, retirer le token suffit : tous les emplacements braise basculent en bouton contour `text` sans autre changement de mise en page.

### 2.3 Espacements (base 4 px)

`--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32 · `--space-7` 48 · `--space-8` 64 · `--space-9` 96 · `--space-10` 128 · `--space-11` 192

- Marge interne de scène : `--space-9` en haut et en bas (desktop), `--space-8` (mobile).
- Gouttière de grille : 24 px (desktop), 16 px (mobile).

### 2.4 Rayons, bordures, ombres

- Rayons : `--radius-0` 0 (défaut : scènes, captures, panneaux) · `--radius-1` 2 px (champs, étiquettes) · `--radius-pill` 999 px (sélecteur de langue, onglet de contact, badges de stack). **Pas de cartes arrondies à 16 px** : c'est le premier signe du rendu template.
- Bordures : 1 px `line-strong` pour les cadres, 1 px `line` pour la grille.
- Ombres : **aucune ombre portée décorative**. Seule ombre autorisée : `--shadow-capture: 0 40px 80px -40px rgba(0,0,0,.8)` sous les captures d'interface pour les détacher du fond.
- Croix de repère : petites croix 9 x 9 px en `text-3` aux quatre angles d'une scène ou d'une capture (référence Lusion), signature graphique du site.

### 2.5 Mouvement (tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--dur-instant` | 150 ms | Survol, focus, changement de couleur |
| `--dur-fast` | 200 ms | Ouverture de menu, sélecteur de langue, interrupteur |
| `--dur-base` | 300 ms | Retour d'interface le plus long (survol d'image) |
| `--dur-reveal` | 800 ms | Révélation des blocs de contenu (moteur GSAP) |
| `--dur-slow` | 900 ms | Bandes de transition entre scènes |
| `--dur-epic` | 1200 ms | Entrée du hero (une seule fois par visite) |
| `--ease-ui` | `cubic-bezier(0.33, 1, 0.68, 1)` | Retours d'interface (cubic out) |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrées (expo out) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Bandes, pinning, transitions de scène |
| `--ease-linear` | `linear` | Réservé à ce qui est piloté par le scroll (scrub), jamais aux tweens temporels |

Règles complètes de motion : section 6.

---

## 3. Typographie

### 3.1 Le trio retenu

| Rôle | Police | Réglages utilisés | Licence | Source |
|---|---|---|---|---|
| **Information** (titres, texte, mot géant, UI) | **Mona Sans** (GitHub) | Variable : graisse 200 à 900, **largeur 75 % à 125 %** | SIL Open Font License 1.1 (usage web et commercial libre) | [Google Fonts](https://fonts.google.com/specimen/Mona+Sans) · [github.com/github/mona-sans](https://github.com/github/mona-sans) |
| **Voix personnelle** (accroches, signature, citations, légendes humaines) | **Newsreader Italic** (Production Type) | Variable : graisse 200 à 800, taille optique 6 à 72 | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Newsreader) · [github.com/productiontype/Newsreader](https://github.com/productiontype/Newsreader) |
| **Données** (métadonnées, dates, étiquettes, stack, numéros d'étape) | **JetBrains Mono** | Statique 400 uniquement | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) · [github.com/JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono) |

Disponibilité des axes vérifiée le 2026-09-25 via l'API Google Fonts (`Mona Sans` : `font-stretch 75% 125%`, `font-weight 200 900`, romain et italique ; `Newsreader` italique : `font-weight 200 800`, axe `opsz`). Licence Mona Sans vérifiée dans le dépôt GitHub officiel.

Hébergement : **auto-hébergé** (fichiers woff2 servis par le site, via `next/font` ou `@fontsource`), pas d'appel à `fonts.googleapis.com` à l'exécution : meilleur LCP et pas de transfert d'IP vers Google (RGPD). Sous-ensembles : latin + latin-ext (accents français).

### 3.2 Pourquoi ce trio

- **Mona Sans remplace Space Grotesk** pour trois raisons :
  1. **Une seule famille couvre le mot géant et le texte.** Son axe de largeur permet d'utiliser la version condensée très grasse (largeur 75, graisse 850 à 900) pour « NGUEGUIM » et les titres de scène, comme la grotesque condensée d'« ANTARCTICA », puis la largeur normale pour le texte courant. L'ambiance C réclamait une condensée (Oswald, Bebas) en plus d'une grotesque de texte : ici on économise une famille entière et on garde une cohérence parfaite de dessin.
  2. **Qualité de dessin** : grotesque soignée, chiffres tabulaires, bon rendu sur fond sombre en petit corps. Space Grotesk, dérivée d'une mono, a des formes excentriques qui fatiguent en texte long et datent le site.
  3. **Un sens pour un développeur** : c'est la police de GitHub, dessinée pour du contenu technique. Un clin d'oeil discret, pas un logo.
- **Newsreader Italic pour la voix** : une italique serif de lecture, avec un axe de taille optique qui la rend fine et élégante en grand (accroche du hero, invitation finale) et robuste en petit (légendes). Écartée : **Instrument Serif**, devenue la serif par défaut des landings générées en 2025 et 2026 (effet « déjà vu » que le brief veut éviter), disponible en une seule graisse et fragile sous 20 px. Écartée : **Fraunces**, trop fantaisiste pour un profil qui doit rassurer des recruteurs.
- **JetBrains Mono pour les données** : lisible à 12 px, zéro barré qui évite l'ambiguïté 0/O (utile pour « Jack0237 »), familière aux développeurs. Une seule graisse chargée.
- Écartées pour l'information : **Geist** et **Inter / Inter Tight** (très répandues chez les portfolios dev, sans axe de largeur), **Satoshi / General Sans** de Fontshare (licence ITF Free Font License, libre, mais omniprésentes sur les landings générées et sans axe de largeur).

### 3.3 Échelle typographique (fluide, 390 px à 1440 px)

| Token | Police et réglages | Taille | Interligne | Approche | Usage |
|---|---|---|---|---|---|
| `--type-giant` | Mona Sans, largeur 75, graisse 900, capitales | ajustée à la largeur de la grille (voir 3.4), environ `clamp(84px, 21vw, 340px)` | 0,8 | -0,02em | Mot géant du hero uniquement |
| `--type-display` | Mona Sans, largeur 75, graisse 800, capitales | `clamp(44px, 7vw, 112px)` | 0,9 | -0,01em | Titres de scène (un par scène) |
| `--type-h2` | Mona Sans, largeur 100, graisse 600 | `clamp(30px, 3.6vw, 52px)` | 1,05 | -0,015em | Nom de projet, sous-titres |
| `--type-h3` | Mona Sans, largeur 100, graisse 600 | `clamp(20px, 1.8vw, 26px)` | 1,2 | 0 | Titres de carte, d'article |
| `--type-voice` | Newsreader Italic, graisse 350, opsz auto | `clamp(22px, 2.4vw, 36px)` | 1,25 | 0 | Accroche, invitation, prénom du hero |
| `--type-voice-sm` | Newsreader Italic, graisse 400 | 17 px | 1,4 | 0 | Citations et légendes humaines, signature |
| `--type-body` | Mona Sans, largeur 100, graisse 400 | 17 px (16 px mobile) | 1,6 | 0 | Texte courant, 65 caractères max par ligne |
| `--type-small` | Mona Sans, largeur 100, graisse 450 | 14 px | 1,5 | 0,005em | Descriptions courtes, footer |
| `--type-meta` | JetBrains Mono 400, capitales | 12 px | 1,4 | 0,08em | Métadonnées, numéros d'étape, étiquettes |
| `--type-button` | Mona Sans, largeur 100, graisse 600 | 15 px | 1 | 0,01em | Boutons et liens d'action |

Règles :
- **Une seule occurrence de `--type-giant` sur tout le site** : le mot du hero.
- La serif italique ne sert **jamais** à de l'information (titres de section, boutons, navigation). Elle est la voix de Wilfried, et seulement elle.
- Pas de texte courant en capitales, pas de texte courant en mono.

### 3.4 Le mot géant du hero : « NGUEGUIM »

**Choix : le nom de famille, « NGUEGUIM ».**

1. **Le recruteur doit retenir et savoir écrire ce nom.** C'est lui qu'il tapera dans LinkedIn, Google ou un ATS. Un nom peu courant affiché en très grand se mémorise lettre par lettre ; en petit, il se lit mal et s'oublie. Le mot géant sert directement l'objectif « trouver un emploi ».
2. **SEO et accessibilité sans compromis** : le mot géant fait partie du vrai H1, en texte réel (ni image, ni SVG) : `<h1><span>Wilfried</span> <span>NGUEGUIM</span></h1>`, suivi immédiatement du titre « Dev full-stack & automatisation IA » (dans le H1 ou dans un paragraphe adjacent, selon `seo-strategist`). Robots et lecteurs d'écran lisent « Wilfried NGUEGUIM ». Visuellement, le prénom s'affiche au-dessus du mot géant en `--type-voice` italique, comme l'accroche italique de White Desert.
3. **Aucune traduction nécessaire** : un nom propre fonctionne à l'identique en FR et en EN, ce qui supprime le double travail d'animation signalé comme risque de l'ambiance C.
4. **La forme graphique** : 8 lettres capitales, rondes (G, U) équilibrées par des verticales (N, E, I, M). En condensée très grasse, le mot remplit la largeur d'un écran sur une seule ligne, comme « ANTARCTICA ».
5. **Jack0237 n'est pas sacrifié** : c'est déjà le domaine (`jack0237.com`) ; il devient la **marque et la signature** (logo de navbar en mono, signature en italique serif dans le hero et la scène finale). Le nom civil pour la confiance, le pseudo pour la marque.

Écartés : « JACK0237 » (fort en marque, mais un recruteur cherchera « Wilfried NGUEGUIM », et des chiffres géants font plus « gamer » que « pro ») ; « WILFRIED NGUEGUIM » (deux lignes, perd sa force d'objet, ne tient pas sur mobile) ; un mot-concept comme « AUTOMATISER » (à traduire, et ne dit pas qui on embauche).

Mise en forme : ajusté bord à bord de la grille, calculé une fois sur la police chargée ; hauteur réservée à l'avance pour éviter tout décalage (section 10). Sur mobile (390 px), il tient sur une ligne à environ 84 px de corps.

---

## 4. Grille et breakpoints

### 4.1 Breakpoints (mobile first)

| Nom | Min | Colonnes | Gouttière | Marge latérale | Notes |
|---|---|---|---|---|---|
| `xs` | 0 | 4 | 16 px | 20 px | Référence de test : 390 px |
| `sm` | 640 px | 6 | 16 px | 24 px | Grands téléphones, petites tablettes |
| `md` | 768 px | 8 | 20 px | 32 px | Tablette portrait |
| `lg` | 1024 px | 12 | 24 px | 40 px | Tablette paysage, petits portables. **Seuil des effets riches** (pinning, carrousel piloté par le scroll) |
| `xl` | 1280 px | 12 | 24 px | 48 px | Portables |
| `2xl` | 1440 px | 12 | 24 px | 64 px | Référence de test desktop |
| `3xl` | 1920 px | 12 | 24 px | auto | Contenu plafonné à 1600 px ; seul le mot géant et les fonds de scène restent bord à bord |

### 4.2 Grille apparente

- Les lignes verticales des colonnes (desktop : 12 colonnes regroupées visuellement en **4 bandes de 3 colonnes**, soit 5 lignes) sont dessinées en `--color-line`, 1 px, sur toute la hauteur de la page. Mobile : 2 bandes, 3 lignes.
- Elles servent de rail : les éléments s'alignent dessus, le fil cyan les croise, les bandes de transition (section 7) suivent exactement ces 4 bandes. La grille a donc une fonction, elle n'est pas un motif de fond.
- Croix de repère `--color-text-3` aux angles de chaque scène.
- Opacité réduite à 50 % derrière les blocs de texte long pour ne pas gêner la lecture.

### 4.3 Hauteur des scènes

- Hero : `min-height: 100svh` (unité qui tient compte des barres du navigateur mobile, pas de saut).
- Autres scènes : hauteur du contenu, avec `--space-9` en haut et en bas ; sur desktop, `min-height: 100svh` pour les scènes épinglées (Projets phares).
- On n'impose jamais un défilement « scène par scène » (scroll snapping forcé) : l'utilisateur garde le contrôle de son défilement.

---

## 5. Composants globaux

### 5.1 Navbar

Fine, presque invisible, pour laisser la scène respirer (comme White Desert). Transparente au repos en haut du hero ; dès 16 px de défilement, fond `--color-bg` à 92 % + flou 14 px + filet `--color-line` (fond plein sans `backdrop-filter`). Entériné le 2026-09-26 (QA F15) : les 85 % sans flou prévus au départ laissaient transparaître les textes clairs des scènes sous les liens.

Desktop (1440 px) :
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ JACK0237            Projets   CV   Blog   Contact        01 / 06    ( FR | EN )│
└──────────────────────────────────────────────────────────────────────────────┘
  mono 13px            Mona Sans 15px, text-2                meta mono   pastille
```
Mobile (390 px) :
```
┌──────────────────────────────────┐
│ JACK0237          ( FR|EN )  ☰   │
└──────────────────────────────────┘
Menu ouvert (plein écran, fond bg) :
┌──────────────────────────────────┐
│ JACK0237                      ✕  │
│                                  │
│ PROJETS                          │  <- display condensé 44px
│ CV                               │
│ BLOG                             │
│ CONTACT ●                        │  <- point braise
│                                  │
│ GitHub   LinkedIn   X            │
│ ( FR | EN )                      │
└──────────────────────────────────┘
```
- Logo : « JACK0237 » en JetBrains Mono, lien vers l'accueil. (Monogramme éventuel : question ouverte.)
- Liens : `text-2` au repos, `text` au survol avec un trait cyan de 1 px qui se dessine de gauche à droite (`--dur-fast`). Page courante : trait cyan fixe + `aria-current="page"`.
- **Indicateur d'étape** « 01 / 06 » (accueil uniquement, desktop) : numéro de la scène visible, en mono `text-3`, le chiffre courant en cyan. C'est un repère de lecture, pas un lien. `aria-hidden="true"` (les scènes ont déjà des titres).
- **Sélecteur de langue** : pastille à deux segments « FR | EN », segment actif fond `--color-text` et texte `--color-on-accent`. Lien réel vers la version traduite de la page (pas un simple état JS), avec `hreflang` et `lang` correct. Pas de drapeaux.
- Menu mobile : `dialog` accessible (focus piégé, `Échap` ferme, retour du focus sur le bouton), ouverture en bandes verticales (`--dur-fast`), sans animation en mode réduit.
- Hauteur : 72 px desktop, 60 px mobile. Toujours visible (pas de masquage au scroll : trop d'effets simultanés avec les scènes).

### 5.2 Onglet de contact fixe (desktop uniquement)

Emprunt direct à l'onglet orange de White Desert.
```
                                                   ┌──┐
                                                   │M │
                                                   │e │
                                                   │  │  <- pastille verticale collée au bord droit,
                                                   │c │     fond ember, texte on-accent, texte pivoté
                                                   │o │     à 90°, hauteur ~160px, centrée verticalement
                                                   │n │
                                                   │t.│
                                                   └──┘
```
- Visible **dès 1280 px** (décision du 2026-09-26, QA F03, remplace « dès `lg` »), sur toutes les pages sauf Contact, Admin et 404. Masqué quand la scène finale de l'accueil est à l'écran (règle « un seul élément braise »).
- **Aucun contenu dessous** : là où l'onglet est affiché, la marge de droite devient `--margin-end` = max(`--margin`, largeur de l'onglet + 24 px), soit 68 px à 1280 et 1440 px. Elle s'applique au bord droit des conteneurs, de la grille apparente, des croix de repère et à la fin de course du carrousel des automatisations (la dernière carte s'arrête au bord du conteneur). Entre 1024 et 1279 px, la marge `lg` (40 px) est plus étroite que l'onglet (44 px) : pas d'onglet, le lien « Contact » de la navbar et le CTA du hero suffisent.
- Libellé : « Me contacter » / « Contact me ». Cible de 44 px de large minimum.
- Focus clavier : anneau cyan de 2 px, décalé de 3 px.
- Mobile : pas d'onglet flottant (il masquerait le contenu) ; le contact est dans le menu et dans la scène finale.

### 5.3 Boutons et liens

| Variante | Apparence | Usage |
|---|---|---|
| `primary` | Fond `cyan`, texte `on-accent`, rayon 0, hauteur 52 px, flèche `↗` ou `→` | Une action principale par scène au maximum (ex. « Voir mes projets ») |
| `contact` | Fond `ember`, texte `on-accent`, même forme | Uniquement l'action de contact (voir 2.2) |
| `ghost` | Contour 1 px `text-3`, texte `text` ; survol : contour `text`, fond `raised` | Action secondaire |
| `link` | Texte `cyan`, trait de soulignement 1 px décalé de 4 px | Liens dans le texte, « Tous les projets → » |

- Survol des boutons pleins : la flèche glisse de 4 px et le fond s'éclaircit de 8 % (`--dur-instant`). Pas de lueur, pas d'ombre.
- Focus visible partout : `outline: 2px solid var(--color-cyan); outline-offset: 3px`. Sur un bouton cyan, l'anneau passe en `--color-text`.
- Cible tactile minimale : 44 x 44 px.

### 5.4 Footer

Sobre, dense, sur la grille. Fond `--color-bg`, séparé par une ligne `line-strong`.

Desktop :
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Jack0237                    PAGES          PROFILS          CONTACT          │
│ (italique serif, signature) Projets        GitHub ↗         [moyen de        │
│                             CV             LinkedIn ↗        contact]        │
│ Wilfried NGUEGUIM           Blog           X ↗                               │
│ Dev full-stack &            Contact                          Télécharger     │
│ automatisation IA                                             mon CV ↓       │
│──────────────────────────────────────────────────────────────────────────────│
│ © 2026 Wilfried NGUEGUIM   MISE À JOUR : [date du build]   ( FR | EN )  ↑ Haut│
└──────────────────────────────────────────────────────────────────────────────┘
      text-3, mono meta pour la ligne du bas
```
Mobile : colonnes empilées dans l'ordre signature, Pages, Profils, Contact, ligne du bas sur deux lignes.

- La date de mise à jour est générée au build (donnée réelle, pas inventée).
- Liens externes : `rel="noopener"`, icône `↗`, libellé accessible « GitHub (nouvel onglet) ».
- Pas de « Made with ♥ », pas de compteur de visites.

---

## 6. Règles de motion

### 6.1 Principes

1. **Le mouvement raconte le parcours, il ne décore pas.** Trois familles seulement : le **fil cyan** (progression), les **bandes** (changement de scène), les **révélations** (arrivée du contenu). Tout ce qui n'entre pas dans ces familles est refusé.
2. **Le contenu est lisible sans animation.** Aucun texte n'est caché en attendant une animation qui pourrait ne pas se déclencher : l'état final est l'état par défaut du HTML, l'animation part de là (on anime « depuis », pas « vers »).
3. **Le scroll reste à l'utilisateur.** Pas de scroll-jacking qui change la vitesse ou la destination du défilement. Le défilement doux (Lenis) est optionnel et seulement sur desktop avec souris (question ouverte).
4. **Une seule animation « héroïque » à la fois** à l'écran.
5. Seules `transform`, `opacity`, `clip-path` et `stroke-dashoffset` sont animées (propriétés composées par le GPU). Jamais `width`, `height`, `top`, `left`, `filter: blur()` en boucle.

### 6.2 Ce qui s'anime

| Élément | Animation | Déclencheur | Durée / easing |
|---|---|---|---|
| Hero, entrée | Mot géant révélé par un masque qui monte (lettres depuis la ligne de base), puis prénom italique et titre en fondu décalé | Chargement, une fois par visite | `--dur-epic`, `--ease-out` |
| Hero, sortie | Le mot géant se dissout dans la brume (masque de bruit qui grignote les lettres) et remonte légèrement (parallaxe 0,3) | Scroll (scrub) | lié au scroll |
| Fil cyan | Se dessine au fil du défilement, du hero à la scène finale, avec un point lumineux à sa tête ; les étapes franchies passent de `cyan-dim` à `cyan` | Scroll (scrub) | lié au scroll |
| Transition entre scènes | 4 bandes verticales (alignées sur la grille) qui balaient l'écran en décalé et révèlent la scène suivante | Entrée de scène | `--dur-slow` (0,9 s), `--ease-in-out`, décalage 80 ms |
| Titres de scène | Révélation par masque ligne par ligne | Titre à 80 % de la fenêtre | 0,9 s, `expo.out`, décalage 100 ms |
| Blocs de contenu (`[data-reveal]`) | Fondu + montée de 30 px, par lots (`ScrollTrigger.batch`) | Bloc à 85 % de la fenêtre, une fois | `--dur-reveal` (0,8 s), `power3.out`, décalage 100 ms |
| Capture Relanceo | Montée de 40 px + légère remise à plat (de 4° à 0° de rotation X) | Scroll (scrub) pendant l'épinglage | lié au scroll |
| Automatisations | Défilement horizontal des cartes pendant que la scène est épinglée ; dans chaque carte, le schéma de flux se trace | Scroll (scrub) | lié au scroll |
| Liens, boutons | Trait qui se dessine, flèche qui glisse | Survol / focus | `--dur-instant` |

### 6.3 Ce qui ne s'anime jamais

- Le texte courant, les paragraphes, les métadonnées **en effet propre** (ils apparaissent avec leur bloc, par la révélation de bloc, sans effet lettre par lettre).
- Le sélecteur de langue, la navigation (hormis l'ouverture du menu mobile).
- Aucun effet machine à écrire, aucune particule, aucun curseur personnalisé, aucun tilt 3D au survol, aucun compteur qui défile (d'autant qu'aucun chiffre n'est inventé).
- Rien ne boucle indéfiniment, sauf la brume du hero (très lente, arrêtée hors écran et quand l'onglet est masqué).

### 6.4 Fallback `prefers-reduced-motion: reduce` (strict)

Quand l'utilisateur a demandé moins de mouvement, **ou** sur un appareil classé « bas de gamme » (section 10.4) :

| Effet | Comportement réduit |
|---|---|
| Défilement doux (Lenis) | Désactivé. Défilement natif. |
| Entrée du hero | Aucune. Le mot, le prénom et le titre sont affichés d'emblée. |
| Brume WebGL | Non chargée. Image fixe (poster AVIF) à la place. |
| Dissolution du mot géant | Aucune. Le mot reste statique et défile normalement avec la page. |
| Fil cyan | Dessiné **en entier et statique** dès le chargement (le repère de parcours reste, sans mouvement). |
| Bandes de transition | Supprimées. Les scènes se succèdent simplement. |
| Épinglage (pinning) des scènes | Supprimé. |
| Carrousel horizontal des automatisations | Remplacé par une liste verticale de cartes (mobile et desktop). |
| Schémas de flux | Affichés tracés, statiques. |
| Révélations de titres et de blocs | Aucune ; au plus un fondu d'opacité de 120 ms. |
| Survols | Changements de couleur conservés, déplacements (flèche qui glisse) supprimés. |

- Détection via `matchMedia('(prefers-reduced-motion: reduce)')`, **et réaction en direct** si le réglage change pendant la visite.
- Le JavaScript d'animation (GSAP, Lenis, shader) n'est **pas téléchargé** en mode réduit : import dynamique conditionnel.
- Proposition : un interrupteur « Réduire les animations » dans le footer, mémorisé en `localStorage`, pour les visiteurs qui n'ont pas réglé leur système (question ouverte).

### 6.5 Règles de timing

Deux familles, jamais mélangées (retour utilisateur 2026-09-25 : animations trop rapides, pas assez fluides).

| Famille | Exemples | Durée | Easing |
|---|---|---|---|
| Retour d'interface | Survol, bouton, interrupteur, menu, sélecteur | 150 à 300 ms (`--dur-instant`, `--dur-fast`, `--dur-base`) | ease-out (`--ease-ui`) |
| Révélation et scroll | Titres, blocs, bandes, épinglage, carrousel, fil | 0,8 à 1 s | ease-out marqué (`expo.out`, `power4.out`, `power3.out`) |

- Les entrées sont toujours en ease-out ; jamais de `linear` sur une animation temporelle (le `linear`/`none` reste réservé à la correspondance directe avec le scroll).
- Scrub lissé : `scrub: 1` pour l'épinglage Relanceo (`end: +=120%`) et le carrousel des automatisations, `scrub: 0.8` pour la dissolution du mot géant et le fil cyan. Jamais `scrub: true` (suivi brut, saccadé à la molette).
- **Jamais d'épinglage sur un écran vide** (décision du 2026-09-26, QA F01 / F02). Fiche Relanceo : épinglée sous la navbar (`start: top top+=<navbar + 24 px>`, pas de centrage) ; l'en-tête (FIG., nom, sous-titre) se révèle à l'entrée de scène comme les autres blocs (0,8 s, `top 85%`) ; les blocs suivants sont scrubbés sur une course qui commence avant l'épinglage (haut de la fiche à 85 % de l'écran) et se termine avec lui, avec une pause finale fiche complète. À l'épinglage, environ 40 % du scrub est joué (problème et liste visibles) ; l'ancre « Voir mes projets » arrive sur le titre, le nom, le sous-titre et le problème. Carrousel des automatisations : épinglé à navbar + 16 px, contrôles compris.
- Décalage entre éléments frères : 100 ms.
- Seules `transform` et `opacity` sont animées pour les révélations (pas de CLS). L'état caché est posé par le moteur, jamais par le CSS : sans JS et en palier réduit, tout reste visible.
- Exceptions conservées : entrée du hero 1,2 s (lettres), schémas de flux 1,2 s.
- Dissolution du mot géant : elle anime une variable CSS qui pilote un `mask-image`, donc une repeinture du mot à chaque image. Mesuré le 2026-09-25 (Chrome, trace Playwright, 1440 x 900) : 0 image au-delà de 20 ms, p95 16,9 ms, environ 0,1 ms de peinture par image ; `will-change: transform` sans gain mesurable. Conservée telle quelle. À remesurer si le visuel 3D du hero s'y superpose.

Sources : [NN/g, durée des animations](https://www.nngroup.com/articles/animation-duration/), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Codrops, révélations décalées de texte](https://tympanus.net/codrops/2020/06/17/making-stagger-reveal-animations-for-text/).

---

## 7. Page d'Accueil : l'expédition en six scènes

### 7.1 Objectif et parcours

- **Objectif** : en moins de 10 secondes, un recruteur sait **qui** (Wilfried NGUEGUIM), **quoi** (dev full-stack & automatisation IA) et **où cliquer** (projets, contact). En 1 à 2 minutes de défilement, un client freelance a vu un produit en production (Relanceo), des automatisations réelles et les services proposés.
- **Deux lecteurs, deux vitesses** : le recruteur pressé lit le hero, survole la scène Projets et clique ; le visiteur curieux vit l'expédition complète. La page doit fonctionner pour les deux : toute l'information clé est dans le hero et dans les titres de scène.
- Le **fil cyan** relie les six étapes. Chaque scène porte un numéro d'étape en mono (`ÉTAPE 01`, ...) aligné sur la grille.

| # | Scène (structure du brief) | Nom narratif interne | Ce que le fil cyan fait |
|---|---|---|---|
| 01 | Hero | Le départ | Naît sous le mot géant, point de départ |
| 02 | Projets phares | L'expédition | Relie Relanceo puis traverse les schémas d'automatisation, où il devient les connexions des flux |
| 03 | Services | Les itinéraires | Se divise en trois branches, une par service |
| 04 | Stack | L'équipement | Se rassemble et longe la rangée de logos comme une ligne de base |
| 05 | Derniers articles | Le journal de bord | Descend le long des entrées du journal, comme une frise |
| 06 | Appel final | L'arrivée | Aboutit à un point fixe, sur le bouton de contact |

Les noms narratifs servent à l'équipe (et éventuellement aux étiquettes mono des scènes, à décider par `content-writer`). Les titres visibles restent explicites pour le recruteur : « Projets », « Services », « Stack », « Blog », pas de jargon d'expédition dans les titres.

### 7.2 Scène 01 : Hero, « Le départ »

**Objectif** : identité, métier, valeur, deux actions. Premier écran = LCP.

**Hiérarchie** : 1. H1 « Wilfried NGUEGUIM » (NGUEGUIM géant) · 2. titre « Dev full-stack & automatisation IA » · 3. phrase de valeur · 4. CTA « Voir mes projets » (primary) et « Me contacter » (ghost) · 5. photo discrète · 6. métadonnées.

Desktop (1440 x 900) :
```
┌────────────┬──────────────────┬──────────────────┬──────────────────┬────────────┐
│ JACK0237        Projets  CV  Blog  Contact              01 / 06      ( FR | EN ) │
│            │                  │                  │                  │            │
│ ÉTAPE 01   │                  │                  │  ┌────────────┐  │  [ville]   │
│ [LIEU]     │                  │                  │  │            │  │  [heure    │
│ [HEURE     │                  │                  │  │  portrait  │  │   locale]  │
│  LOCALE]   │                  │                  │  │  détouré   │  │            │
│            │                  │                  │  │  (N&B      │  │            │
│ [Phrase de valeur, Mona Sans    │                  │  │  légèrement│  │            │
│  22px, text-2, 2 à 3 lignes,    │                  │  │  froid)    │  │            │
│  max 40 caractères/ligne]       │                  │  └────────────┘  │            │
│                                 │                  │                  │            │
│ [ Voir mes projets → ] [ Me contacter ]            │                  │            │
│                                                                                  │
│ Wilfried                                   Dev full-stack & automatisation IA    │
│ (Newsreader italique, --type-voice)        (Mona Sans h3, aligné à droite)       │
│ N  G  U  E  G  U  I  M   <- mot géant bord à bord (--type-giant), blanc glacier,  │
│                             posé sur le bas de l'écran, le portrait le chevauche │
│ ════●══════════════════════════════════════════  <- le fil cyan naît ici         │
└────────────┴──────────────────┴──────────────────┴──────────────────┴────────────┘
  lignes verticales = grille apparente (4 bandes) ; croix de repère aux angles
```
- Le **portrait** chevauche le haut du mot géant (le bas du buste passe **derrière** les lettres, comme le cavalier de Money in Check et le portrait de Snellenberg). Taille modérée (environ 22 % de la largeur) : « photo discrète » du brief. Si le détourage n'est pas validé, variante : portrait rectangulaire net dans un cadre à croix de repère, sans chevauchement.
- **Métadonnées** en mono `text-3` : lieu et heure locale (heure calculée en direct si l'utilisateur valide le fuseau), statut de disponibilité (question ouverte), rien d'inventé.
- **Signature** : « Jack0237 » peut apparaître en italique serif près du portrait, comme une légende (question de dosage à arbitrer à la maquette).
- **Fond** : `--color-bg` + brume WebGL très lente (desktop capable) ou poster AVIF (section 10). Pas de photo d'ambiance, pas de code flou en fond.
- Pas de préchargeur, pas de machine à écrire.

Mobile (390 x 844) :
```
┌──────────────────────────────────┐
│ JACK0237          ( FR|EN )  ☰   │
│ ÉTAPE 01        [LIEU] · [HEURE] │
│                                  │
│          ┌──────────────┐        │
│          │   portrait   │        │
│          │   détouré    │        │
│          └──────────────┘        │
│ Wilfried                         │
│ NGUEGUIM   <- une ligne, ~84px   │
│ ═●══════════════════════════     │
│ Dev full-stack &                 │
│ automatisation IA                │
│                                  │
│ [Phrase de valeur, 17px, text-2] │
│                                  │
│ [      Voir mes projets →      ] │  <- pleine largeur
│ [         Me contacter         ] │
└──────────────────────────────────┘
```
Sur mobile, l'ordre de lecture est l'ordre visuel (le mot géant remonte avant le titre) ; les deux CTA sont visibles sans défiler sur un écran de 844 px de haut (à vérifier en QA avec la phrase de valeur réelle).

### 7.3 Transition 01 → 02

Le mot géant se dissout dans la brume en remontant ; le fil cyan continue de descendre ; les 4 bandes verticales balaient l'écran de gauche à droite (décalage 80 ms) et révèlent la scène 02 sur fond `--color-panel`. Mobile : pas de bandes, simple défilement ; le fil cyan continue sur le bord gauche.

### 7.4 Scène 02 : Projets phares, « L'expédition »

**Objectif** : prouver par un produit réel. Relanceo en grand, puis 2 ou 3 automatisations en plus petit, lien vers la page Projets.

**Hiérarchie** : 1. titre de scène « PROJETS » · 2. Relanceo : nom, problème, capture, stack, lien prod · 3. automatisations (2 ou 3) · 4. « Tous les projets → ».

**Partie A, Relanceo** (desktop, scène épinglée pendant environ 1,5 hauteur d'écran) :
```
┌────────────┬──────────────────┬──────────────────┬──────────────────┬────────────┐
│ ÉTAPE 02 · PROJETS                                                               │
│ PROJETS  <- --type-display                                                       │
│                                                                                  │
│ FIG. 01 · SAAS · EN PRODUCTION     ┌─────────────────────────────────────────┐   │
│ Relanceo  <- --type-h2             │ ● ● ●   [url de prod]                   │   │
│                                    │                                         │   │
│ LE PROBLÈME                        │   capture réelle de l'app Relanceo      │   │
│ [2 lignes : relance de factures    │   (tableau de bord), 16:10              │   │
│  pour les TPE, content-writer]     │   ombre --shadow-capture                │   │
│                                    │   croix de repère aux angles            │   │
│ CE QUE ÇA FAIT                     │                                         │   │
│ [3 puces courtes]                  └─────────────────────────────────────────┘   │
│                                      « [légende en italique serif, voix         │
│ STACK  [badges mono pill]              de Wilfried sur le projet] »              │
│                                                                                  │
│ [ Voir Relanceo en ligne ↗ ]  Étude de cas →                                     │
│ ══════●════════════════════════════════════  fil cyan qui file vers la partie B  │
└──────────────────────────────────────────────────────────────────────────────────┘
```
- Pendant l'épinglage : la capture monte et se remet à plat, les blocs texte de gauche apparaissent l'un après l'autre. L'en-tête de la fiche est déjà visible au début de l'épinglage (voir 6.5, règle « jamais d'épinglage sur un écran vide »). Aucun chiffre de résultat (clients, CA, taux de relance) sauf données réelles fournies par l'utilisateur.
- « FIG. 01 » : légende technique à la façon d'Oxide, qui donne le ton « fiche d'expédition ».

**Partie B, automatisations** (desktop : défilement horizontal épinglé ; 2 ou 3 cartes, question ouverte sur le choix) :
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ AUTOMATISATIONS N8N / IA                                   02 / 03  ← →          │
│                                                                                  │
│ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────  │
│ │ FIG. 02 · N8N · IA           │ │ FIG. 03 · N8N · IA           │ │ FIG. 04 ...  │
│ │ [Nom de l'automatisation]    │ │ [Nom]                        │ │              │
│ │                              │ │                              │ │              │
│ │ ◇ Déclencheur                │ │  schéma de flux SVG          │ │              │
│ │ ╰──● Étape IA ──● Étape ──▶  │ │  tracé en cyan               │ │              │
│ │               ╰──● Sortie    │ │                              │ │              │
│ │                              │ │                              │ │              │
│ │ [ce que ça automatise,       │ │                              │ │              │
│ │  2 lignes]                   │ │                              │ │              │
│ │ STACK n8n · Gemini · ...     │ │                              │ │              │
│ └──────────────────────────────┘ └──────────────────────────────┘ └────────────  │
│                                                          Tous les projets →      │
└──────────────────────────────────────────────────────────────────────────────────┘
```
- Chaque carte : fond `--color-bg` sur la scène `panel`, bordure `line-strong`, rayon 0, largeur environ 5 colonnes. Le schéma est un **SVG redessiné** d'après le vrai workflow (nœuds réels, noms génériques), pas une capture de l'éditeur n8n. Le fil cyan principal entre dans le déclencheur de chaque schéma.
- **Ad Studio** : présenté sans jamais citer le client (brief). Aucune donnée, aucun visuel publicitaire du client, aucun nom de marque sur les captures.
- Contrôles : flèches `← →` et compteur mono pour le clavier et ceux qui ne veulent pas scroller ; `Tab` passe de carte en carte.

Mobile :
```
┌──────────────────────────────────┐
│ ÉTAPE 02 · PROJETS               │
│ PROJETS                          │
│ FIG. 01 · SAAS · EN PRODUCTION   │
│ Relanceo                         │
│ ┌──────────────────────────────┐ │
│ │ capture mobile ou desktop    │ │
│ │ recadrée 4:3                 │ │
│ └──────────────────────────────┘ │
│ LE PROBLÈME  [2 lignes]          │
│ CE QUE ÇA FAIT [3 puces]         │
│ STACK [badges]                   │
│ [ Voir Relanceo en ligne ↗ ]     │
│ Étude de cas →                   │
│──────────────────────────────────│
│ AUTOMATISATIONS N8N / IA         │
│ ┌────────────────────────┐┌───   │  <- défilement horizontal natif
│ │ FIG. 02 · schéma       ││       │     avec scroll-snap, carte à 85 %
│ │ [Nom] [2 lignes]       ││       │     de largeur (la suivante dépasse)
│ └────────────────────────┘└───   │
│ ● ○ ○                            │
│ Tous les projets →               │
└──────────────────────────────────┘
```
Pas d'épinglage sur mobile.

### 7.5 Transition 02 → 03

Le fil cyan sort du dernier schéma, redescend et **se divise en trois branches** qui viennent chacune se poser au-dessus d'une carte de service. Fond : retour de `panel` à `bg` par les 4 bandes (desktop).

### 7.6 Scène 03 : Services, « Les itinéraires »

**Objectif** : dire à un client ce qu'on peut faire pour lui, en trois options, et l'emmener vers Contact / services.

Desktop :
```
┌────────────┬──────────────────┬──────────────────┬──────────────────┬────────────┐
│ ÉTAPE 03 · SERVICES                                                              │
│ SERVICES                     « [accroche en italique serif, une ligne] »         │
│                                                                                  │
│        ╭──────────────────────────┼──────────────────────────╮  <- 3 branches    │
│        ●                          ●                          ●     du fil cyan   │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐       │
│ │ 01                   │ │ 02                   │ │ 03                   │       │
│ │ SITES ET             │ │ APPLIS               │ │ AUTOMATISATIONS      │       │
│ │ APPLIS WEB           │ │ MOBILES              │ │ N8N / IA             │       │
│ │ (display condensé    │ │                      │ │                      │       │
│ │  40px)               │ │                      │ │                      │       │
│ │ [2 lignes : pour qui │ │ [2 lignes]           │ │ [2 lignes]           │       │
│ │  et quel résultat]   │ │                      │ │                      │       │
│ │ STACK mono           │ │ STACK mono           │ │ STACK mono           │       │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘       │
│                                             Voir les services et me contacter →  │
└──────────────────────────────────────────────────────────────────────────────────┘
```
- Trois colonnes de 4 colonnes chacune, bordures `line-strong`, rayon 0. Pas d'icônes génériques (fusée, ampoule) : le numéro mono et le titre condensé suffisent.
- Survol (desktop) : le fond passe en `raised`, la branche du fil correspondante passe de `cyan-dim` à `cyan`, le reste s'atténue légèrement. Carte entière cliquable vers la page Contact / services, ancre du service.
- Aucun tarif ni délai sauf information fournie par l'utilisateur.

Mobile : cartes empilées, le fil cyan descend sur le bord gauche et marque chaque carte d'un point.

### 7.7 Transition 03 → 04

Pas de bandes (on garde les bandes pour les grands changements de fond) : les trois branches se rejoignent et le fil devient une ligne horizontale de base. Simple révélation du titre.

### 7.8 Scène 04 : Stack, « L'équipement »

**Objectif** : montrer l'outillage en un coup d'oeil. Compact, sans barres de pourcentage (brief).

Desktop :
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ÉTAPE 04 · STACK                                                                 │
│ STACK                                                                            │
│                                                                                  │
│ FRONT          BACK            MOBILE        AUTOMATISATION / IA   INFRA         │
│ [◼][◼][◼]      [◼][◼][◼]       [◼][◼]        [◼][◼][◼]             [◼][◼][◼]     │
│ ═════════════════════════════════════════════════════════════════●  <- fil cyan  │
│                                                                     ligne de base│
└──────────────────────────────────────────────────────────────────────────────────┘
```
- Logos SVG monochromes `text-2`, 28 px de haut, groupés sous une étiquette mono. Au survol ou au focus : logo en `text` et nom de l'outil en info-bulle mono (le nom est aussi dans `aria-label`/`title`, pas d'information portée par le logo seul).
- Pas de couleurs de marque (elles casseraient la palette), pas de défilement infini de logos (cliché).
- La liste des outils est à **valider par l'utilisateur** (section 14) ; candidats relevés dans ses projets réels : React, Firebase, Node.js / Express, PostgreSQL, Supabase, Expo / React Native, Flutter, n8n, API Gemini, Docker, Traefik.

Mobile : groupes empilés en 2 colonnes, étiquette au-dessus de chaque groupe.

### 7.9 Transition 04 → 05

Le fil quitte la ligne de base et tourne à 90° pour descendre verticalement : il devient la frise du journal de bord. Bandes (desktop) : retour sur fond `panel`.

### 7.10 Scène 05 : Derniers articles, « Le journal de bord »

**Objectif** : montrer que le blog est vivant ; 3 derniers articles de la collection Firestore `blogs`.

Desktop :
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ÉTAPE 05 · BLOG                                                                  │
│ BLOG                             « [accroche italique : le journal de bord] »    │
│                                                                                  │
│  ●  26 MAY 2026 · 05 MIN READ   ┌──────────┐  [TITRE DE L'ARTICLE]               │
│  │  [EYEBROW]                   │ visuel   │  #TAG #TAG                  Lire → │
│  │                              │ 16:9     │                                     │
│  │──────────────────────────────└──────────┘──────────────────────────────────── │
│  ●  [date] · [durée]            ┌──────────┐  [TITRE]                    Lire → │
│  │                              └──────────┘                                     │
│  │─────────────────────────────────────────────────────────────────────────────  │
│  ●  [date] · [durée]            ┌──────────┐  [TITRE]                    Lire → │
│  │                              └──────────┘                                     │
│                                                              Tout le blog →      │
└──────────────────────────────────────────────────────────────────────────────────┘
   le fil cyan descend à gauche ; un point par article
```
- Format « entrée de journal » (liste), **pas une grille de 3 cartes** (cliché le plus répandu des portfolios). Ligne entière cliquable ; survol : fond `raised`, visuel qui passe de désaturé à couleur, flèche qui glisse.
- Données réelles uniquement : `title`, `date`, `readTime`, `eyebrow`, `tags`, `image` tels qu'écrits par le workflow n8n. Les dates sont des chaînes (« 26 MAY 2026 ») : le tri « 3 derniers » se fait sur l'identifiant du document (horodatage `Date.now()` écrit par n8n), pas sur la chaîne de date. Les titres arrivent déjà en capitales : on les affiche tels quels en `--type-h3` (pas de transformation supplémentaire).
- Langue : chaque article garde sa langue d'origine, avec attribut `lang` et un badge mono « EN » ou « FR » si la langue de l'article diffère de celle de l'interface.
- Liens vers `/blog/[id]` (format actuel, que le bot Telegram renvoie : il doit continuer de fonctionner).

États :
| État | Rendu |
|---|---|
| Chargement | Aucun, si les articles sont rendus côté serveur (recommandé, section 12). Sinon, 3 lignes squelettes de même hauteur (pas de décalage), fond `raised`, sans shimmer animé. |
| Vide | Une ligne en italique serif : « [Le journal de bord s'ouvre bientôt.] » + lien vers le blog. La scène n'est pas masquée (la mise en page ne saute pas). |
| Erreur | Même rendu que vide, sans message technique ; l'erreur est journalisée côté serveur. |
| Image manquante (`blogImg1` par défaut) | Visuel de repli de la charte (brief assets, point 8), jamais une image cassée. |

Mobile : entrées empilées, visuel 16:9 au-dessus du titre, fil cyan sur le bord gauche.

### 7.11 Transition 05 → 06

Le fil cyan sort de la dernière entrée et file en diagonale vers le centre de la scène finale, où il se termine en un point fixe. Bandes (desktop) : retour sur fond `bg`.

### 7.12 Scène 06 : Appel final, « L'arrivée »

**Objectif** : transformer l'intérêt en contact. Une invitation, un bouton contact, le CV, les liens sociaux.

Desktop :
```
┌────────────┬──────────────────┬──────────────────┬──────────────────┬────────────┐
│ ÉTAPE 06 · CONTACT                                                               │
│                                                                                  │
│                                                                                  │
│      « [Invitation en italique serif, très grand corps,                          │
│         clamp(36px, 5vw, 72px), 2 lignes, voix de Wilfried] »                    │
│                                                                                  │
│      ══════════════════════════════════════●  <- arrivée du fil cyan             │
│                                    [ Me contacter → ]   <- bouton ember          │
│                                    [ Télécharger mon CV ↓ ]  <- ghost            │
│                                                                                  │
│      GitHub ↗     LinkedIn ↗     X ↗                           Jack0237          │
│                                                     (signature italique serif)   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

- L'onglet de contact fixe se masque à l'arrivée dans cette scène.
- « Me contacter » pointe vers la page Contact / services (ou vers le moyen de contact choisi par l'utilisateur, `[À COMPLÉTER]` dans le brief).
- « Télécharger mon CV » : PDF réel (`RN_CV_NGUEGUIM_WILFRIED.pdf` actuel, à confirmer à jour), attribut `download`, poids du fichier indiqué en mono.

Mobile : même ordre, boutons pleine largeur, liens sociaux en ligne, signature en dessous.

Puis le **footer** global (5.4).

### 7.13 États et interactions transverses de l'accueil

- **Focus** : l'ordre de tabulation suit l'ordre de lecture ; les scènes épinglées ne piègent jamais le focus ; quand un élément reçoit le focus dans une scène épinglée, la page défile pour le rendre visible.
- **Liens d'évitement** : « Aller au contenu » en premier élément focusable.
- **Titres** : un seul H1 (hero), un H2 par scène (le titre de scène), H3 pour projets, services, articles.
- **Langue** : tous les textes de scène passent par le système de traduction ; les métadonnées mono aussi (« ÉTAPE » / « STEP »).
- **Sans JavaScript** : la page reste complète et lisible (rendu serveur), seul le mouvement disparaît.

---

## 8. Accessibilité (socle)

- Cible **WCAG 2.2 AA** sur tout le site. Contrastes : tableau 2.1.
- Aucune information portée par la seule couleur (cyan vs braise, états actifs) : toujours un libellé, une forme ou un trait.
- Focus visible partout (5.3), cibles tactiles de 44 px minimum.
- Le mot géant et tous les titres sont du texte réel, sélectionnable et traduisible par le navigateur.
- Les SVG décoratifs (fil cyan, grille, croix, bandes) sont `aria-hidden="true"`. Les schémas de flux ont un `role="img"` et un `aria-label` qui décrit le flux en une phrase (ex. « Déclencheur Telegram, rédaction par IA, enregistrement dans la base, confirmation »).
- Le zoom texte à 200 % ne casse pas les scènes (pas de hauteurs fixes sur les blocs de texte).
- `ux-qa-auditor` valide avec le skill `accessibility` avant toute mise en production.

---

## 9. Bilingue FR/EN (impact design)

- Routes par langue (ex. `/` ou `/fr` pour le français, `/en` pour l'anglais : arbitrage `seo-strategist`), balises `hreflang`, attribut `lang` sur `<html>`.
- Les libellés anglais sont en général plus courts ; on dimensionne sur le **français** (le plus long) et on vérifie l'anglais.
- Le mot géant ne change pas (nom propre). Les titres de scène condensés doivent tenir sur une ligne dans les deux langues à 390 px : `content-writer` vise 12 caractères maximum.
- Le choix de langue est mémorisé (cookie ou `localStorage`), et la détection initiale du navigateur ne redirige **jamais** de force.

---

## 10. Performance

L'ambiance C est la plus lourde des quatre. La règle : **le spectaculaire est une couche ajoutée par-dessus une page rapide, jamais une condition pour voir le contenu.**

### 10.1 Répartition des techniques

| Effet | Technique | Pourquoi |
|---|---|---|
| Brume / grain du hero | **WebGL** (un seul shader plein écran, bibliothèque minuscule type OGL ou WebGL brut, pas de Three.js) | Seul effet qui justifie le GPU ; chargé après l'affichage, désactivable |
| Dissolution du mot géant | **CSS** `mask-image` (texture de bruit) dont la position et la taille suivent le scroll | Pas de WebGL pour du texte : le texte reste du texte |
| Fil cyan et ses branches | **SVG** `path` + `stroke-dashoffset` piloté par le scroll | Léger, net à toutes les tailles, accessible (décoratif) |
| Bandes de transition | **CSS** `clip-path` / `transform` sur 4 `div` | Composé par le GPU, zéro image |
| Schémas de flux n8n | **SVG** inline | Traçables, légers, traduisibles |
| Épinglage, carrousel horizontal | **JS** (GSAP ScrollTrigger), `transform` uniquement | Standard éprouvé, gère le redimensionnement |
| Grille, croix de repère | **CSS** (fond en `linear-gradient` ou éléments de 1 px) | Aucune image |
| Captures (Relanceo, articles) | **Images** AVIF/WebP responsive, `srcset`, chargement différé sauf au-dessus de la ligne de flottaison | |
| Canvas 2D | **Non utilisé** | Aucun besoin identifié |

### 10.2 Budgets

| Indicateur | Cible (p75, mobile 4G milieu de gamme) | Cible desktop |
|---|---|---|
| LCP | ≤ 2,5 s (visé 2,0 s) | ≤ 1,5 s |
| CLS | ≤ 0,05 | ≤ 0,05 |
| INP | ≤ 200 ms | ≤ 150 ms |
| JS initial de l'accueil (compressé) | ≤ 120 Ko hors framework d'animation chargé en différé | idem |
| Polices | 3 fichiers woff2 sous-ensemble latin, ≤ 180 Ko au total, seule Mona Sans préchargée | idem |
| Images au-dessus de la ligne de flottaison | Portrait ≤ 60 Ko (AVIF) | Portrait ≤ 90 Ko |
| Poids total de l'accueil au premier affichage | ≤ 500 Ko | ≤ 900 Ko avec brume WebGL |

Ces budgets sont des objectifs de conception, à mesurer par `ux-qa-auditor` (Lighthouse + WebPageTest) sur la préproduction, pas des valeurs déjà constatées.

### 10.3 LCP et CLS : points précis

- **L'élément LCP est le mot géant (texte)**, pas une image : il dépend de la police. Donc : Mona Sans préchargée, auto-hébergée, `font-display: swap` avec une police de repli aux métriques ajustées (`size-adjust`, `ascent-override`) pour que le remplacement ne fasse pas bouger la page ; conteneur du mot géant de hauteur réservée.
- Aucun contenu du hero n'est masqué par du JS au chargement (sinon le LCP attend le JS).
- Les articles du blog sont rendus côté serveur : **pas de SDK Firebase chargé sur l'accueil** (c'est un poids important aujourd'hui).
- Images : dimensions `width`/`height` toujours renseignées ; captures en `aspect-ratio` fixe.
- GSAP, ScrollTrigger, Lenis et le shader : chargés par import dynamique **après** le premier affichage (`requestIdleCallback` ou premier scroll).

### 10.4 Paliers d'appareils

| Palier | Condition de détection | Ce qui est actif |
|---|---|---|
| **Riche** | Écran ≥ 1024 px, pointeur fin, `hardwareConcurrency ≥ 4`, `deviceMemory ≥ 4` (si disponible), pas de `Save-Data`, pas de mouvement réduit | Tout : brume WebGL, Lenis (si validé), épinglage, carrousel horizontal, bandes, fil animé |
| **Standard** | Mobile et tablettes, ou desktop qui ne remplit pas le palier riche | Fil cyan animé (SVG), révélations de titres, défilement horizontal **natif** avec scroll-snap. **Coupés** : WebGL (poster AVIF), Lenis, épinglage, bandes |
| **Réduit** | `prefers-reduced-motion`, `Save-Data`, `deviceMemory < 4` sur mobile, ou interrupteur du footer | Fallback strict de la section 6.4. Aucun JS d'animation téléchargé |

- Garde-fou dynamique : si le shader fait chuter la fréquence d'image sous 45 i/s pendant 2 s, il s'arrête et laisse le poster.
- Le shader se met en pause hors écran (`IntersectionObserver`) et quand l'onglet est masqué (`visibilitychange`).
- Aucune vidéo sur l'accueil.

---

## 11. Brief visuel pour `visual-asset-curator`

Règles communes : licences vérifiées et consignées dans `docs/ASSETS.md` ; formats AVIF + WebP de repli ; SVG optimisés (SVGO) ; noms de fichiers en kebab-case descriptifs ; aucune image générique de « code flou », de réseau de neurones lumineux, de hacker à capuche ou de mains sur un clavier ; aucune donnée ou marque de client visible (en particulier aucune mention du client d'Ad Studio).

| # | Asset | Emplacement | Style | Format / ratio / dimensions | Source attendue |
|---|---|---|---|---|---|
| 1 | **Portrait détouré** | Hero, chevauche le mot géant | Détourage propre (cheveux compris), noir et blanc légèrement froid ou couleur désaturée à 30 % (deux propositions à montrer), lumière latérale | AVIF avec transparence + PNG de repli, 4:5, 1200 x 1500 px source, livrés en 480 / 800 / 1200 px | `src/Assets/profile.jpg` actuel (brief) ; **l'utilisateur choisit** entre détouré et cadre rectangulaire |
| 2 | **Poster de brume** | Fond du hero (paliers standard et réduit, et avant chargement du shader) | Brume glacée nocturne abstraite, noir bleuté vers `#0F1720`, aucune forme reconnaissable, grain fin | AVIF 16:9, 2560 x 1440 px, ≤ 120 Ko ; version mobile 9:16 1080 x 1920 px, ≤ 80 Ko | Généré (rendu du shader figé) ou texture libre de droits (CC0) |
| 3 | **Texture de bruit pour la dissolution** | Masque CSS du mot géant | Bruit organique en niveaux de gris, raccordable (tuile) | PNG 8 bits niveaux de gris, 1024 x 1024 px, ≤ 60 Ko | Générée (bruit de Perlin / fBm), aucune licence tierce |
| 4 | **Captures Relanceo** | Scène 02, partie A | Captures réelles de l'app en production, interface en thème sombre si disponible, **données de démonstration** (aucune donnée client réelle), cadre de fenêtre dessiné en CSS (pas de mockup d'ordinateur) | PNG source puis AVIF/WebP : desktop 16:10, 2880 x 1800 px ; recadrage mobile 4:3, 1200 x 900 px ; OG 1200 x 630 | Captures faites sur l'app, avec l'accord de l'utilisateur sur l'écran montré |
| 5 | **Schémas de flux (2 ou 3)** | Scène 02, partie B (et plus tard page Projets) | SVG redessinés d'après les vrais workflows n8n : nœuds carrés (rayon 2 px), liens en `cyan-dim`, chemin actif en `cyan`, libellés en JetBrains Mono ; noms de nœuds génériques, **aucun identifiant, URL interne, secret ou nom de client** | SVG inline, viewBox 480 x 320, ≤ 8 Ko chacun | Exports JSON des workflows dans le vault (`10_Projects/Manga Recap Pipeline/`, workflows Flux, Portfolio Blog Automator, Ad Studio anonymisé), à relire avant dessin |
| 6 | **Logos de stack** | Scène 04 | Monochromes, un seul tracé, sans couleurs de marque | SVG, hauteur 28 px, viewBox carrée 24 x 24 | Simple Icons (CC0 pour les SVG ; vérifier les règles d'usage des marques) |
| 7 | **Icônes d'interface et réseaux sociaux** | Navbar, boutons, footer, scène 06 | Trait 1,5 px, angles nets | SVG 24 x 24 | Lucide (licence ISC) ; GitHub, LinkedIn, X via Simple Icons |
| 8 | **Visuels de repli des articles** | Scène 05 et blog, quand `image` vaut `blogImg1` ou est vide | 3 variantes abstraites de la charte : grille fine, fragment de fil cyan, brume, fond `#07090B` ; aucune typographie incrustée (le titre est en HTML) | AVIF 16:9, 1600 x 900 px, ≤ 90 Ko chacune ; version OG 1200 x 630 | Création (générée ou dessinée) ; remplacent `blog-img-1/2/3.jpg` |
| 9 | **Image OG de l'accueil** | Partage social (FR et EN) | « NGUEGUIM » en Mona Sans condensée sur fond `#07090B`, fil cyan, « Dev full-stack & automatisation IA » et « jack0237.com » en mono | PNG 1200 x 630, ≤ 200 Ko, une version par langue si le titre diffère | Création |
| 10 | **Favicon et icône d'app** | Onglet, manifest | Monogramme « J » ou « WN » en Mona Sans condensée, blanc glacier sur `#07090B`, point cyan (question ouverte) | SVG + ICO 32 px + PNG 180 / 192 / 512 px | Création ; remplace `logo.png`, `logo.svg`, `icon.ico` |

À retirer lors de l'implémentation (après vérification qu'ils ne servent plus) : `home-main.svg`, `home-bg.jpg`, `pre.svg`, `avatar.svg`, `about.png` si non réutilisés, et le PDF `Soumyajit_Behera-BIT_MESRA.pdf` (résidus du template).

---

## 12. Recommandation de stack technique (QUESTION OUVERTE, décision utilisateur)

L'ambiance C conditionne le choix technique : elle demande du rendu serveur (pour que le mot géant soit le LCP et que le contenu existe sans JS), un contrôle fin du chargement différé, et une bibliothèque d'animation au scroll robuste. **Rien n'est décidé ici** : la migration se fera sur une branche dédiée, après accord (règle `portfolio-team`).

Contraintes non négociables : **Firebase conservé** (Firestore `blogs` et `projects`, Storage, Auth pour `/admin`) ; **le workflow n8n de publication ne casse pas** (il écrit directement dans Firestore avec un compte de service, identifiant `Date.now()`, et le bot Telegram renvoie un lien vers `/blog/<id>` : ce format d'URL et le schéma des documents doivent rester valides) ; le sous-domaine `blog.jack0237.com` continue de servir le blog ; déploiement Vercel.

### 12.1 Options comparées

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| **Garder CRA** (React 17) | Zéro migration | CRA est abandonné par l'équipe React depuis février 2025 ; rendu 100 % côté client : H1 et articles absents du HTML initial, aperçus sociaux par article impossibles, LCP lié au JS ; React 17 incompatible avec les versions récentes des outils d'animation React | Déconseillé |
| **Vite + React SPA** | Migration la plus simple depuis CRA, build rapide | Reste 100 % côté client : mêmes défauts SEO et LCP que CRA pour un site dont le hero est du texte | Acceptable seulement comme étape intermédiaire |
| **Next.js (App Router)** sur Vercel | Rendu statique + **régénération incrémentale (ISR)** : les articles publiés par n8n apparaissent sans rebuild, sans toucher au workflow ; `next/font` auto-héberge les polices avec métriques de repli (CLS) ; composants React existants réutilisables (Admin, éditeur Markdown) ; i18n par routes ; middleware pour le sous-domaine `blog.` ; intégration Vercel native | Plus de concepts (composants serveur / client) ; JS de base plus lourd qu'Astro | **Recommandé** |
| **Astro** + îlots React | Le plus léger (zéro JS par défaut), excellent pour un site de contenu, GSAP s'y intègre sans React | Admin et formulaires à isoler en îlots React ; ISR via l'adaptateur Vercel moins direct ; écart plus grand avec le code actuel et avec les habitudes de l'équipe | Alternative sérieuse si la performance brute prime sur la continuité |

### 12.2 Recommandation

**Next.js (App Router) + React 19, déployé sur Vercel**, avec :
- Accueil et pages projets en **rendu statique** ; blog et « Derniers articles » en **ISR** (revalidation périodique, par exemple toutes les 5 minutes). Le workflow n8n n'a **rien à changer**. Option facultative plus tard : un appel de revalidation à la demande ajouté en fin de workflow n8n, pour une publication instantanée.
- Lecture Firestore côté serveur (SDK Admin avec compte de service en variable d'environnement Vercel, ou SDK client en lecture publique selon les règles actuelles) ; tri des articles par identifiant de document.
- **Aucune modification** du schéma Firestore ni des règles `firestore.rules` / `storage.rules` pour la refonte de l'accueil.
- `/admin` conservé en composant client (Firebase Auth + SDK client), exclu de l'indexation.
- Route `/blog/[id]` conservée à l'identique ; `blog.jack0237.com/<id>` réécrit vers `/blog/<id>` par le middleware (comportement actuel de `App.js`).

### 12.3 Pile d'animation recommandée

| Outil | Rôle | Licence | Chargement |
|---|---|---|---|
| **GSAP** (+ ScrollTrigger, SplitText, DrawSVG) et `@gsap/react` | Épinglage, scrub, tracé du fil, bandes, révélations | Licence standard GSAP, gratuite y compris pour un usage commercial et pour tous les plugins depuis avril 2025 (rachat par Webflow). Licence propriétaire gratuite, pas open source : à consigner | Import dynamique après premier affichage, jamais en mode réduit |
| **Lenis** | Défilement doux, desktop palier riche uniquement | MIT | Optionnel (question ouverte) |
| **Shader WebGL** (OGL ou WebGL brut) | Brume du hero | OGL : licence libre à vérifier et consigner | Palier riche uniquement, en différé |
| ~~Three.js / React Three Fiber~~ | Non retenu : aucune scène 3D prévue, poids trop élevé pour un fond de brume | | |
| ~~Motion (ex Framer Motion)~~ | Non retenu : doublon avec GSAP ; une seule bibliothèque d'animation | | |

Suppressions de dépendances rendues possibles par la refonte (à faire par `frontend-developer`) : `react-tsparticles`, `typewriter-effect`, `react-parallax-tilt`, `react-bootstrap` / `bootstrap` (remplacés par les tokens et une grille CSS maison), `react-github-calendar` sur l'accueil (déplacé vers CV).

---

## 13. Suivi de la refonte

| Page | Statut | Date | Notes |
|---|---|---|---|
| Socle global (tokens, typo, grille, navbar, footer, motion, performance) | Direction validée | 2026-09-25 | Décisions utilisateur consignées en section 14 |
| Accueil | Implémentée, en attente de validation utilisateur et QA | 2026-09-25 | Six scènes codées FR + EN (Next.js). Portrait retiré du hero sur décision utilisateur : emplacement `HeroVisual` vide en attente d'un visuel (3D probable) de l'équipe design. Navbar hors repos : 92 % + flou (écart à 5.1, lisibilité). Captures dans `docs/screenshots/` |
| Projets | Ancienne page portée telle quelle (Next.js), refonte à venir | 2026-09-25 | Après validation de l'Accueil |
| CV + Certifications | Anciennes pages portées sur `/resume` (Certifications en `#certifications`), refonte à venir | 2026-09-25 | Recevra la bio longue et le calendrier GitHub |
| Blog / Article | Anciennes pages portées, rendu serveur Firestore (ISR, 404 réelles, BlogPosting), refonte à venir | 2026-09-25 | |
| Contact / services | À venir | | Dépend du moyen de contact `[À COMPLÉTER]` |
| Admin | Portée telle quelle (client, noindex) | 2026-09-25 | Socle appliqué a minima, pas de mise en scène |

---

## 14. Questions ouvertes pour l'utilisateur

### Décisions prises le 2026-09-25
- **Q1 Stack** : **Next.js (App Router) validé** (migration sur une branche dédiée, Firebase et workflow n8n conservés).
- **Q2 Accent braise** : **conservé**, sur recommandation de l'équipe, strictement réservé au contact.
- **Q3 Mot géant** : **« NGUEGUIM » validé**.
- **Q4 Portrait** : **version détourée** de `profile.jpg` qui chevauche le mot géant.
- **Q10 Lenis** : **oui**, défilement doux sur desktop.
- **Q11 Interrupteur « Réduire les animations »** dans le footer : **oui**.

### Question ouverte ajoutée le 2026-09-25 : visuel du hero (remplace Q4)
- **Q15 Visuel du hero** : le portrait est **retiré du hero** à la demande de l'utilisateur (photo jugée pas assez bonne), et le fond de brume fixe est jugé trop peu vivant. Trois scènes plein cadre, procédurales, sont proposées dans `docs/ASSETS.md` section 1 bis, avec maquettes desktop et mobile, aperçus animés et coûts : **A « Relief topographique »** (vraie 3D WebGL, desktop capable seulement), **B « Réseau de flux »** (workflows n8n en profondeur, Canvas 2D), **C « Crêtes à l'aube »** (crêtes en plans à contre-jour, la trajectoire relie les étapes de la page ; recommandé). Choix utilisateur attendu. Conséquences une fois tranché : la scène remplace aussi le poster et le shader de brume (sections 7.2 et 10.1) ; la règle « cyan jamais en halo » (1.3) admet une exception limitée à la lumière dans la brume de cette scène ; le wireframe 7.2 perd le portrait (le haut des colonnes 6 à 12 devient la zone de lumière de la scène).
  - **Décision : A, implémenté** (2026-09-25) : WebGL2 brut en maillage (`src/site/home/HeroVisual.tsx`, `hero-relief/`), palier riche seulement, poster ailleurs ; voir MIGRATION.md.

Questions 5 à 9 et 12 à 14 : toujours ouvertes (servent aux contenus, pas à la direction).

1. **Stack technique** : validez-vous la migration vers Next.js (recommandé, section 12), ou préférez-vous Astro, Vite, ou garder CRA pour l'instant ?
2. **Second accent braise `#FF7A3D`** réservé au contact : validé, ou cyan seul ?
3. **Mot géant « NGUEGUIM »** : validé ? (Alternative : « JACK0237 ».)
4. **Portrait** : acceptez-vous une version détourée de `profile.jpg` qui chevauche le mot géant, ou préférez-vous un portrait dans un cadre ?
5. **Métadonnées du hero** : quelle ville et quel fuseau horaire afficher ? Voulez-vous un statut de disponibilité (par exemple « Disponible pour un CDI / des missions freelance ») et sous quelle formulation exacte ?
6. **Moyen de contact** (toujours `[À COMPLÉTER]` dans le brief) : formulaire, e-mail, prise de rendez-vous ?
7. **Relanceo** : URL de production à afficher, écran à capturer, compte de démonstration disponible ? Y a-t-il des résultats réels que vous acceptez de publier (sinon, aucun chiffre) ?
8. **Automatisations à montrer** (2 ou 3) : pipeline manga TikTok, Flux, blog automatique, Ad Studio (anonymisé) ?
9. **Stack affichée** : validez-vous la liste candidate de la scène 04 (React, Firebase, Node.js / Express, PostgreSQL, Supabase, Expo / React Native, Flutter, n8n, API Gemini, Docker, Traefik), à compléter ou retirer ?
10. **Défilement doux (Lenis)** sur desktop : oui ou non ? (Certains le trouvent agréable, d'autres le vivent comme une perte de contrôle.)
11. **Interrupteur « Réduire les animations »** dans le footer : oui ou non ?
12. **Articles du blog** : ils sont aujourd'hui générés en anglais, titres en capitales, ton « cyberpunk ». On les affiche tels quels avec un badge de langue, ou vous souhaitez faire évoluer le workflow n8n (langue, ton) plus tard ?
13. **Favicon / monogramme** : « J », « WN » ou garder le logo actuel ?
14. **CV PDF** : `RN_CV_NGUEGUIM_WILFRIED.pdf` est-il à jour, et faut-il une version anglaise ?

