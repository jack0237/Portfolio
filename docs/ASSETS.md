# ASSETS.md : registre des assets visuels

> Note : `docs/assets-staging/` (fichiers de préparation et candidats) reste en local et n'est pas publié dans le dépôt ; les assets retenus sont dans `public/` et `src/`.


Tenu par `visual-asset-curator`. Chaque asset du site y figure : fichier, emplacement, source, licence vérifiée, dimensions, format, poids, attribution.

Statut : **staging**. Les fichiers sont dans `docs/assets-staging/` en attendant la migration Next.js (ils seront déplacés dans `public/` ou importés par `next/font/local` par `frontend-developer`). Rien n'a été modifié dans `src/` ni `public/`.

Brief source : `docs/DESIGN.md` section 11 (validé le 2026-09-25).

---

## 1. Portrait détouré (brief n° 1) : RETIRÉ DU HERO le 2026-09-25 (voir 1 bis)

> Mise à jour 2026-09-25 : l'utilisateur avait choisi B (désaturé), puis a demandé le retrait de la photo du hero. Les fichiers restent en staging (réutilisables pour la page CV ; l'image OG garde la photo pour l'instant).

| Champ | Valeur |
|---|---|
| Emplacement | Hero, scène 01, chevauche le mot géant « NGUEGUIM » |
| Source | `src/Assets/profile.jpg` (photo fournie par l'utilisateur, 2486 x 3602 px) |
| Licence | Photo personnelle de l'utilisateur, usage sur son propre site |
| Attribution | Non |
| Traitement | Recadrage 4:5 (pleine largeur, bas de l'image), redimensionné en 1600 x 2000 px, détourage **100 % local** avec `rembg` 2.0.85, modèle **BiRefNet-portrait** (environnement Python isolé dans un dossier temporaire, rien d'installé dans le projet). La photo n'a été envoyée à **aucun service en ligne**. |
| Qualité du détourage | Bonne : contour des cheveux courts net, sans halo clair, oreilles et col conservés. Le modèle `isnet-general-use` a aussi été testé : contour plus dentelé à droite du crâne, écarté. |

### Deux traitements à départager (le design demandait deux propositions)

| Candidat | Rendu | Fichiers |
|---|---|---|
| **A. Noir et blanc froid** | Niveaux de gris, contraste +8 %, légère teinte bleutée dans les hautes lumières, s'accorde au blanc glacier et au fond `#07090B` | `portrait/portrait-nb-froid-{480,800,1200}.{avif,webp}` + `portrait-nb-froid-1200.png` |
| **B. Couleur désaturée à 30 %** | Couleur conservée, saturation -30 %, léger décalage froid ; plus chaleureux et plus « humain » | `portrait/portrait-desature-{480,800,1200}.{avif,webp}` + `portrait-desature-1200.png` |

Recommandation du curateur : **A (noir et blanc froid)** pour la cohérence avec la palette glacier et pour que la braise reste la seule couleur chaude à l'écran ; B si l'utilisateur veut un hero plus chaleureux.

### Déclinaisons livrées (identiques pour A et B)

| Fichier | Dimensions | Format | Poids A | Poids B | Usage |
|---|---|---|---|---|---|
| `portrait-*-480.avif` | 480 x 600 | AVIF, alpha | 18 Ko | 18 Ko | Mobile (390 px, affichage ~200 px en x2) |
| `portrait-*-800.avif` | 800 x 1000 | AVIF, alpha | 50 Ko | 49 Ko | Desktop (~320 px affichés en x2) : **dans le budget portrait (≤ 90 Ko desktop, ≤ 60 Ko mobile)** |
| `portrait-*-1200.avif` | 1200 x 1500 | AVIF, alpha | 72 Ko | 69 Ko | Grands écrans x2 (3xl) |
| `portrait-*-{480,800,1200}.webp` | idem | WebP, alpha | 27 / 69 / 113 Ko | 27 / 67 / 109 Ko | Repli navigateurs sans AVIF |
| `portrait-*-1200.png` | 1200 x 1500 | PNG 32 bits | 1,4 Mo | 1,4 Mo | **Master uniquement**, à ne pas servir (WebP couvre tous les navigateurs cibles) |

- `alt` proposé : « Wilfried NGUEGUIM, souriant, en pull noir » / « Wilfried NGUEGUIM smiling, wearing a black sweater ». (Si le H1 adjacent nomme déjà Wilfried, `seo-strategist` peut raccourcir.)
- Notes pour `frontend-developer` :
  - Le bord gauche et le bas de l'image sont coupés net (bras hors cadre sur la photo d'origine). Dans la mise en page, le bas du buste passe derrière le mot géant, ce qui masque la coupe basse ; pour le bord gauche, prévoir un masque CSS en fondu sur le bord gauche et sur le bas (`mask-image` avec deux dégradés, environ 14 % à gauche et 22 % en bas) : c'est ce qui est appliqué dans l'aperçu `apercu-hero.png`, sinon la coupe basse du pull se voit entre les lettres.
  - Le pull noir se fond dans `#07090B` : c'est voulu (la silhouette se lit par le visage), mais ne pas poser le portrait sur `--color-panel` sans vérifier.
  - « Lumière latérale » demandée par le brief : la photo d'origine est éclairée de face, un vrai éclairage latéral n'est pas simulable proprement. Si l'utilisateur fournit une nouvelle photo plus tard, viser une lumière de fenêtre latérale sur fond uni.
- Aperçu : ouvrir `docs/assets-staging/portrait/apercu-hero.png` (portrait A et B posés sur le fond et le mot géant).

---

## 1 bis. Visuel du hero, remplacement du portrait : CHOIX UTILISATEUR ATTENDU

Demande utilisateur du 2026-09-25 : la photo est jugée pas assez bonne et **retirée du hero** (le code laisse un emplacement `HeroVisual` vide). À remplacer par « une image 3D ou plus attrayante ». Deuxième retour le même jour : le **fond** (poster de brume fixe sur noir) manque de vie et d'impact. Les trois candidats ci-dessous traitent donc **visuel et fond comme une seule scène plein cadre, vivante** (profondeur, lumière, mouvement lent continu, parallaxe souris sur desktop), et non un objet posé sur un fond plat.

Tous sont **procéduraux** (générés par du code écrit pour le projet) : aucune licence tierce, aucune attribution, aucun modèle 3D ni texture externe. Aucun ne montre de dégradé violet, de sphère de verre ou de « cerveau IA ».

Dossier : `docs/assets-staging/hero-visual/`. Chaque candidat est une page autonome (`<slug>/index.html`, s'ouvre dans Chrome par double-clic) avec la maquette du hero par-dessus (`_shared/hero-ui.css` et `hero-ui.js` reprennent les tokens et la grille de `src/app/tokens.css` et `home.css`, avec les polices du staging). Paramètres d'URL : `?ui=0` visuel seul, `?t=6` image figée, `?mx=0.5&my=-0.3` parallaxe simulée.

### Les trois candidats

| | A. « Relief topographique » `relief` | B. « Réseau de flux » `reseau` | C. « Crêtes à l'aube » `cretes` |
|---|---|---|---|
| Idée | Un massif de haute montagne la nuit, en vraie 3D. Ses courbes de niveau sont tracées en cyan atténué ; le **fil cyan suit une vallée** jusqu'à l'horizon, où une aube froide éclaire la brume. Une impulsion de lumière parcourt la trajectoire ; la caméra avance très lentement (l'expédition). | Des workflows façon n8n (nœuds carrés, déclencheurs à bord arrondi, liens en courbes horizontales, libellés mono : Webhook, Code, Gemini, IF, Postgres, Telegram...) suspendus **en profondeur dans une brume éclairée**. Des impulsions de données circulent ; la sortie du flux principal descend **rejoindre le fil cyan sous le mot géant**. | Un paysage de crêtes en 7 plans (2,5D), à **contre-jour d'une aube froide**, brume qui dérive entre les plans. Une trajectoire en pointillés cyan saute de crête en crête jusqu'au sommet ; ses **jalons sont les étapes de la page** (02 Projets, 03 Services, 04 Stack, 05 Blog, 06 Contact). La lumière remonte la trajectoire. |
| Ce qu'il dit de Wilfried | L'expédition et la précision (carte, relief), la trajectoire comme fil conducteur | Le métier, littéralement : il relie des systèmes (automatisation n8n et IA) | L'expédition cinématique de White Desert ; le site lui-même devient l'itinéraire |
| Mouvement | Avancée lente sur le terrain, impulsion le long du fil, brume qui dérive, parallaxe souris | Impulsions sur les liens, léger flottement des nœuds, rotation lente de la caméra, 2 couches de brume, parallaxe souris | Brume qui dérive, dérive lente des plans, aube qui respire, tête lumineuse qui remonte la trajectoire, parallaxe par plan |
| Risque | Le plus abstrait (ne dit pas « développeur » à lui seul) ; le plus coûteux en GPU | Proche du cliché « réseau lumineux » si mal dosé (atténué ici par des nœuds n8n explicites et nommés) ; plus chargé visuellement | Le moins « 3D » au sens strict (profondeur par plans, pas de volume) |

### Aperçus (à ouvrir pour juger)

| Candidat | Hero desktop 1440 x 900 | Hero mobile 390 x 844 | Mouvement (WebP animé 960 x 600, 4 s, accéléré) | Visuel seul |
|---|---|---|---|---|
| A. Relief | `apercu-relief-desktop.png` | `apercu-relief-mobile.png` | `apercu-relief-mouvement.webp` (x2,5) | `relief/rendu-visuel-1440.png`, `relief/images-cles.png` |
| B. Réseau | `apercu-reseau-desktop.png` | `apercu-reseau-mobile.png` | `apercu-reseau-mouvement.webp` (x2) | `reseau/rendu-visuel-1440.png`, `reseau/images-cles.png` |
| C. Crêtes | `apercu-cretes-desktop.png` | `apercu-cretes-mobile.png` | `apercu-cretes-mouvement.webp` (x5) | `cretes/rendu-visuel-1440.png`, `cretes/images-cles.png` |

Le WebP animé est accéléré pour qu'on perçoive le mouvement en 4 secondes ; sur le site, le mouvement est 2 à 5 fois plus lent (volontairement presque imperceptible). Pour la vitesse réelle et la parallaxe, ouvrir `<slug>/index.html` dans Chrome et bouger la souris.

### Lisibilité (contraste mesuré)

Un **voile de lisibilité** fait partie du visuel : dégradés `#07090B` en bas (sous le mot géant), à gauche (sous la phrase de valeur et les CTA) et en haut (sous la navbar) ; sur mobile, le bas de l'écran est presque opaque. La scène garde toute sa lumière dans la zone libérée par le portrait (colonnes 6 à 12, entre la navbar et le mot géant).

Mesure sur les maquettes (fond seul, texte masqué, luminance du 98e centile de chaque zone de texte, formule WCAG 2.x), ratio par zone :

| Zone (couleur) | A desktop / mobile | B desktop / mobile | C desktop / mobile | Seuil AA |
|---|---|---|---|---|
| NGUEGUIM (`text`) | 14,1 / 15,5 | 14,0 / 16,1 | 17,2 / 18,1 | 3 (grand texte) |
| Wilfried (`text`) | 12,0 / 12,4 | 11,7 / 14,5 | 16,2 / 17,6 | 3 |
| Titre (`text`) | 14,0 / 17,5 | 11,8 / 18,1 | 15,9 / 18,2 | 3 |
| Phrase de valeur (`text-2`) | 7,5 / 8,7 | **5,8** / 9,0 | 8,0 / 9,0 | 4,5 |
| Métadonnées (`text-3`) | 5,4 / 5,4 | 5,5 / 5,1 | 5,5 / 5,4 | 4,5 |

Tout passe AA ; B est le plus serré sur la phrase de valeur (des nœuds lointains passent derrière), à surveiller si la scène se décale vers la gauche. Les CTA sont un aplat cyan ou un contour posé sur le voile : inchangés.

### Implémentation et coût

| | A. Relief | B. Réseau | C. Crêtes |
|---|---|---|---|
| Technique de l'aperçu | Shader de fragment WebGL2 plein écran (raymarching d'un champ de hauteur), WebGL brut, aucune bibliothèque | Canvas 2D, projection perspective faite à la main, aucune bibliothèque | Canvas 2D (7 silhouettes + brume) |
| Technique conseillée en production | **Maillage déplacé** (grille 256 x 256 + carte de hauteur précalculée) en WebGL brut ou OGL : le raymarching de l'aperçu est trop lent pour du temps réel sur un portable moyen | Tel quel (Canvas 2D), textures de brume livrées en 2 petits WebP au lieu d'être générées au chargement | 7 calques SVG (ou canvas mis en cache) déplacés en CSS `transform`, tête lumineuse en SVG `stroke-dashoffset` : presque zéro JS |
| Poids du code (gzip, estimé) | ~3 Ko (shader + JS) ; version maillage ~12 à 15 Ko avec OGL + carte de hauteur ~40 Ko | ~3 Ko | ~3 Ko (canvas) ; ~15 à 25 Ko de SVG en version calques |
| Coût mesuré par image (Intel Iris Xe, 1440 x 900) | **52 ms** à 75 % de résolution, 19 ms à 50 % : trop lourd en l'état (moins de 60 i/s) ; version maillage estimée à 1 à 3 ms | **1 ms** | **3,4 ms** (moins de 1 ms en calques mis en cache) |
| Poster de repli (généré, fourni) | `relief/poster-desktop.avif` 28 Ko (1920 x 1080) ; `poster-mobile.avif` 14 Ko (780 x 1688) ; WebP 27 / 15 Ko | `reseau/poster-*.avif` 15 / 13 Ko ; WebP 19 / 17 Ko | `cretes/poster-*.avif` 13 / 7 Ko ; WebP 14 / 9 Ko |
| Impact LCP | Aucun si le mot géant reste l'élément LCP (texte) et que la scène démarre après le premier affichage ; le poster s'affiche d'emblée | idem | idem |
| Palier riche (desktop capable) | Scène temps réel | Scène temps réel | Scène temps réel |
| Palier standard (mobile, desktop modeste) | **Poster fixe** (le GPU mobile ne tient pas le relief) | Scène temps réel possible (1 ms) ou poster | Scène temps réel possible (calques CSS) ou poster |
| Palier réduit / `prefers-reduced-motion` | Poster fixe, **aucun JS de scène téléchargé** (import dynamique conditionnel, DESIGN 6.4) | Poster fixe, aucun JS | Poster fixe, aucun JS ; la trajectoire y est dessinée en entier (comme le fil statique de 6.4) |
| Garde-fous communs | Pause hors écran (`IntersectionObserver`) et onglet masqué ; arrêt si moins de 45 i/s pendant 2 s (DESIGN 10.4) ; parallaxe seulement avec un pointeur fin | idem | idem |

Par rapport au plan actuel : A **remplace** le shader de brume prévu (même emplacement, coût supérieur) ; B et C le rendent inutile (leur brume est dans la scène) et **allègent** le palier riche. Les trois suppriment le portrait (18 à 72 Ko) : le poids au-dessus de la ligne de flottaison baisse.

### Recommandation du curateur (l'utilisateur tranche)

**C. « Crêtes à l'aube »**, pour trois raisons : c'est le plus proche de la référence White Desert que l'utilisateur aime (contre-jour, trajectoire de vol, microtypo mono), il donne un sens au visuel (les jalons de la trajectoire sont les étapes réelles de la page, que le fil cyan parcourt ensuite), et c'est le seul qui reste vivant **partout**, mobile compris, pour un coût quasi nul et le meilleur contraste.
- Si l'utilisateur veut une **vraie 3D** spectaculaire : **A**, en acceptant qu'elle soit réservée au desktop capable (poster ailleurs) et réécrite en maillage déplacé pour tenir 60 i/s.
- Si l'utilisateur veut que le hero **montre le métier** au premier coup d'oeil : **B**.
- Combinaison possible après choix : les jalons mono de C posés sur le relief de A.

### Notes pour `frontend-developer` (après choix)

- La scène occupe tout le hero (`position: absolute; inset: 0; z-index: -1` sous `.hero__inner`), remplace `.hero__mist` et remplit le slot `HeroVisual` ; le voile de lisibilité est un pseudo-élément CSS, pas une image. `aria-hidden="true"` sur le canvas, pas d'`alt` (décoratif).
- Les libellés dans la scène (jalons de C, nœuds de B) sont **décoratifs** et dessinés dans le canvas : ils ne remplacent pas la navigation. En EN, traduire les jalons de C (`02 PROJECTS`...) ; les noms de nœuds de B sont des noms de produits, identiques en FR et EN.
- Aucun libellé de B ne cite un client ni une URL interne (règle de confidentialité client respectée).
- Règle de DESIGN 1.3 « cyan jamais en halo » : les trois scènes utilisent de la **lumière cyan dans la brume** (halo sur la tête de la trajectoire, lueur du flux), à la demande explicite de l'utilisateur. L'exception est limitée à la scène du hero ; l'interface (boutons, cartes) reste sans halo.
- Le code des aperçus (`<slug>/index.html`) est un prototype de direction artistique, pas du code de production : à réécrire proprement dans le composant choisi.

---

## 2. Polices auto-hébergées (socle, section 3)

Toutes sous **SIL Open Font License 1.1**, licence vérifiée le 2026-09-25 dans les dépôts officiels (fichiers `OFL.txt` copiés à côté de chaque police). Usage web et commercial libre, aucune attribution visible requise (la licence doit accompagner les fichiers si on les redistribue).

Fichiers de base : paquets Fontsource 5.3.0 (`@fontsource-variable/mona-sans`, `@fontsource-variable/newsreader`, `@fontsource/jetbrains-mono`), qui redistribuent les fichiers de Google Fonts. Téléchargés depuis jsDelivr pour le staging uniquement, **aucun paquet ajouté au projet** (`package.json` inchangé).

| Police | Fichier | Contenu | Poids | Précharger | Source / licence |
|---|---|---|---|---|---|
| Mona Sans (romain) | `fonts/mona-sans/mona-sans-var-latin.woff2` | Variable `wdth` 75 à 125, `wght` 200 à 900, sous-ensemble latin (fichier Google Fonts **non modifié**) | 98 Ko | **Oui** (LCP = mot géant) | github.com/github/mona-sans, OFL 1.1, nom réservé « Mona Sans » |
| Mona Sans (romain) | `fonts/mona-sans/mona-sans-var-latin-ext.woff2` | idem, latin-ext | 33 Ko | Non (chargé par `unicode-range` seulement si besoin) | idem |
| Newsreader Italic | `fonts/newsreader/newsreader-italic-var-fr.woff2` | Variable `wght` 200 à 800, sous-ensemble français (voir plage ci-dessous) | 62 Ko | Non | github.com/productiontype/Newsreader, OFL 1.1, pas de nom réservé |
| Newsreader Italic | `fonts/newsreader/newsreader-italic-var-latin-ext.woff2` | Variable `wght`, latin-ext (non modifié) | 40 Ko | Non | idem |
| Newsreader Italic (option) | `fonts/newsreader/newsreader-italic-opsz-var-fr.woff2` | Variable `wght` + **`opsz` 6 à 72**, sous-ensemble français | 143 Ko | Non | idem |
| JetBrains Mono 400 | `fonts/jetbrains-mono/jetbrains-mono-400-fr.woff2` | Statique 400, sous-ensemble français + flèches ↑ ↓ | 19 Ko | Non | github.com/JetBrains/JetBrainsMono, OFL 1.1, pas de nom réservé |
| JetBrains Mono 400 | `fonts/jetbrains-mono/jetbrains-mono-400-latin-ext.woff2` | latin-ext (non modifié) | 7 Ko | Non | idem |

**Budget (section 10.2 : 3 fichiers latin ≤ 180 Ko)** : 98 + 62 + 19 = **179 Ko**. Respecté avec la Newsreader sans axe `opsz`.

Arbitrage à connaître (pas bloquant) : l'axe de taille optique de Newsreader (prévu en 3.1) coûte 81 Ko de plus (143 Ko au lieu de 62). Le fichier `-opsz-` est livré en option ; avec lui le total passe à 260 Ko. Recommandation : garder la version sans `opsz` (la Newsreader à graisse 350 reste fine et élégante en grand) ; `design-director` tranche.

Détails techniques :
- Plage du sous-ensemble français (Newsreader et JetBrains Mono) : `U+0020-007E, U+00A0-00FF, U+0152-0153, U+0178, U+2009, U+2013-2014, U+2018-201A, U+201C-201E, U+2022, U+2026, U+2039-203A, U+202F, U+20AC, U+2122, U+2190-2193` (couvre accents, œ, guillemets « », espaces fines insécables, €). Sous-ensembles faits avec `fontTools` 4.x, toutes les fonctionnalités OpenType conservées.
- **Mona Sans n'a pas été sous-ensemblée** : la licence réserve le nom « Mona Sans » et interdit de l'utiliser pour une version modifiée ; on sert donc le fichier tel que distribué par Google Fonts.
- Mona Sans (sous-ensemble latin) **ne contient pas les flèches → et ↗** (seulement ↑ ↓). Les flèches des boutons et liens doivent être des icônes SVG (Lucide, section 7), pas des caractères.
- Exemple `next/font/local` (à adapter par `frontend-developer`) :
  ```js
  const mona = localFont({ src: './fonts/mona-sans-var-latin.woff2', weight: '200 900', style: 'normal', variable: '--font-mona', display: 'swap', preload: true, declarations: [{ prop: 'font-stretch', value: '75% 125%' }] });
  const newsreader = localFont({ src: './fonts/newsreader-italic-var-fr.woff2', weight: '200 800', style: 'italic', variable: '--font-voice', display: 'swap', preload: false });
  const mono = localFont({ src: './fonts/jetbrains-mono-400-fr.woff2', weight: '400', variable: '--font-mono', display: 'swap', preload: false });
  ```
  Pour le mot géant : `font-stretch: 75%; font-weight: 900;` (ou `font-variation-settings: 'wdth' 75, 'wght' 900`).

---

## 3. Fond du hero : poster de brume (brief n° 2) : CHOIX UTILISATEUR ATTENDU

| Champ | Valeur |
|---|---|
| Emplacement | Fond du hero pour les paliers standard et réduit, et avant le chargement du shader WebGL |
| Source | **Généré** localement (bruit spectral 1/f déformé, script Python/NumPy), aucune licence tierce |
| Licence | Création originale pour le projet |
| Attribution | Non |
| `alt` | Aucun : image de fond CSS, décorative |

| Candidat | Rendu | Desktop 2560 x 1440 (AVIF / WebP) | Mobile 1080 x 1920 (AVIF / WebP) |
|---|---|---|---|
| **A. Brume basse** `hero/mist-poster-basse-*` | Nappes horizontales qui traînent dans le tiers bas, derrière le mot géant, comme une brume au ras d'un glacier | 43 Ko / 12 Ko | 23 Ko / 6 Ko |
| **B. Brume diffuse** `hero/mist-poster-diffuse-*` | Volutes plus libres, concentrées à droite derrière le portrait | 40 Ko / 10 Ko | 21 Ko / 5 Ko |

- Budgets respectés (≤ 120 Ko desktop, ≤ 80 Ko mobile). Palette : `#07090B` vers `#0F1720`, quelques zones à peine plus claires (`#22303E` au plus), vignettage, grain fin. Très sombre à dessein : elle se devine plus qu'elle ne se voit.
- Recommandation : **A** (elle dialogue avec le mot géant posé en bas et avec la dissolution « dans la brume » au scroll).
- Quand le shader WebGL existera, remplacer ce poster par une image figée du shader pour que le passage poster vers shader soit invisible.
- Aperçu de mise en scène : `portrait/apercu-hero.png` (haut : portrait A sur brume B ; bas : portrait B sur brume A).

## 4. Texture de bruit pour la dissolution du mot géant (brief n° 3)

| Fichier | Dimensions | Format | Poids | Notes |
|---|---|---|---|---|
| `hero/noise-dissolve-tile-1024.webp` | 1024 x 1024 | WebP niveaux de gris, qualité 90 | 32 Ko | **Recommandé** pour `mask-image` (WebP supporté par tous les navigateurs cibles), 256 niveaux |
| `hero/noise-dissolve-tile-1024.png` | 1024 x 1024 | PNG 8 bits niveaux de gris, 16 niveaux | 51 Ko | Conforme au brief (PNG ≤ 60 Ko) ; la réduction à 16 niveaux était nécessaire pour tenir le budget, d'où des paliers visibles si le masque est très étiré |

- Source : **générée** (bruit fBm spectral, histogramme égalisé pour un seuillage progressif régulier), aucune licence tierce. Tuile **raccordable** vérifiée en 2 x 2 (aucune couture).

## 5. Captures Relanceo (brief n° 4) : EN ATTENTE

Bloqué par la question ouverte Q7 de `DESIGN.md` (URL de production, écran à capturer, compte de démonstration avec données fictives, accord sur l'écran montré). Rien n'a été capturé. À produire ensuite : desktop 16:10 2880 x 1800, recadrage mobile 4:3 1200 x 900, OG 1200 x 630, en AVIF/WebP.

## 6. Schémas de flux n8n (brief n° 5) : EN ATTENTE

Bloqué par Q8 (choix des 2 ou 3 automatisations montrées). Une fois le choix fait : relecture des exports JSON dans le vault, anonymisation (aucun identifiant, URL interne, secret ni nom de client, en particulier aucune mention du client d'Ad Studio), puis SVG inline 480 x 320 ≤ 8 Ko.

## 7. Logos de stack (brief n° 6) : SOUS RÉSERVE DE VALIDATION DE LA LISTE (Q9)

Préparés pour la liste candidate de `DESIGN.md` 7.8, à retirer ou compléter selon la réponse de l'utilisateur.

| Fichier | Outil | Poids |
|---|---|---|
| `stack-logos/logo-react.svg` | React (sert aussi pour React Native) | 2,9 Ko |
| `stack-logos/logo-firebase.svg` | Firebase | 1,9 Ko |
| `stack-logos/logo-nodejs.svg` | Node.js | 1,6 Ko |
| `stack-logos/logo-express.svg` | Express | 1,0 Ko |
| `stack-logos/logo-postgresql.svg` | PostgreSQL | 5,1 Ko |
| `stack-logos/logo-supabase.svg` | Supabase | 0,3 Ko |
| `stack-logos/logo-expo.svg` | Expo | 0,5 Ko |
| `stack-logos/logo-flutter.svg` | Flutter | 0,2 Ko |
| `stack-logos/logo-n8n.svg` | n8n | 1,6 Ko |
| `stack-logos/logo-gemini.svg` | Google Gemini | 0,4 Ko |
| `stack-logos/logo-docker.svg` | Docker | 1,7 Ko |
| `stack-logos/logo-traefik.svg` | Traefik Proxy | 1,2 Ko |

- Source : **Simple Icons 16.32.0** (simpleicons.org, via jsDelivr). Licence des tracés : **CC0 1.0** (fichier `stack-logos/LICENSE-simple-icons.md`). Les marques restent la propriété de leurs détenteurs : usage **nominatif** uniquement (dire « j'utilise cet outil »), monochrome, forme non modifiée, sans suggérer de partenariat. Pas d'attribution visible requise.
- Traitement : `fill="currentColor"` ajouté (couleur pilotée par CSS : `text-2` au repos, `text` au survol), passés par SVGO. viewBox 24 x 24, affichés à 28 px.
- Chaque logo porte le nom de l'outil en `aria-label` / `title` (le `<title>` Simple Icons est conservé dans le fichier).

## 8. Icônes d'interface et réseaux sociaux (brief n° 7)

| Fichier | Usage | Source / licence |
|---|---|---|
| `icons/icon-arrow-right.svg` | CTA « Voir mes projets », « Tous les projets » | Lucide 1.48.0, ISC |
| `icons/icon-arrow-up-right.svg` | Liens externes | idem |
| `icons/icon-arrow-down.svg` | « Télécharger mon CV » (ou `icon-download.svg`) | idem |
| `icons/icon-arrow-up.svg` | « Haut » du footer | idem |
| `icons/icon-arrow-left.svg` | Carrousel des automatisations | idem |
| `icons/icon-menu.svg`, `icons/icon-x.svg` | Ouvrir / fermer le menu mobile | idem |
| `icons/icon-download.svg` | Variante téléchargement du CV | idem |
| `icons/icon-mail.svg` | Contact, si l'e-mail est retenu (Q6) | idem |
| `icons/social/social-github.svg` | GitHub | Simple Icons, CC0 (marque GitHub, usage nominatif) |
| `icons/social/social-x.svg` | X | Simple Icons, CC0 (marque X, usage nominatif) |

- Lucide : licence **ISC** (fichier `icons/LICENSE-lucide.txt`), modification autorisée. Trait passé de 2 à **1,5 px** et extrémités **carrées** (`stroke-linecap="square"`, `stroke-linejoin="miter"`) pour les « angles nets » du brief. `stroke="currentColor"`.
- **LinkedIn : pas d'icône libre disponible.** Simple Icons a retiré ce logo à la demande de LinkedIn, et Lucide 1.x n'a plus d'icônes de marques. Le design prévoit déjà des **libellés texte** (« GitHub ↗ LinkedIn ↗ X ↗ ») : recommandation de s'en tenir au texte pour les trois réseaux. Les SVG GitHub et X sont fournis au cas où.
- Les flèches doivent être ces SVG et non des caractères : Mona Sans ne contient ni → ni ↗ (section 2).

## 9. Visuels de repli des articles (brief n° 8)

Remplacent `blog-img-1/2/3.jpg` quand `image` vaut `blogImg1` ou est vide. Trois variantes à faire tourner (par exemple selon l'identifiant de l'article modulo 3), pas un choix exclusif.

| Fichier | Dimensions | Format | Poids | Motif |
|---|---|---|---|---|
| `blog-fallback/blog-fallback-grille.{avif,webp}` | 1600 x 900 | AVIF / WebP | 5 Ko / 5 Ko | Grille fine, croix de repère aux intersections, un point cyan |
| `blog-fallback/blog-fallback-fil.{avif,webp}` | 1600 x 900 | AVIF / WebP | 8 Ko / 10 Ko | Fragment du fil cyan avec sa tête et une branche `cyan-dim` |
| `blog-fallback/blog-fallback-brume.{avif,webp}` | 1600 x 900 | AVIF / WebP | 28 Ko / 11 Ko | Brume + fil cyan horizontal qui s'arrête sur un point, croix sur la grille |
| `blog-fallback/blog-fallback-{grille,fil,brume}-og.jpg` | 1200 x 630 | JPEG q85 | 37 / 37 / 57 Ko | Versions de partage social |

- Source : **création** (dessin Python/Pillow aux tokens de `DESIGN.md`), aucune licence tierce, aucune typographie incrustée.
- `alt=""` (décoratif : le titre de l'article est en HTML à côté).

## 10. Image OG de l'accueil (brief n° 9)

| Fichier | Dimensions | Format | Poids | Texte |
|---|---|---|---|---|
| `og/og-home-fr.png` | 1200 x 630 | PNG | 62 Ko | « Wilfried » (Newsreader italique), « NGUEGUIM » (Mona Sans largeur 75, graisse 900), « Dev full-stack & automatisation IA », « PORTFOLIO » et « JACK0237.COM » en JetBrains Mono, fil cyan et croix de repère |
| `og/og-home-en.png` | 1200 x 630 | PNG | 64 Ko | Idem avec « Full-stack developer & AI automation » |

- Source : **création**, polices OFL (section 2). Aucun tiret cadratin.
- Le titre anglais est une **proposition** à valider par `content-writer` (la version FR reprend le titre du brief). Régénérable en une commande si le libellé change.
- `og:image:alt` proposé : « Wilfried NGUEGUIM, dev full-stack et automatisation IA » / « Wilfried NGUEGUIM, full-stack developer and AI automation ».

## 11. Favicon et icône d'app (brief n° 10) : CHOIX UTILISATEUR ATTENDU (Q13)

| Candidat | Fichiers | Lisibilité à 32 px |
|---|---|---|
| **A. « J. »** | `favicon/favicon-j.svg` (0,3 Ko), `favicon-j.ico` (16/32/48), `favicon-j-{32,180,192,512}.png` | Très bonne |
| **B. « WN. »** | `favicon/favicon-wn.svg` (0,5 Ko), `favicon-wn.ico`, `favicon-wn-{32,180,192,512}.png` | Correcte, plus serrée |

- Monogramme en Mona Sans largeur 75, graisse 900, **vectorisé** (tracés, aucune police requise), blanc glacier sur `#07090B`, point cyan posé sur la ligne de base (écho à la tête du fil).
- Source : **création** ; l'OFL autorise l'usage des glyphes dans un logo.
- Recommandation : **A « J. »** (plus lisible en onglet, et « J » renvoie à Jack0237, la marque). Remplace `logo.png`, `logo.svg`, `icon.ico` lors de l'implémentation. 180 px = `apple-touch-icon`, 192 et 512 px = manifest.

---

## 12. Récapitulatif

| Emplacement | Fichier(s) | Source | Licence | Poids servi |
|---|---|---|---|---|
| Hero, portrait (retiré du hero) | `portrait/portrait-{nb-froid,desature}-*` | Photo utilisateur, détourage local | Personnelle | 18 à 72 Ko (AVIF) |
| Hero, scène plein cadre (3 candidats) | `hero-visual/{relief,reseau,cretes}/poster-*` + scène en code | Généré (procédural) | Création | 7 à 28 Ko (AVIF) + ~3 Ko de code gzip |
| Hero, fond | `hero/mist-poster-{basse,diffuse}-*` | Généré | Création | 21 à 43 Ko (AVIF) |
| Hero, dissolution | `hero/noise-dissolve-tile-1024.*` | Généré | Création | 32 Ko (WebP) |
| Polices | `fonts/**` | Mona Sans, Newsreader, JetBrains Mono | OFL 1.1 | 179 Ko (3 fichiers latin) |
| Scène 04 | `stack-logos/logo-*.svg` | Simple Icons | CC0 + usage nominatif des marques | 0,2 à 5 Ko |
| UI, social | `icons/**` | Lucide, Simple Icons | ISC, CC0 | < 1 Ko |
| Scène 05 | `blog-fallback/*` | Création | Création | 5 à 28 Ko (AVIF) |
| Partage | `og/og-home-{fr,en}.png` | Création | Création | 62 à 64 Ko |
| Onglet, manifest | `favicon/*` | Création | Création | < 20 Ko |

Aucune attribution visible n'est requise sur le site pour ces assets.

### En attente de l'utilisateur
- **Choix du visuel du hero** (section 1 bis) : A « Relief topographique », B « Réseau de flux » ou C « Crêtes à l'aube » (recommandé).
- **Choix** : traitement du portrait (A noir et blanc froid / B désaturé), poster de brume (A basse / B diffuse), favicon (A « J. » / B « WN. »).
- **Q7** Relanceo : URL, écran, compte de démonstration, puis captures.
- **Q8** Automatisations à montrer, puis schémas SVG.
- **Q9** Liste de la stack (les logos candidats sont prêts).
- Titre anglais de l'OG à valider par `content-writer`.

### À retirer lors de l'implémentation (section 11 de DESIGN.md)
`home-main.svg`, `home-bg.jpg`, `pre.svg`, `avatar.svg`, `about.png` si non réutilisé, `blog-img-1/2/3.jpg` (remplacés par la section 9), `logo.png`, `logo.svg`, `icon.ico` (remplacés par la section 11), `Soumyajit_Behera-BIT_MESRA.pdf`.
