# Moodboard : choix d'ambiance du portfolio

> Note : les captures de `docs/references/` (sites de tiers) restent en local et ne sont pas publiées dans le dépôt.


Document de travail du `design-director`. Rédigé le 2026-09-25. Objectif : aider l'utilisateur à choisir une ambiance **avant** toute conception (voir `docs/BRIEF.md`). Aucune décision de design n'est prise ici : `docs/DESIGN.md` sera écrit seulement après le choix.

---

## 1. Analyse des deux sites aimés

### 1.1 moneyincheck.org (site d'un roman sur l'argent)

| Desktop | Page complète | Mobile |
|---|---|---|
| ![](references/aime-moneyincheck-desktop.png) | ![](references/aime-moneyincheck-fullpage.png) | ![](references/aime-moneyincheck-mobile.png) |

Ce qui plaît très probablement :

- **Une typographie qui fait l'image.** Le hero, c'est le titre « MONEY IN CHECK » en serif Didone géante, pleine largeur, sur deux lignes. Un seul objet visuel (le cavalier d'échecs enroulé dans un billet) vient **traverser** les lettres, ce qui crée de la profondeur sans décor.
- **Une grille visible.** De fines lignes de grille verticales et horizontales structurent le fond, façon papier millimétré ou plan d'architecte. Ça donne une sensation de rigueur et de « construit ».
- **Une palette très retenue.** Gris papier clair, noir, un seul accent vert émeraude. L'accent n'apparaît que sur le titre, le sélecteur de langue et le bouton d'achat : il signale ce qui compte.
- **Un paragraphe manifeste en très grand corps**, gris clair, entrecoupé de petites illustrations inline dans le texte (pictos dessinés glissés entre les mots). La lecture devient un moment en soi.
- **Des détails éditoriaux** : petite barre d'info datée (lieu, date, heure), boussole N/S sur le côté, signature manuscrite, « scroll » dessiné à la main. Ça humanise et donne l'impression d'un objet fait main.
- **Un sélecteur de langue soigné** en pastille, intégré à la nav (le brief demande FR/EN : bonne référence).
- **Un rythme de page lent et aéré** : une idée par écran, beaucoup de vide.

### 1.2 white-desert.com (voyages de luxe en Antarctique)

| Hero | Parcours complet | Camps | Carte |
|---|---|---|---|
| ![](references/aime-whitedesert-desktop.png) | ![](references/aime-whitedesert-parcours-desktop.png) | ![](references/aime-whitedesert-section-camps.png) | ![](references/aime-whitedesert-section-carte.png) |

Captures mobiles : [hero mobile](references/aime-whitedesert-mobile.png), [parcours mobile](references/aime-whitedesert-parcours-mobile.png).

Ce qui plaît très probablement :

- **Le mot géant comme hero.** « ANTARCTICA » en grotesque condensée, blanche, pleine largeur, posée en bas de l'écran. Accroche courte en italique serif à gauche, « Watch Film » à droite. Contraste fort entre le très grand et le très petit.
- **Une narration par le scroll.** La page se lit comme un film : le titre se dissout dans la brume, puis les sections s'enchaînent (le continent, les voyages, les camps, le vol, la carte). Chaque section est une scène plein écran.
- **Des transitions spectaculaires mais maîtrisées** : bandes verticales qui révèlent l'image suivante, cartes de camps qui glissent en carrousel horizontal sur une texture de glace, gros titre des codes aéroport (Le Cap vers Wolf's Fang) qui apparaît dans la neige.
- **Une section data-visualisation sombre** : carte 3D de l'Antarctique sur fond presque noir, trajectoire de vol en **ligne cyan**, panneau de chiffres clés (temps de vol, distance, température) en grande typo. C'est la partie la plus proche d'un univers « tech ».
- **Le mélange serif italique + grotesque** : l'italique pour la voix humaine (citations, légendes), la grotesque pour l'information.
- **Un accent unique et fonctionnel** : l'onglet orange vertical « How it works » collé au bord droit, toujours visible. Un seul élément coloré qui guide l'action.
- **Des coordonnées GPS en petite typo** sous les images : le détail technique précis qui crédibilise.

### 1.3 Points communs (ce que l'utilisateur aime vraiment)

1. **La typographie comme élément principal**, en très grand corps, pleine largeur. Pas d'illustration décorative autour.
2. **Une grille apparente** (lignes fines) qui donne une impression de rigueur.
3. **Un accent de couleur unique**, rare, qui porte l'action.
4. **Un contraste d'échelle extrême** entre titres géants et microtypographie (légendes, coordonnées, métadonnées).
5. **Des détails qui montrent le soin** : métadonnées datées, signatures, coordonnées, sélecteur de langue soigné.
6. **Une page qui se raconte au scroll**, une idée par écran, avec du vide.
7. **Aucun des deux n'a l'air d'un template** : pas de cartes arrondies à ombre douce, pas de dégradés violets, pas de particules.

### 1.4 Transposition à un portfolio dev sombre, tech, accent cyan

| Dans les sites aimés | Transposé chez Jack0237 |
|---|---|
| Titre-objet géant (MONEY IN CHECK, ANTARCTICA) | Nom « NGUEGUIM » ou « JACK0237 » en très grand, pleine largeur, avec la photo qui traverse ou chevauche les lettres |
| Grille millimétrée visible | Grille fine sur fond sombre, comme un plan technique ou un éditeur de code ; elle peut servir de repère aux sections |
| Accent vert unique / onglet orange | Cyan `#00f0ff` (déjà l'identité actuelle) réservé aux actions, liens et lignes de données, jamais en aplat décoratif |
| Coordonnées GPS, date, lieu | Métadonnées dev : version du site, dernier commit, stack, fuseau horaire, statut « disponible » |
| Carte avec trajectoire cyan et chiffres | Section Projets façon « schéma de flux » : un pipeline n8n dessiné en lignes cyan, avec de vraies données de projet (sans chiffres inventés) |
| Paragraphe manifeste avec pictos inline | Phrase de valeur en grand corps avec des logos d'outils glissés entre les mots (n8n, React, Firebase) |
| Narration scène par scène | Accueil en 6 scènes (structure du brief), transitions de révélation sobres |
| Serif italique pour la voix humaine | Une serif ou une mono italique pour les citations, légendes et la signature Jack0237 |

Point d'attention : les deux sites sont **clairs** (papier, neige). Le brief impose de rester sombre. On garde donc leur **structure** (typo, grille, accent unique, rythme) et on inverse la valeur (fond sombre, typo claire). White Desert prouve dans sa section carte que ce langage fonctionne très bien en sombre avec une ligne cyan.

---

## 2. Ambiances proposées

Les quatre ambiances gardent le socle du brief (fond sombre, accent cyan, bilingue FR/EN, structure d'accueil validée). Elles diffèrent par la typographie, la densité, le mouvement et le type d'image. Les captures des sites de référence ont été prises le 2026-09-25 (desktop 1440 x 900), les sites étaient en ligne à cette date.

### Ambiance A : « Plan technique »

Le langage de Money in Check (grille visible, accent unique, métadonnées) passé en mode ingénieur. Le site ressemble à un plan d'architecture ou à une fiche technique soignée.

- **Adjectifs** : rigoureux, précis, structuré, sobre, crédible.
- **Palette** : fond graphite `#0E1113`, lignes de grille `#1E2428`, texte `#E6EDF0`, texte secondaire `#8A969C`, accent cyan `#00F0FF` pour liens, actions et tracés uniquement.
- **Typographie** : une grotesque technique pour les titres (piste : Space Grotesk retravaillée, ou Geist / Inter Tight en graisse forte), une monospace pour les métadonnées et légendes (JetBrains Mono, Geist Mono). Nom en très grand, pleine largeur, calé sur la grille.
- **Motion** : minimal et fonctionnel. Les lignes de la grille se tracent au chargement, les sections apparaissent par révélation de masque, compteurs et étiquettes s'écrivent en mono. Rien ne bouge sans raison.
- **Au service du brief** : parle directement aux recruteurs et aux équipes tech (sérieux, lisible, rapide à parcourir). Les automatisations n8n se prêtent parfaitement à des schémas de flux tracés en lignes cyan. Relanceo peut être présenté comme une fiche produit avec légendes « FIG. 1 ».
- **Risque** : peut devenir froid si on ne garde pas une touche humaine (photo, signature Jack0237, une phrase personnelle).

| oxide.computer | warp.dev | planetscale.com |
|---|---|---|
| ![](references/ambiance-blueprint-oxide.png) | ![](references/ambiance-blueprint-warp.png) | ![](references/ambiance-blueprint-planetscale.png) |

- [oxide.computer](https://oxide.computer/) : légendes « FIG. 1 », console en mono, accent vert unique sur fond sombre, illustration technique au lieu de photo d'ambiance.
- [warp.dev](https://www.warp.dev/) : titre en monospace, grille de points visible, étiquettes « [ fig. 1 : the factory ] ». Site clair, mais la logique se transpose telle quelle en sombre.
- [planetscale.com](https://planetscale.com/) : densité assumée, texte en mono, grille de logos à bordures fines, un seul accent (orange) pour les actions.

### Ambiance B : « Grand titre éditorial »

La transposition la plus fidèle de Money in Check : la typographie géante est l'image. Le nom occupe l'écran, la photo le traverse, et le reste de la page se lit comme un magazine.

- **Adjectifs** : affirmé, éditorial, élégant, personnel, confiant.
- **Palette** : fond noir chaud `#0B0B0C`, texte ivoire `#EDEAE3`, gris `#6F6C66`, accent cyan `#00F0FF` utilisé très rarement (sélecteur de langue, CTA, soulignés de lien).
- **Typographie** : une serif display à fort contraste pour le nom et les titres de section (pistes : Instrument Serif, Fraunces, PP Editorial New si licence), une grotesque neutre pour le texte courant, une italique pour la voix personnelle (citations, légendes, signature).
- **Motion** : le nom se compose lettre par lettre au premier affichage puis reste immobile, la photo glisse légèrement en parallaxe devant les lettres, la phrase de valeur en très grand corps s'éclaire mot par mot au scroll (comme le paragraphe gris de Money in Check).
- **Au service du brief** : très fort pour le personal branding et le blog (lecture agréable, articles mis en valeur comme dans une revue). Se démarque immédiatement des portfolios dev habituels. La photo discrète demandée par le brief devient un élément de composition.
- **Risque** : moins « tech » au premier regard. Il faut que les sections Projets et Stack réintroduisent des signes techniques (mono, captures d'interface réelles).

| dennissnellenberg.com | stripe.press | rauno.me |
|---|---|---|
| ![](references/ambiance-grand-titre-snellenberg.png) | ![](references/ambiance-grand-titre-stripepress.png) | ![](references/ambiance-grand-titre-rauno.png) |

- [dennissnellenberg.com](https://dennissnellenberg.com/) : nom de famille géant en bas du hero, photo qui le chevauche, rôle en petit à droite. Exactement la structure du hero de Money in Check appliquée à un développeur.
- [stripe.press](https://stripe.press/) : ambiance de maison d'édition sur fond sombre, serif élégante, objets (livres) mis en scène comme des pièces de collection.
- [rauno.me](https://rauno.me/) : phrase de présentation en très grand corps sur plusieurs lignes, un seul aplat de couleur vive, énormément de soin dans le détail.

### Ambiance C : « Expédition cinématique »

La transposition de White Desert : la page d'accueil est un film en six scènes. Chaque section occupe l'écran, les transitions racontent un parcours (du problème à la solution, de l'idée à la prod), et la section projets reprend l'idée de la carte sombre avec trajectoire cyan.

- **Adjectifs** : immersif, spectaculaire, narratif, audacieux, mémorable.
- **Palette** : noir profond `#07090B`, bleu nuit `#0F1720` pour les panneaux, blanc glacier `#F2F6F8`, cyan `#00F0FF` pour les trajectoires et points actifs, un seul accent chaud optionnel (comme l'onglet orange de White Desert) pour le bouton de contact toujours visible.
- **Typographie** : une grotesque condensée très haute pour les mots-titres pleine largeur (pistes : Oswald retravaillée, Bebas Neue Pro, Big Shoulders Display), une italique serif pour les accroches courtes, une grotesque lisible pour le texte.
- **Motion** : le plus riche des quatre. Titre qui se dissout au scroll, révélations en bandes verticales entre sections, carrousel horizontal des automatisations, tracé animé d'un flux n8n (déclencheur, étapes, sortie) en ligne cyan. Toutes ces animations doivent avoir une version statique propre avec `prefers-reduced-motion`.
- **Au service du brief** : excellent pour mettre en avant les produits (Relanceo raconté comme une expédition : problème, parcours, résultat) et marquer les esprits des clients freelance. Démontre en soi une compétence front avancée.
- **Risque** : le plus coûteux à produire et à maintenir, plus lourd à charger, et le bilingue double le travail sur les textes animés. Demande des visuels de qualité (captures, schémas) pour chaque scène. À doser pour que les recruteurs trouvent vite l'information.

| igloo.inc | basement.studio | lusion.co |
|---|---|---|
| ![](references/ambiance-expedition-igloo.png) | ![](references/ambiance-expedition-basement.png) | ![](references/ambiance-expedition-lusion.png) |

- [igloo.inc](https://www.igloo.inc/) : univers glacé en 3D, maillage filaire et petites étiquettes numériques. C'est le pont le plus direct entre l'imaginaire de White Desert et un langage tech.
- [basement.studio](https://basement.studio/) : scène sombre et cinématographique dès l'arrivée, typographie en néon, sentiment d'entrer dans un lieu.
- [lusion.co](https://lusion.co/) : narration interactive au scroll, objets 3D qui réagissent, croix de repère aux angles façon grille. Site clair en hero mais scènes sombres, très instructif pour le rythme.

### Ambiance D : « Console produit »

L'esthétique des meilleurs outils de développeurs (Linear, Railway) appliquée à un portfolio : sombre, net, dense en information, avec des captures d'interface réelles au centre. Le portfolio ressemble à la page d'accueil d'un produit bien fait.

- **Adjectifs** : net, professionnel, moderne, efficace, produit.
- **Palette** : fond `#0A0B0D`, surfaces `#121418`, bordures `#1F232A`, texte `#E8EAED`, secondaire `#8B9099`, accent cyan `#00F0FF` pour liens, focus et badges d'état.
- **Typographie** : une seule famille grotesque soignée en plusieurs graisses (pistes : Inter Display, Geist, Satoshi), une monospace discrète pour les stacks et les dates. Titres de taille moyenne, alignés à gauche, pas de mot géant.
- **Motion** : subtil. Apparitions en fondu court, reflet de bordure au survol des cartes, captures d'interface qui s'inclinent très légèrement. Aucune animation longue.
- **Au service du brief** : le plus rassurant pour les recruteurs et le plus simple à décliner page par page (projets, CV, blog). Valorise très bien Relanceo en tant que SaaS (grande capture d'app dans un cadre de fenêtre). Rapide à charger, bilingue facile.
- **Risque** : c'est l'ambiance la plus répandue chez les développeurs, donc la plus proche de l'aspect « template » que le brief veut éviter. Elle reprend peu de ce qui plaît dans les deux sites aimés (pas de typo géante, peu de narration).

| linear.app | railway.com | brittanychiang.com |
|---|---|---|
| ![](references/ambiance-console-linear.png) | ![](references/ambiance-console-railway.png) | ![](references/ambiance-console-brittanychiang.png) |

- [linear.app](https://linear.app/) : titre sobre aligné à gauche, grande capture d'interface réelle comme image principale, gris très maîtrisés.
- [railway.com](https://railway.com/) : ciel nocturne illustré derrière une interface produit, une touche d'atmosphère sans perdre la clarté.
- [brittanychiang.com](https://brittanychiang.com/) : portfolio dev de référence, colonne fixe à gauche avec navigation, expérience et projets à droite, accent turquoise discret. Montre aussi la limite : très copié.

---

## 3. Recommandation

**Je recommande l'ambiance A, « Plan technique », enrichie de deux éléments de l'ambiance B** : le nom en très grand pleine largeur dans le hero, et une italique pour la voix personnelle (accroche, signature Jack0237, citations du blog).

Pourquoi :

1. **C'est la synthèse la plus juste des deux sites aimés.** Elle garde ce qu'ils ont en commun (grille visible, accent unique, contraste d'échelle, métadonnées précises) et la section carte de White Desert montre déjà que ce langage fonctionne en sombre avec une ligne cyan.
2. **Elle colle au positionnement « Dev full-stack & automatisation IA ».** Les schémas de flux n8n tracés sur la grille deviennent la signature visuelle du site, et ils montrent le vrai travail plutôt qu'une décoration.
3. **Elle sert les trois objectifs** : sérieuse pour les recruteurs, lisible pour présenter Relanceo comme un produit, assez singulière pour le personal branding.
4. **Elle est réaliste** pour une refonte page par page, bilingue, avec Firebase : peu d'assets lourds, motion légère, cohérence facile à tenir sur Projets, CV et Blog.
5. **Elle remplace naturellement les particules** actuelles par la grille, qui a une raison d'être.

Alternatives selon ce que l'utilisateur privilégie :

- S'il veut surtout **marquer les esprits** et accepte un chantier plus long : ambiance C.
- S'il veut un site **plus personnel et orienté blog** : ambiance B pure.
- S'il veut **le plus rapide et le plus sûr** : ambiance D, en acceptant qu'elle soit moins distinctive.

**La décision revient à l'utilisateur.** Une fois l'ambiance choisie (ou un mélange), le `design-director` rédigera `docs/DESIGN.md` en commençant par la page d'Accueil.

## 4. Questions pour l'utilisateur

1. Quelle ambiance (A, B, C, D ou un mélange précis) ?
2. Dans le hero, préférez-vous mettre en très grand « NGUEGUIM », « WILFRIED NGUEGUIM » ou « JACK0237 » ?
3. Acceptez-vous un second accent de couleur très ponctuel (comme l'orange de White Desert) pour le bouton de contact, ou le cyan seul ?
4. Pour la typographie, êtes-vous attaché à Space Grotesk (police actuelle) ou ouvert à la changer ?
