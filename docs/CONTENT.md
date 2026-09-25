# CONTENT.md : textes publics du portfolio

Rédigé par `content-writer` le 2026-09-25, à partir de `docs/BRIEF.md`, `docs/DESIGN.md` (validé, Accueil en 6 scènes), `docs/SEO.md` et des fiches projets du vault (Relanceo, Ad Studio, Flux, pipeline manga, workflow du blog).

Périmètre de cette version : **page d'Accueil** (FR à `/`, EN à `/en`) et **composants globaux** (navbar, onglet de contact, footer, sélecteur de langue, interrupteur d'animations).

Statut : **proposition, en attente de validation** (utilisateur ou orchestrateur). Aucun texte n'est appliqué dans le code avant validation.

Conventions :
- `[À COMPLÉTER : ...]` = information que seul l'utilisateur peut donner. Rien n'est inventé à la place (ni chiffre, ni client, ni disponibilité).
- Les deux langues sont **rédigées**, pas traduites mot à mot.
- Aucun tiret cadratin dans ce fichier (vérifié par recherche en fin de rédaction).
- Colonne « Composant » : fichier cible indicatif dans le futur projet Next.js (à ajuster par `frontend-developer`). Les clés de traduction proposées (`home.hero.value`...) servent de repère pour le système i18n.
- Libellés en capitales (étiquettes mono, titres condensés) : on écrit la casse normale dans le contenu, les capitales sont appliquées en CSS (`text-transform`). Les lecteurs d'écran lisent ainsi « Projets » et pas « P-R-O-J-E-T-S ».

---

## 0. Métadonnées de l'Accueil

Reprise des propositions de `SEO.md` 3.2, qui respectent déjà les longueurs et placent le nom en tête. Je ne propose pas mieux : la phrase de valeur retenue (section 2.1) est cohérente avec la description.

| Champ | FR (`/`) | EN (`/en`) |
|---|---|---|
| `title` | Wilfried NGUEGUIM \| Dev full-stack & automatisation IA | Wilfried NGUEGUIM \| Full-stack & AI automation developer |
| `description` | Wilfried NGUEGUIM (Jack0237), développeur full-stack : sites, applis web et mobiles, automatisations n8n et IA. Projets en production, blog et contact. | Wilfried NGUEGUIM (Jack0237), full-stack developer: websites, web and mobile apps, n8n and AI automations. Live projects, blog and contact details. |
| `og:title` | identique au `title` | identique au `title` |
| `og:description` | Dev full-stack et automatisation n8n / IA. Projets, services et blog. | Full-stack developer and n8n / AI automation. Projects, services and blog. |
| `og:image:alt` | Wilfried NGUEGUIM, dev full-stack et automatisation IA | Wilfried NGUEGUIM, full-stack and AI automation developer |
| Texte de l'image OG (asset n° 9) | NGUEGUIM · Dev full-stack & automatisation IA · jack0237.com | NGUEGUIM · Full-stack & AI automation developer · jack0237.com |
| JSON-LD `jobTitle` | Développeur full-stack et automatisation IA | Full-stack and AI automation developer |

---

## 1. Composants globaux

### 1.1 Lien d'évitement (premier élément focusable)

| Clé | FR | EN |
|---|---|---|
| `global.skip` | Aller au contenu | Skip to content |

### 1.2 Navbar (`components/Navbar`)

| Clé | FR | EN | Notes |
|---|---|---|---|
| `nav.label` (`aria-label` du `<nav>`) | Navigation principale | Main navigation | |
| `nav.logo` (texte visible) | Jack0237 | Jack0237 | Affiché en capitales par le CSS, texte réel |
| `nav.logo.aria` | Jack0237, retour à l'accueil | Jack0237, back to home | |
| `nav.projects` | Projets | Projects | |
| `nav.resume` | CV | Resume | |
| `nav.blog` | Blog | Blog | |
| `nav.contact` | Contact | Contact | |
| `nav.step` (indicateur, `aria-hidden`) | 01 / 06 | 01 / 06 | Chiffres seuls, pas de traduction |
| `nav.menu.open` | Ouvrir le menu | Open menu | Bouton mobile |
| `nav.menu.close` | Fermer le menu | Close menu | |
| `nav.menu.dialog` (`aria-label` du menu mobile) | Menu | Menu | |

### 1.3 Sélecteur de langue

| Clé | FR | EN | Notes |
|---|---|---|---|
| `lang.group` (`aria-label` du groupe) | Langue du site | Site language | |
| Segment FR (texte visible) | FR | FR | `hreflang="fr"`, `lang="fr"` |
| Segment EN (texte visible) | EN | EN | `hreflang="en"`, `lang="en"` |
| `lang.fr.aria` | Version française | Version française | Toujours dans la langue cible, pour être compris par qui la cherche |
| `lang.en.aria` | English version | English version | idem |

Le segment actif porte `aria-current="true"`. Pas de drapeaux.

### 1.4 Onglet de contact vertical (desktop, `components/ContactTab`)

| Clé | FR | EN |
|---|---|---|
| `contactTab.label` | Me contacter | Contact me |

Cible du lien : page Contact / services, sinon `mailto:jasonngueguim@gmail.com` (e-mail validé le 2026-09-25). Téléphone fourni par l'utilisateur, **non affiché sur le site** (uniquement sur le CV, décision du 2026-09-25).

### 1.5 Footer (`components/Footer`)

| Clé | FR | EN | Notes |
|---|---|---|---|
| `footer.signature` (italique serif) | Jack0237 | Jack0237 | Voix personnelle |
| `footer.name` | Wilfried NGUEGUIM | Wilfried NGUEGUIM | |
| `footer.title` | Dev full-stack & automatisation IA | Full-stack & AI automation developer | |
| `footer.col.pages` | Pages | Pages | Étiquette mono |
| `footer.col.profiles` | Profils | Profiles | |
| `footer.col.contact` | Contact | Contact | |
| Liens Pages | Projets · CV · Blog · Contact | Projects · Resume · Blog · Contact | |
| Liens Profils (visible) | GitHub ↗ · LinkedIn ↗ · X ↗ | GitHub ↗ · LinkedIn ↗ · X ↗ | |
| Libellé accessible des liens externes | GitHub (nouvel onglet) | GitHub (opens in a new tab) | Même modèle pour LinkedIn et X |
| `footer.contact.value` | jasonngueguim@gmail.com | idem | Lien `mailto:`. Téléphone : voir 1.4 |
| `footer.cv` | Télécharger mon CV ↓ | Download my resume ↓ | Voir 2.6 pour le fichier |
| `footer.copyright` | © 2026 Wilfried NGUEGUIM | © 2026 Wilfried NGUEGUIM | Année générée au build |
| `footer.updated` | Mise à jour : [date du build] | Updated: [build date] | Date réelle générée au build, format `25 SEPT. 2026` / `25 SEP 2026` |
| `footer.top` (visible) | ↑ Haut | ↑ Top | |
| `footer.top.aria` | Revenir en haut de la page | Back to top of page | |

### 1.6 Interrupteur « Réduire les animations » (footer)

Composant `role="switch"` avec `aria-checked`. Le libellé ne change pas selon l'état, c'est l'état du switch qui est annoncé.

| Clé | FR | EN |
|---|---|---|
| `motion.label` | Réduire les animations | Reduce motion |
| `motion.hint` (texte d'aide, `aria-describedby`) | Par défaut, le site suit le réglage de votre appareil. | By default, the site follows your device setting. |
| `motion.system` (affiché si le système demande déjà moins de mouvement) | Votre appareil demande déjà moins d'animations. | Your device already asks for less motion. |

---

## 2. Page d'Accueil

Rappel de structure SEO (`SEO.md` 3.3) : un seul H1, un H2 par scène, H3 pour projets, services, articles, H4 pour chaque automatisation.

**Étiquettes mono des scènes** : je garde des étiquettes explicites (« Étape 02 · Projets ») plutôt que les noms narratifs internes (« L'expédition »). Le numéro d'étape porte déjà l'idée de parcours ; un recruteur qui scanne doit comprendre chaque étiquette sans contexte. Ce sont des `<p>` ou `<span>`, jamais des titres.

| Scène | Étiquette FR | Étiquette EN |
|---|---|---|
| 01 | Étape 01 | Step 01 |
| 02 | Étape 02 · Projets | Step 02 · Projects |
| 03 | Étape 03 · Services | Step 03 · Services |
| 04 | Étape 04 · Stack | Step 04 · Stack |
| 05 | Étape 05 · Blog | Step 05 · Blog |
| 06 | Étape 06 · Contact | Step 06 · Contact |

### 2.1 Scène 01 : Hero (`app/[lang]/page` > `HeroScene`)

| Élément | Balise | FR | EN |
|---|---|---|---|
| Étiquette | `p` mono | Étape 01 | Step 01 |
| Métadonnée lieu | `p` mono | `[À COMPLÉTER : ville affichée, ou aucune]` | `[À COMPLÉTER : city, or none]` |
| Métadonnée heure | `p` mono | `[À COMPLÉTER : fuseau horaire]`, heure calculée en direct, format `14:32 UTC+1` | idem |
| Métadonnée disponibilité (point braise si validé) | `p` mono | `[À COMPLÉTER : statut et formulation exacte, voir variantes ci-dessous]` | idem |
| Prénom (italique serif, dans le H1) | `h1 > span` | Wilfried | Wilfried |
| Mot géant (dans le H1) | `h1 > span` | NGUEGUIM | NGUEGUIM |
| Titre de métier | `p` juste après le H1 | Dev full-stack & automatisation IA | Full-stack & AI automation developer |
| Phrase de valeur | `p` | Je construis des applis web et mobiles, et des automatisations n8n et IA. Ce que je livre tourne en production. | I build web and mobile apps, and n8n and AI automations. What I ship runs in production. |
| Signature près du portrait (italique serif, facultative) | `p` | alias Jack0237 | aka Jack0237 |
| CTA principal (`primary`) | `a` | Voir mes projets → | See my projects → |
| CTA secondaire (`ghost`) | `a` | Me contacter | Contact me |
| `alt` du portrait | `img` | Portrait de Wilfried NGUEGUIM | Portrait of Wilfried NGUEGUIM |

Pourquoi cette phrase de valeur :
- Elle cite ce que je construis (applis web, mobiles, automatisations n8n et IA), donc les mots-clés du hero sans bourrage.
- « Ce que je livre tourne en production » est vérifiable sur la page même : Relanceo en ligne, workflows n8n actifs, le blog de ce site alimenté par un workflow. C'est la preuve que cherche un client, et elle est vraie.
- Longueur : environ 110 caractères en FR, soit 3 lignes de 40 caractères maximum sur desktop, conforme à `DESIGN.md` 7.2.

Variante (si l'utilisateur veut dire **pour qui**, une fois la cible confirmée) :
- FR : « Je construis des applis web et mobiles et des automatisations n8n et IA, pour les équipes et les petites entreprises qui veulent arrêter les tâches répétitives. »
- EN : « I build web and mobile apps and n8n and AI automations for teams and small businesses that want to stop doing repetitive work by hand. »
Plus longue (4 lignes) : à tester en maquette avant de la retenir.

Variantes de la métadonnée de disponibilité, **à choisir par l'utilisateur** (aucune n'est affichée par défaut) :

| Situation | FR | EN |
|---|---|---|
| CDI uniquement | Ouvert à un CDI | Open to a full-time role |
| Freelance uniquement | Disponible pour des missions | Available for freelance work |
| Les deux | Ouvert à un CDI ou à des missions | Open to full-time roles and freelance work |
| Aucun statut | (ligne masquée) | (line hidden) |

### 2.2 Scène 02 : Projets (`ProjectsScene`)

| Élément | Balise | FR | EN |
|---|---|---|---|
| Étiquette | `p` mono | Étape 02 · Projets | Step 02 · Projects |
| Titre de scène | **H2** | Projets | Projects |

#### Partie A : Relanceo

| Élément | Balise | FR | EN |
|---|---|---|---|
| Légende technique | `p` mono | Fig. 01 · SaaS · En production | Fig. 01 · SaaS · Live |
| Nom | **H3** | Relanceo | Relanceo |
| Sous-titre (une ligne sous le nom) | `p` | Le suivi des factures et la relance des impayés, pour les TPE et les indépendants. | Invoice tracking and late-payment reminders for small businesses and freelancers. |
| Étiquette | `p` mono | Le problème | The problem |
| Texte problème | `p` | Relancer un client qui tarde à payer prend du temps et finit souvent par passer à la trappe. Pour une TPE ou un indépendant, chaque retard pèse directement sur la trésorerie. | Chasing a client who pays late takes time, and it is easy to let it slide. For a small business or a freelancer, every late invoice hits cash flow directly. |
| Étiquette | `p` mono | Ce que ça fait | What it does |
| Puce 1 | `li` | Suit chaque facture et envoie les relances par e-mail au bon moment, au nom de l'entreprise. | Tracks every invoice and sends email reminders at the right time, under the company's own name. |
| Puce 2 | `li` | Arrête les relances dès qu'une facture est marquée payée. | Stops reminders as soon as an invoice is marked as paid. |
| Puce 3 | `li` | Permet de travailler à plusieurs sur un même compte, avec invitations et rôles. | Lets a whole team share one account, with invitations and roles. |
| Étiquette | `p` mono | Stack | Stack |
| Badges | `li` mono | React · TypeScript · Node.js · Fastify · PostgreSQL · Docker | idem |
| Résultats | `p` | Aucun résultat chiffré fourni (2026-09-25) : **ligne non affichée**. | idem |
| Barre de la fenêtre de capture | `span` mono | relanceo.cloud | idem |
| Légende de la capture (italique serif, voix) | `figcaption` | « Mon premier produit conçu pour des clients extérieurs. Une règle que je ne négocie pas : aucune relance ne part après un paiement. » | "My first product built for outside customers. One rule I never bend: no reminder goes out once an invoice is paid." |
| `alt` de la capture | `img` | Tableau de bord de Relanceo : liste des factures et état de leurs relances, avec des données de démonstration. | Relanceo dashboard: list of invoices and the status of their reminders, shown with demo data. |
| Bouton (cible `https://relanceo.cloud/`) | `a` (`ghost` ou `primary`) | Voir Relanceo en ligne ↗ | See Relanceo live ↗ |
| Libellé accessible du bouton | | Voir Relanceo en ligne (nouvel onglet) | See Relanceo live (opens in a new tab) |
| Lien | `a` (`link`) | Étude de cas → | Read the case study → |

Notes Relanceo :
- Les trois puces viennent de fonctionnalités réellement livrées (relance automatique, arrêt au paiement, nom d'expéditeur personnalisable, multi-utilisateurs). Aucune promesse de résultat.
- Le lien « Étude de cas » suppose une fiche projet sur la page Projets, pas encore conçue. En attendant, masquer le lien ou pointer vers `/projects#relanceo`.
- L'`alt` de la capture est à ajuster à l'écran réellement capturé (`visual-asset-curator`).
- Le produit est gratuit à ce jour. Le dire sur l'Accueil (« Gratuit pendant la phase de lancement ») n'est utile que si l'utilisateur veut attirer des inscrits : `[À COMPLÉTER : mentionner la gratuité, oui ou non]`.


#### Partie B : automatisations

| Élément | Balise | FR | EN |
|---|---|---|---|
| Titre de sous-bloc | **H3** | Automatisations n8n / IA | n8n / AI automations |
| Compteur (mono, `aria-hidden`) | `span` | 02 / 03 | 02 / 03 |
| Flèche gauche (`aria-label`) | `button` | Automatisation précédente | Previous automation |
| Flèche droite (`aria-label`) | `button` | Automatisation suivante | Next automation |
| `aria-label` du carrousel | `section` | Automatisations n8n et IA | n8n and AI automations |
| Lien de fin de scène | `a` (`link`) | Tous les projets → | All projects → |

**Choix des cartes (validé le 2026-09-25)** : blog automatique, recaps manga, Flux. Ad Studio non affiché sur l'Accueil.

Ma recommandation, si l'utilisateur veut un avis : **blog automatique** (preuve visible sur la page même, scène 05), **recaps manga** (le résultat le plus parlant, une vidéo) et **Flux** (montre la validation humaine, gage de sérieux). Ad Studio est un bon quatrième choix, mais ce n'est pas un workflow n8n (voir sa carte).

Format de chaque carte : légende mono, nom (H4), une phrase « déclencheur, étapes, sortie », stack. Le schéma SVG porte un `aria-label` qui décrit le flux en une phrase. Les numéros « Fig. 0X » sont attribués dans l'ordre retenu (Fig. 02, 03, 04).

##### Carte candidate A : recaps manga en vidéo

| Élément | FR | EN |
|---|---|---|
| Légende | Fig. 0X · n8n · IA · Vidéo | Fig. 0X · n8n · AI · Video |
| Nom (H4) | Recaps manga en vidéo | Manga recap videos |
| Description | J'envoie le titre d'un manga et un chapitre sur Telegram. Le workflow récupère les pages, fait écrire le script par Gemini, génère la voix off, puis monte une vidéo verticale sous-titrée qu'il me renvoie, prête pour TikTok. | I send a manga title and a chapter number on Telegram. The workflow fetches the pages, has Gemini write the script, generates the voice-over, then edits a subtitled vertical video and sends it back, ready for TikTok. |
| Stack | n8n · Gemini · ElevenLabs · Whisper · FFmpeg · Python | idem |
| `aria-label` du schéma | Message Telegram, récupération des pages, script écrit par Gemini, voix off, montage vidéo, envoi de la vidéo sur Telegram. | Telegram message, page retrieval, script written by Gemini, voice-over, video editing, video sent back on Telegram. |
| Voix (italique serif, facultative) | « L'IA a été la partie rapide. Faire passer la vidéo sous la taille limite de Telegram a pris plus longtemps. » | "The AI part was quick. Keeping the video under Telegram's file size limit took longer." |

Note : aucune capture de pages de manga (droits des éditeurs). Le visuel reste le schéma de flux.

##### Carte candidate B : pipeline éditorial Flux

| Élément | FR | EN |
|---|---|---|
| Légende | Fig. 0X · n8n · IA · API | Fig. 0X · n8n · AI · API |
| Nom (H4) | Pipeline éditorial Flux | Flux editorial pipeline |
| Description | Chaque matin, le workflow lit une sélection de flux RSS, écarte les doublons et fait rédiger un résumé court par Gemini. Chaque carte m'arrive sur Telegram avec deux boutons, publier ou rejeter : rien n'est publié sans validation humaine. | Every morning, the workflow reads a set of RSS feeds, drops duplicates and has Gemini draft a short summary. Each card reaches me on Telegram with two buttons, publish or reject, so nothing goes live without a human check. |
| Contexte (une ligne, `text-3`) | Pour Flux, une appli mobile de culture générale en cours de développement. | Built for Flux, a general-knowledge mobile app currently in development. |
| Stack | n8n · Gemini · Telegram · Fastify · PostgreSQL | idem |
| `aria-label` du schéma | Déclenchement chaque matin, lecture des flux RSS, suppression des doublons, résumé par Gemini, validation sur Telegram, publication via l'API. | Daily morning trigger, RSS feeds read, duplicates removed, summary by Gemini, approval on Telegram, publication through the API. |

Flux nommé publiquement (carte validée le 2026-09-25).

##### Carte candidate C : blog automatique

| Élément | FR | EN |
|---|---|---|
| Légende | Fig. 0X · n8n · IA · Firebase | Fig. 0X · n8n · AI · Firebase |
| Nom (H4) | Blog automatique | Self-publishing blog |
| Description | J'envoie un sujet à un bot Telegram. Gemini rédige l'article, le workflow l'enregistre dans Firestore, le blog de ce site l'affiche, et le bot me renvoie le lien. | I send a topic to a Telegram bot. Gemini writes the article, the workflow saves it to Firestore, this site's blog displays it, and the bot replies with the link. |
| Renvoi (une ligne, `text-3`) | Les articles de la scène Blog, plus bas, arrivent par ce chemin. | The posts in the Blog section below come in this way. |
| Stack | n8n · Gemini · Firestore · Telegram | idem |
| `aria-label` du schéma | Message Telegram, rédaction par Gemini, enregistrement dans Firestore, confirmation avec le lien de l'article. | Telegram message, article written by Gemini, saved to Firestore, confirmation with the article link. |

##### Carte candidate D : Ad Studio

**Le nom du client n'apparaît nulle part** : ni dans le texte, ni dans les `alt`, ni dans les métadonnées, ni dans les noms de fichiers. Aucun visuel publicitaire réel du client.

| Élément | FR | EN |
|---|---|---|
| Légende | Fig. 0X · App web · IA | Fig. 0X · Web app · AI |
| Nom (H4) | Ad Studio | Ad Studio |
| Description | Un outil interne pour une entreprise cliente : son équipe crée des visuels publicitaires Facebook fidèles à sa charte graphique, avec des propositions de texte par IA et un aperçu tel qu'il apparaîtra dans le fil. | An internal tool for a client company: its team creates Facebook ad visuals that stay true to the brand guidelines, with AI-suggested copy and a preview of how the ad will look in the feed. |
| Stack | React · TypeScript · Fastify · PostgreSQL · Playwright · API Claude | React · TypeScript · Fastify · PostgreSQL · Playwright · Claude API |
| `aria-label` du schéma | Choix d'un gabarit, texte proposé par l'IA, rendu du visuel, aperçu dans un fil Facebook, export. | Template picked, copy suggested by AI, visual rendered, preview in a Facebook feed, export. |

Notes :
- Ad Studio est une application web, pas un workflow n8n : si elle est retenue, le titre du sous-bloc devient « Automatisations et outils IA » / « Automations and AI tools », et le schéma montre le parcours dans l'app.
- « une entreprise cliente » reste volontairement vague (ni secteur, ni taille). `[À COMPLÉTER : accord de l'utilisateur sur cette formulation]`.

### 2.3 Scène 03 : Services (`ServicesScene`)

| Élément | Balise | FR | EN |
|---|---|---|---|
| Étiquette | `p` mono | Étape 03 · Services | Step 03 · Services |
| Titre de scène | **H2** | Services | Services |
| Accroche (italique serif, une ligne) | `p` | « Dites-moi ce qui vous ralentit, on part de là. » | "Tell me what slows you down. We start there." |
| Lien de fin de scène | `a` (`link`) | Voir les services et me contacter → | See services and get in touch → |

Cartes (carte entière cliquable vers l'ancre du service sur la page Contact / services) :

| # | H3 FR | Texte FR (2 lignes) | H3 EN | Texte EN | Stack (mono) |
|---|---|---|---|---|---|
| 01 | Sites et applis web | Un site rapide ou une application métier sur mesure, en ligne et facile à faire évoluer. De la maquette au déploiement. | Websites and web apps | A fast website or a custom business app, live and easy to extend. From mockup to deployment. | React · Next.js · Node.js · PostgreSQL |
| 02 | Applis mobiles | Une appli iOS et Android à partir d'une seule base de code, reliée à votre back-office ou à votre API. | Mobile apps | One codebase for an iOS and Android app, connected to your back office or API. | React Native · Expo · Flutter |
| 03 | Automatisations n8n / IA | Les tâches répétitives confiées à un workflow n8n, avec de l'IA quand elle apporte vraiment quelque chose et une validation humaine là où il en faut. | n8n / AI automations | Repetitive tasks handed over to an n8n workflow, with AI where it actually helps and a human check where one is needed. | n8n · Gemini · Claude · Telegram |

- `aria-label` de chaque carte : « Sites et applis web : voir le détail du service » / « Websites and web apps: see service details » (même modèle pour les deux autres).
- Mot-clé « freelance » : **retenu** (l'utilisateur vise CDI et freelance, 2026-09-25). Lien de fin : « Discuter d'une mission → » / « Discuss a freelance project → ».
- Aucun tarif, délai ou garantie (non fournis).
- Les stacks des cartes sont à aligner sur la liste validée de la scène 04.

### 2.4 Scène 04 : Stack (`StackScene`)

| Élément | Balise | FR | EN |
|---|---|---|---|
| Étiquette | `p` mono | Étape 04 · Stack | Step 04 · Stack |
| Titre de scène | **H2** | Stack | Stack |
| Phrase d'introduction (une ligne, `text-2`) | `p` | Les outils derrière les projets de cette page. | The tools behind the projects on this page. |

Groupes (H3 facultatifs, étiquettes mono) et outils candidats, **liste à valider** `[À COMPLÉTER : liste de la stack validée, à compléter ou retirer]` :

| Groupe FR | Groupe EN | Outils candidats (relevés dans les projets réels) |
|---|---|---|
| Front | Front end | React, Next.js, TypeScript |
| Back | Back end | Node.js, Express, Fastify, PostgreSQL |
| Mobile | Mobile | Expo / React Native, Flutter |
| Automatisation / IA | Automation / AI | n8n, API Gemini, API Claude |
| Infra | Infra | Docker, Traefik, Firebase, Supabase |

- Chaque logo porte son nom en texte (`aria-label` ou libellé visible) : « React », « n8n »... Pas de traduction des noms de marque, sauf « API Gemini » / « Gemini API » et « API Claude » / « Claude API ».
- `aria-label` de chaque liste : « Outils front-end » / « Front-end tools » (même modèle par groupe).
- Next.js : à garder seulement si le nouveau portfolio (Next.js) compte comme expérience, ce qui sera vrai une fois en ligne.

### 2.5 Scène 05 : Blog (`BlogScene`)

| Élément | Balise | FR | EN |
|---|---|---|---|
| Étiquette | `p` mono | Étape 05 · Blog | Step 05 · Blog |
| Titre de scène | **H2** | Blog | Blog |
| Accroche (italique serif) | `p` | « Mon journal de bord : automatisation, IA et développement web. » | "My logbook: automation, AI and web development." |
| Titre de chaque article | **H3** (`lang` de l'article) | titre Firestore, tel quel | titre Firestore, tel quel |
| Métadonnées | `p` mono | [date] · [n] min de lecture | [date] · [n] min read |
| Badge de langue (si l'article n'est pas dans la langue de l'interface) | `span` mono | EN | FR |
| Libellé accessible du badge | | Article en anglais | Article in French |
| Lien de ligne (visible) | `a` | Lire → | Read → |
| Libellé accessible du lien | | Lire l'article : [titre] | Read the article: [title] |
| Lien de fin de scène | `a` (`link`) | Tout le blog → | All blog posts → |
| `alt` du visuel d'article | `img` | `alt=""` (décoratif : le titre est déjà dans le lien) | `alt=""` |
| `alt` du visuel de repli | `img` | `alt=""` (décoratif) | `alt=""` |

États :

| État | FR | EN |
|---|---|---|
| Vide (italique serif) | « Le journal de bord s'ouvre bientôt. Les premiers articles arrivent. » | "The logbook opens soon. The first posts are on their way." |
| Vide, lien | Aller au blog → | Go to the blog → |
| Erreur | Même texte que l'état vide (aucun message technique, l'erreur est journalisée côté serveur) | Same as empty state |
| Chargement (si rendu client) | Squelettes sans texte ; `aria-busy="true"` et texte réservé aux lecteurs d'écran : « Chargement des derniers articles » | Screen-reader text: "Loading the latest posts" |

Notes :
- Les titres des articles ne sont pas réécrits (ils viennent de Firestore, en capitales).
- Les dates arrivent en anglais (« 26 MAY 2026 ») : sur l'interface FR, les afficher telles quelles ou les reformater (« 26 MAI 2026 ») est une décision `frontend-developer`. Je recommande de reformater à partir de l'identifiant `Date.now()`, pour une date correcte dans chaque langue.
- Le libellé « min de lecture » suppose que `readTime` est un nombre. S'il arrive déjà sous forme de texte (« 05 MIN READ »), l'afficher tel quel.

### 2.6 Scène 06 : Appel final (`ContactScene`)

**Titre de scène proposé (à valider par `design-director`)** : `DESIGN.md` 7.12 ne prévoit pas de titre visible, et `SEO.md` 3.3 en exige un (pas de titre caché). La serif italique ne peut pas porter de titre (`DESIGN.md` 3.3). Je propose donc un **H2 en `--type-display`**, comme les autres scènes, posé au-dessus de l'invitation :

| Élément | Balise | FR | EN |
|---|---|---|---|
| Étiquette | `p` mono | Étape 06 · Contact | Step 06 · Contact |
| **Titre de scène (proposé)** | **H2** | Parlons-en | Let's talk |
| Invitation (italique serif, grand corps, 2 lignes) | `p` | selon la disponibilité, voir variantes | selon la disponibilité |
| Bouton contact (`contact`, braise) | `a` | Me contacter → | Contact me → |
| Bouton CV (`ghost`) | `a download` | Télécharger mon CV ↓ | Download my resume ↓ |
| Métadonnée sous le bouton CV | `span` mono | PDF · `[À COMPLÉTER : poids du fichier, calculé au build]` | PDF · [size] |
| Libellé accessible du bouton CV | | Télécharger mon CV (PDF) | Download my resume (PDF) |
| Liens sociaux (visible) | `a` | GitHub ↗ · LinkedIn ↗ · X ↗ | idem |
| Libellés accessibles | | GitHub (nouvel onglet), LinkedIn (nouvel onglet), X (nouvel onglet) | GitHub (opens in a new tab)... |
| Signature (italique serif) | `p` | Jack0237 | Jack0237 |

Pourquoi « Parlons-en » / « Let's talk » : 10 caractères dans les deux langues (sous la limite de 12 pour tenir sur une ligne à 390 px, `DESIGN.md` 9), c'est une invitation et pas une étiquette, et l'étiquette mono garde le mot « Contact » pour le recruteur qui scanne. Alternative plus sobre si le design la préfère : H2 « Contact » / « Contact ».

Variantes de l'invitation (**retenue : « CDI et missions »**, l'utilisateur vise les deux, 2026-09-25) :

| Situation | FR | EN |
|---|---|---|
| CDI et missions | « Un poste à pourvoir, une mission ou un projet à lancer ? Racontez-moi. » | "A role to fill, a freelance job or a product to launch? Tell me about it." |
| CDI uniquement | « Votre équipe cherche un développeur full-stack qui sait aussi automatiser ? Écrivez-moi. » | "Is your team looking for a full-stack developer who can also automate? Write to me." |
| Freelance uniquement | « Un projet web, mobile ou une tâche à automatiser ? Racontez-moi ce que vous avez en tête. » | "A web or mobile project, or a task to automate? Tell me what you have in mind." |

Fichier CV :
- `[À COMPLÉTER : CV à jour ? (actuel : RN_CV_NGUEGUIM_WILFRIED.pdf)]` et `[À COMPLÉTER : version anglaise du CV, oui ou non]`.
- Nom de fichier recommandé (`SEO.md` 3.4) : `CV-Wilfried-NGUEGUIM.pdf` et, si elle existe, `Resume-Wilfried-NGUEGUIM.pdf` pour `/en`. Sans version anglaise, le bouton EN devient « Download my resume (in French) ↓ ».
- Compte X `Jason_0237` : confirmé par l'utilisateur le 2026-09-25.

---

## 3. Vérifications

- Recherche du tiret cadratin dans ce fichier : zéro occurrence attendue (contrôle final par `Grep`).
- Aucun chiffre, client, témoignage ou résultat inventé. Les seules informations projets reprises sont des fonctionnalités livrées, relevées dans les fiches du vault.
- Aucune URL interne, IP, identifiant, secret ni nom de client (le client d'Ad Studio n'est cité nulle part).
- Mots-clés `SEO.md` 3.4 placés : nom et pseudo (H1, signature, description), « full-stack » (titre de métier, description), « n8n » et « IA » (phrase de valeur, scènes 02 et 03), « Relanceo », « relance », « factures », « TPE » (scène 02), noms d'outils (scène 04).

---

## 4. Informations à demander à l'utilisateur (`[À COMPLÉTER]`)

**Mise à jour 2026-09-25** : réglés, contact e-mail (jasonngueguim@gmail.com), disponibilité CDI + freelance, URL Relanceo (relanceo.cloud, aucun résultat chiffré), compte X. Automatisations : l'utilisateur n'a pas de choix à proposer ; par défaut la recommandation (blog automatique, recaps manga, Flux) en attendant confirmation. Restent : affichage du téléphone, ville, gratuité Relanceo, Flux public, stack, CV.

1. **Moyen de contact** : formulaire, e-mail ou prise de rendez-vous (onglet vertical, bouton de la scène 06, footer).
2. **Ville et fuseau horaire** du hero, ou aucune ville.
3. **Disponibilité** : CDI, freelance ou les deux (métadonnée du hero, services, invitation finale, mot-clé « freelance »), et formulation du statut.
4. **Relanceo** : URL de production à afficher, écran à capturer, résultats réels publiables (sinon aucun), mention de la gratuité (oui / non).
5. **Automatisations** : lesquelles montrer (2 ou 3 parmi recaps manga, Flux, blog automatique, Ad Studio).
6. **Flux** : accord pour le nommer publiquement.
7. **Ad Studio** : accord sur la formulation « une entreprise cliente ».
8. **Stack** affichée : liste à valider.
9. **CV** : fichier à jour, version anglaise, poids du fichier.
10. **Compte X** `Jason_0237` : à confirmer.

## 5. Points pour les autres agents

- `design-director` : valider le **H2 visible de la scène 06** (« Parlons-en » / « Let's talk » en `--type-display`, au-dessus de l'invitation en serif). Vérifier aussi que la phrase de valeur (environ 110 caractères) tient en 3 lignes dans le hero desktop et laisse les deux CTA visibles à 844 px de haut sur mobile.
- `frontend-developer` : capitales en CSS, pas dans le contenu ; dates d'articles reformatées par langue ; « Étude de cas » masqué tant que la page Projets n'existe pas.
- `visual-asset-curator` : ajuster l'`alt` de la capture Relanceo à l'écran réellement retenu.
