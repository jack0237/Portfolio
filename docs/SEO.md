# SEO.md : audit et plan SEO du portfolio

Rédigé par `seo-strategist` le 2026-09-25, à partir de `docs/BRIEF.md` et `docs/DESIGN.md` (direction validée, stack **Next.js App Router** validée, bilingue FR/EN, Firebase conservé, workflow n8n du blog intouchable).

Périmètre : audit rapide du site actuel (CRA), plan SEO cible du site Next.js (P0 / P1 / P2), puis spécifications SEO de la page d'Accueil pour `content-writer` et `frontend-developer`.

Conventions :
- Aucun volume de recherche, score ou chiffre n'est inventé. Les volumes réels se mesureront dans Google Search Console après la mise en ligne.
- Tout texte public proposé ici respecte la règle : aucun tiret cadratin entre les mots.
- Sources officielles consultées le 2026-09-25 : Google Search Central (versions localisées / hreflang), documentation Next.js `generateMetadata` (version 16.3 de la doc). Les autres références sont citées en section 8 et restent à revérifier au moment de l'implémentation.

---

## 1. Audit rapide du site actuel (CRA, jack0237.com)

Méthode : lecture du code (`public/index.html`, `public/robots.txt`, `public/manifest.json`, `vercel.json`, `src/App.js`, composants) et requêtes `curl` sur la production le 2026-09-25. **Lighthouse non exécuté** (règle de la mission : aucune installation ; `npx lighthouse` aurait installé le paquet). Score « avant » à mesurer par `ux-qa-auditor` avant la bascule, pour comparaison.

### 1.1 Constats

| # | Constat | Preuve | Gravité |
|---|---|---|---|
| A1 | **Métadonnées sociales et Schema héritées du template** : `og:title`, `twitter:title`, `itemprop="name"` valent « S0umyajit \| Portfolio », `og:url` pointe vers `https://soumyajit.vercel.app`, `og:image` vers une image GitHub d'un autre auteur (avec un jeton dans l'URL). Tout partage LinkedIn / X / Slack affiche l'identité d'un tiers. | `public/index.html`, confirmé en prod (`og:url` renvoyé par `curl https://jack0237.com/`) | Critique |
| A2 | **Rendu 100 % client** : le HTML servi fait 2 076 octets, identique sur toutes les URLs, avec `<div id="root">` vide. Aucun H1, aucun texte, aucun lien dans le HTML initial. Les robots sociaux (qui n'exécutent pas le JS) ne voient rien ; Google doit passer par la file de rendu. | `curl` sur `/`, `/blog/123`, `blog.jack0237.com/` : même taille, même `<title>` | Critique |
| A3 | **Un seul `<title>` pour tout le site** (« Jack0237 \| Portfolio ») et **deux balises `description`** contradictoires dont « Web site created using create-react-app ». Aucune métadonnée par page ni par article. | `public/index.html` | Élevée |
| A4 | **Soft 404 généralisés** : toute URL répond 200 (réécriture `/(.*)` vers `index.html`). `https://jack0237.com/sitemap.xml` renvoie la page HTML en 200. Une URL inconnue est ensuite redirigée côté client vers `/` (`<Navigate to="/">`). | `vercel.json`, `src/App.js`, `curl` | Élevée |
| A5 | **Pas de sitemap**, `robots.txt` par défaut de CRA (tout autorisé, pas de ligne `Sitemap:`). | `public/robots.txt` | Moyenne |
| A6 | **Contenu dupliqué entre hôtes** : `blog.jack0237.com/<id>` et `jack0237.com/blog/<id>` servent le même article, sans `canonical`. `blog.jack0237.com/` sert la liste du blog, `jack0237.com/blog` aussi. | `src/App.js` (détection `hostname.startsWith("blog.")`) | Moyenne |
| A7 | **`www.jack0237.com` ne répond pas** (échec de connexion). Un visiteur ou un lien entrant en `www` tombe dans le vide. `http://` redirige bien en 308 vers `https://`. | `curl` | Moyenne |
| A8 | **Plusieurs H1 par page** : l'accueil en contient trois (`Home.js` + deux dans `Home2.js`, dont « FIND ME ON »). Titres de pages en jargon (« LOGS », « CREDENTIALS & MASTERY », « COMMAND CENTER ») sans mot-clé. | `grep "<h1"` dans `src/` | Moyenne |
| A9 | **URLs d'articles à identifiant numérique** (`/blog/<Date.now()>`), sans slug ; pas de date ISO exploitable, date stockée en chaîne (« 26 MAY 2026 »). | `BlogPost.js`, `DESIGN.md` 7.10 | Faible (contrainte n8n) |
| A10 | **Performance pénalisante** : préchargeur imposé de 1,2 s, Google Fonts importées deux fois, police d'icônes Material Symbols, SDK Firebase complet chargé sur l'accueil, particules. Le LCP ne peut pas être bon tant que tout dépend du JS. | `App.js`, `index.html`, `style.css`, `DESIGN.md` | Moyenne |
| A11 | **`lang="en"`** fixe, `manifest.json` par défaut (« Create React App Sample »), `theme-color` noir générique, message `noscript` seulement. | `public/` | Faible |
| A12 | **`/admin` indexable** (aucun `noindex`). | `App.js` | Faible |
| A13 | **Aucune donnée structurée** JSON-LD (ni `Person`, ni `WebSite`, ni `BlogPosting`). | `public/index.html` | Moyenne |

### 1.2 Lecture

Le site actuel est pratiquement invisible sur son propre nom et, pire, s'annonce sous l'identité de l'auteur du template dès qu'on le partage. La migration Next.js règle A2, A3, A4, A5 et A13 par construction, **à condition** de les traiter explicitement (métadonnées par page, `notFound()`, `sitemap.ts`, JSON-LD). A1 peut être corrigé tout de suite dans `public/index.html` (fichier purement SEO) si la bascule Next.js prend plus de quelques semaines : décision à prendre par l'utilisateur (question ouverte Q8).

---

## 2. Plan SEO cible (Next.js App Router)

### 2.1 Stratégie bilingue (URLs, hreflang, langue par défaut)

**Recommandation : français par défaut à la racine, anglais sous `/en`.**

| Page | FR (défaut) | EN |
|---|---|---|
| Accueil | `/` | `/en` |
| Projets | `/projects` | `/en/projects` |
| CV + Certifications | `/resume` | `/en/resume` |
| Blog (liste) | `/blog` | `/en/blog` |
| Article | `/blog/[id]` (URL unique, voir 2.6) | pas de doublon |
| Contact / services | `/contact` | `/en/contact` |
| Admin | `/admin` (noindex) | aucune |

Pourquoi :
- **Aucune URL existante ne casse** : `/projects`, `/resume`, `/blog`, `/blog/[id]` restent valides telles quelles (le lien `/blog/<id>` renvoyé par le bot Telegram continue de fonctionner).
- Slugs identiques dans les deux langues (anglais, déjà en place) : moins de redirections, routage plus simple. Des slugs traduits (`/projets`) n'apportent qu'un gain marginal pour un portfolio personnel.
- **Pas de redirection automatique selon la langue du navigateur** (Google le déconseille, et `DESIGN.md` section 9 l'interdit déjà). Le sélecteur FR | EN est un lien réel vers l'URL équivalente.

Règles hreflang (Google Search Central, vérifié le 2026-09-25) :
- Chaque page déclare **toutes** ses versions, **y compris elle-même**, et les déclarations sont **réciproques** (sinon Google les ignore).
- Valeurs : `fr`, `en` (langue seule, pas de région : le public n'est pas ciblé par pays), plus `x-default` vers la version FR (`/`).
- Une seule méthode suffit : balises `<link rel="alternate" hreflang>` générées par `alternates.languages` de l'API Metadata de Next.js.
- `<html lang="fr">` ou `lang="en"` selon la route.
- `canonical` de chaque page = sa propre URL dans sa langue (jamais la version FR sur la page EN).

Alternative à arbitrer (Q1) : si la cible prioritaire est le recrutement international, l'anglais peut devenir la langue par défaut (`/` en EN, `/fr` en FR). Cela impose des redirections pour les URLs actuelles et change `x-default`. Je recommande FR par défaut tant que la cible prioritaire est francophone.

### 2.2 Métadonnées par page

Mise en oeuvre : `metadataBase: https://jack0237.com` dans le layout racine, `title.template` = `%s | Jack0237` (sauf Accueil, title absolu), `metadata` statique ou `generateMetadata` par page. Pour les articles (ISR), `generateMetadata` lit Firestore côté serveur ; Next.js détecte les robots « HTML limités » et leur sert les métadonnées dans le `<head>` initial (option `htmlLimitedBots`) : à vérifier en préproduction avec `curl -A "facebookexternalhit"` et `curl -A "LinkedInBot"`.

Longueurs visées : title 50 à 60 caractères, description 140 à 160.

| Page | Title FR (proposition) | Title EN (proposition) | Description |
|---|---|---|---|
| Accueil | section 3.2 | section 3.2 | section 3.2 |
| Projets | `Projets de Wilfried NGUEGUIM, SaaS et automatisations` | `Wilfried NGUEGUIM projects: SaaS and automations` | Relanceo, automatisations n8n / IA, stack (à rédiger par `content-writer`) |
| CV | `CV de Wilfried NGUEGUIM, développeur full-stack` | `Wilfried NGUEGUIM resume, full-stack developer` | Parcours, compétences, certifications réelles |
| Blog | `Blog de Jack0237 : automatisation, IA et dev web` | `Jack0237 blog: automation, AI and web development` | Thèmes réels des articles |
| Article | `[titre de l'article]` + template | idem | Champ dédié si ajouté (P2), sinon début du contenu sans Markdown, coupé proprement vers 155 caractères |
| Contact | `Contact et services, Wilfried NGUEGUIM` | `Contact and services, Wilfried NGUEGUIM` | Les 3 services du brief, moyen de contact réel |
| Admin | `Admin`, `robots: noindex, nofollow` | | |

Les titles hors Accueil sont des propositions de principe, finalisées par `content-writer` quand chaque page sera conçue.

Titres des articles : ils arrivent en capitales depuis n8n. Pour `<title>` et `og:title`, je recommande une version en casse de phrase calculée au rendu (sans toucher Firestore) : un titre tout en capitales se lit mal dans les résultats. À valider (Q5).

### 2.3 Données structurées (JSON-LD)

Injectées côté serveur (`<script type="application/ld+json">`). Validation avec le Rich Results Test et validator.schema.org avant mise en production. Aucune note, aucun avis, aucun chiffre inventé.

| Schéma | Où | Champs clés | Priorité |
|---|---|---|---|
| `Person` (`@id` `https://jack0237.com/#person`) | Layout racine | `name` « Wilfried NGUEGUIM », `alternateName` « Jack0237 », `jobTitle` (selon la langue), `url`, `image` (portrait), `sameAs` GitHub / LinkedIn / X, `knowsAbout` (stack validée) | P0 |
| `WebSite` (`@id` `https://jack0237.com/#website`) | Accueil | `name` « Jack0237 », `alternateName` « Wilfried NGUEGUIM », `url`, `inLanguage` [`fr`, `en`], `publisher` vers `#person`. Pas de `SearchAction` | P0 |
| `ProfilePage` | Accueil (ou CV, selon la structure finale) | `mainEntity` vers `#person`, `dateModified` = date du build | P1 |
| `BlogPosting` | Chaque article | `headline`, `datePublished` ISO 8601 dérivé de l'identifiant `Date.now()` (pas de la chaîne « 26 MAY 2026 »), `author` vers `#person`, `image`, `inLanguage`, `mainEntityOfPage`, `keywords` (tags) | P0 avec la page Blog |
| `BreadcrumbList` | Pages internes | Accueil > Section > Page | P2 |
| `WebApplication` | Fiche Relanceo | `name`, `applicationCategory` « BusinessApplication », `url` de prod, `creator` vers `#person`, **sans** `aggregateRating` ni `offers` inventés | P2 |

Exemple pour l'Accueil FR (valeurs entre crochets à compléter) :

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://jack0237.com/#person",
      "name": "Wilfried NGUEGUIM",
      "alternateName": "Jack0237",
      "jobTitle": "Développeur full-stack et automatisation IA",
      "url": "https://jack0237.com/",
      "image": "https://jack0237.com/[chemin-du-portrait].jpg",
      "sameAs": [
        "https://github.com/jack0237",
        "https://www.linkedin.com/in/ngueguim-wilfried/",
        "https://x.com/Jason_0237"
      ],
      "knowsAbout": ["[stack validée]"]
    },
    {
      "@type": "WebSite",
      "@id": "https://jack0237.com/#website",
      "name": "Jack0237",
      "alternateName": "Wilfried NGUEGUIM",
      "url": "https://jack0237.com/",
      "inLanguage": ["fr", "en"],
      "publisher": { "@id": "https://jack0237.com/#person" }
    },
    {
      "@type": "ProfilePage",
      "url": "https://jack0237.com/",
      "inLanguage": "fr",
      "mainEntity": { "@id": "https://jack0237.com/#person" },
      "dateModified": "[date du build ISO 8601]"
    }
  ]
}
```

Le compte X s'appelle « Jason_0237 » : le relier au même `Person` n'est correct que s'il s'agit bien du même titulaire (Q6).

### 2.4 Sitemap et robots

- `app/sitemap.ts` : pages FR et EN avec `alternates.languages` ; articles lus dans Firestore (`blogs`) avec `lastModified` dérivé de l'identifiant. Même période de revalidation que le blog, pour que les articles publiés par n8n y entrent sans rebuild.
- `app/robots.ts` : tout autorisé, ligne `Sitemap: https://jack0237.com/sitemap.xml`. **Ne pas bloquer `/admin` dans robots.txt** : le blocage empêche Google de lire le `noindex`. `/admin` est protégé par `noindex` et par l'authentification Firebase.
- Vraies 404 : `notFound()` pour un article inexistant, page `not-found` bilingue (HTTP 404), à la place de la redirection actuelle vers `/`.

### 2.5 Images Open Graph

| Page | Image | Méthode |
|---|---|---|
| Accueil FR / EN | Asset n° 9 de `DESIGN.md`, 1200 x 630, une version par langue | Fichier `opengraph-image.png` statique par segment de langue |
| Projets, CV, Contact, Blog | Même gabarit, titre de la page | Statique ou `opengraph-image.tsx` (`next/og`) |
| Article | Titre de l'article + visuel de l'article si `image` est une URL valide, sinon visuel de repli n° 8 | `opengraph-image.tsx` généré puis mis en cache |

Balises par page : `og:title`, `og:description`, `og:url` (= canonical), `og:image` (+ dimensions et `alt`), `og:type` (`website`, ou `article` + `article:published_time`), `og:locale` (`fr_FR` / `en_US`) + `og:locale:alternate`, `twitter:card` = `summary_large_image`, `twitter:creator` = `@Jason_0237` si validé (Q6). Mona Sans embarquée dans la génération des images OG.

### 2.6 Blog : sous-domaine ou chemin

**Recommandation : URL canonique `jack0237.com/blog/[id]`, et `blog.jack0237.com` redirigé en 301 / 308.**

| Option | Pour | Contre |
|---|---|---|
| **A. `/blog` canonique, sous-domaine redirigé** (recommandé) | Un seul hôte ; le blog renforce directement le domaine du portfolio ; plus de doublon ; `blog.jack0237.com` continue de mener au bon contenu | Le sous-domaine n'est plus l'adresse affichée |
| B. Sous-domaine servi par réécriture + `canonical` vers `/blog/[id]` | Aucune URL visible ne change | Deux URLs indexables par article ; la canonical n'est qu'un indice pour Google |
| C. Sous-domaine canonique | Séparation nette | Divise les signaux entre deux hôtes |

Redirections (option A) : `blog.jack0237.com/` vers `jack0237.com/blog`, `blog.jack0237.com/<id>` vers `jack0237.com/blog/<id>` (`redirects` avec condition `has: host` dans `next.config`, ou middleware). **Le workflow n8n n'est pas modifié** : il écrit toujours dans Firestore, et le lien du bot Telegram mène au bon article.

Langue des articles : ils sont en anglais aujourd'hui. **Une seule URL par article** (`/blog/[id]`, pas de `/en/blog/[id]`), `lang` de la page = langue de l'article, pas de hreflang tant qu'un article n'a qu'une langue. `/blog` et `/en/blog` listent les mêmes URLs avec le badge de langue prévu par DESIGN.

Slugs (P2) : champ facultatif `slug` écrit par n8n, puis route `/blog/[id]/[slug]` dont la forme courte redirige. Seulement lors d'une évolution volontaire du workflow : `/blog/[id]` doit toujours fonctionner.

### 2.7 Redirections depuis les URLs actuelles

| Ancienne URL | Nouvelle URL | Code | Remarque |
|---|---|---|---|
| `/`, `/projects`, `/resume`, `/blog`, `/blog/[id]` | inchangées | 200 | Aucune redirection |
| `/certifications` | `/resume#certifications` | 308 (`permanent: true` dans Next.js, traité comme un 301 par Google) | Si CV et certifications fusionnent, comme le prévoit le brief |
| `blog.jack0237.com/` | `https://jack0237.com/blog` | 308 | Option A |
| `blog.jack0237.com/[id]` | `https://jack0237.com/blog/[id]` | 308 | Option A |
| `www.jack0237.com/*` | `https://jack0237.com/*` | 308 | DNS `www` à créer + domaine ajouté dans Vercel |
| `http://*` | `https://*` | 308 | Déjà en place |
| URL inconnue | page 404 | 404 | Remplace la redirection client vers `/` |

### 2.8 Core Web Vitals et ambiance cinématique

Les budgets de `DESIGN.md` section 10 (LCP ≤ 2,5 s mobile, CLS ≤ 0,05, INP ≤ 200 ms) sont adaptés. Points SEO en plus :

1. **LCP = mot géant (texte)**. L'animation d'entrée (masque, 1 200 ms) ne doit pas partir d'un état invisible posé par le JS, sinon le LCP est repoussé à la fin de l'animation. État final dans le HTML et le CSS initiaux (règle DESIGN 6.1). À mesurer : LCP avec et sans animation d'entrée, en 4G simulée.
2. **Tout le contenu indexable est dans le HTML serveur** : les 3 derniers articles et le texte des cartes d'automatisation du carrousel compris. Rien de chargé seulement au scroll.
3. **Pas de texte masqué** en attente d'animation (ni `display: none`, ni `visibility: hidden`).
4. **CLS** : hauteur réservée pour le mot géant, `size-adjust` sur la police de repli, dimensions sur toutes les images, bandes en `transform`.
5. **INP** : GSAP, Lenis et shader chargés après le premier affichage ; sélecteur de langue en lien simple, sans JS.
6. **Pas de SDK Firebase client sur les pages publiques**.
7. Mesure : Lighthouse et WebPageTest en préproduction (`ux-qa-auditor`), puis données terrain dans Search Console.

### 2.9 Actions priorisées

**P0 (bloquant pour la mise en ligne de la nouvelle Accueil)**

| # | Action | Impact attendu | Responsable |
|---|---|---|---|
| P0-1 | Supprimer toute trace du template (meta S0umyajit, `soumyajit.vercel.app`, image tierce, manifest « React App ») ; métadonnées propres par page (title, description, canonical, OG, Twitter) | Partages sociaux sous la bonne identité ; titres pertinents dans Google | `frontend-developer` |
| P0-2 | Rendu serveur de l'Accueil, un seul H1 « Wilfried NGUEGUIM », un H2 par scène (section 3.3) | Nom et métier lisibles par tous les robots dès le HTML | `frontend-developer` |
| P0-3 | `/` + `/en`, hreflang réciproques + `x-default`, `lang` correct, sélecteur en liens réels | Chaque langue indexée, sans doublon | `frontend-developer` |
| P0-4 | JSON-LD `Person` + `WebSite` validés | Aide Google à relier nom, pseudo et profils (panneau d'entité possible, jamais garanti) | `frontend-developer` |
| P0-5 | Sitemap dynamique, robots.txt propre, vraies 404, `noindex` sur `/admin` | Découverte rapide des pages et articles, fin des soft 404 | `frontend-developer` |
| P0-6 | Image OG de l'Accueil FR et EN (asset n° 9) | Aperçu soigné sur LinkedIn, X, Slack | `visual-asset-curator` |
| P0-7 | Après bascule : Google Search Console (propriété de domaine) et Bing Webmaster Tools, envoi du sitemap | Indexation rapide, suivi des requêtes réelles | Utilisateur |

Si la bascule Next.js prend plus de 2 ou 3 semaines : correctif immédiat des meta de `public/index.html` sur le site CRA actuel (Q8).

**P1**
- Redirection `www` vers l'apex.
- Blog : sous-domaine redirigé, `BlogPosting`, OG par article, `generateMetadata` depuis Firestore.
- `ProfilePage`.
- Maillage interne : Accueil vers Projets, Services, Blog ; chaque article vers Projets et Contact ; ancres descriptives (« Voir Relanceo », jamais « cliquez ici »).
- `alt` descriptifs et bilingues (« Portrait de Wilfried NGUEGUIM » / « Portrait of Wilfried NGUEGUIM »).
- Lighthouse avant (CRA) et après (préproduction).
- Renseigner `https://jack0237.com` dans les profils GitHub, LinkedIn et X (réciprocité des `sameAs`).

**P2**
- Slugs et `metaDescription` écrits par n8n (évolution volontaire du workflow, Q4).
- Titles d'articles en casse de phrase (Q5).
- `BreadcrumbList`, `WebApplication` pour Relanceo.
- Revalidation à la demande en fin de workflow n8n.
- Articles bilingues (champ `lang`, hreflang entre traductions).
- Contenus de niche : études de cas des automatisations, articles « comment j'ai automatisé X avec n8n ».

---

## 3. Page d'Accueil : spécifications SEO

### 3.1 Requêtes cibles

Aucun volume n'est connu à ce jour : la hiérarchie ci-dessous repose sur l'intention, pas sur des chiffres. Search Console dira après quelques semaines quelles requêtes amènent réellement des visiteurs.

| Groupe | Requêtes FR | Requêtes EN | Rôle de l'Accueil |
|---|---|---|---|
| **Marque, nom** (priorité 1, objectif : première position) | « Wilfried NGUEGUIM », « NGUEGUIM Wilfried », « Wilfried NGUEGUIM développeur » | « Wilfried NGUEGUIM », « Wilfried NGUEGUIM developer » | Page cible principale. Le nom figure dans le title, le H1, la description, le JSON-LD, l'`alt` du portrait |
| **Marque, pseudo** (priorité 1) | « Jack0237 », « jack0237 portfolio » | « Jack0237 » | Pseudo dans la description, la signature visible, `alternateName`, le logo texte de la navbar (texte réel, pas une image) |
| **Métier** (priorité 2, concurrence forte, visée à moyen terme) | « développeur full-stack », « développeur full-stack freelance », « développeur React Next.js » | « full-stack developer », « freelance full-stack developer », « React Next.js developer » | Présent dans le title et le texte ; le positionnement se gagnera plutôt par la page Projets et le blog |
| **Niche automatisation** (priorité 2, meilleure chance hors marque) | « développeur n8n », « freelance n8n », « automatisation n8n », « automatisation IA pour TPE », « expert automatisation n8n IA » | « n8n developer », « n8n freelancer », « n8n automation expert », « AI automation developer » | Scène Services (carte 03) et scène Projets (automatisations) ; renfort par les articles de blog |
| **Produit** (priorité 3) | « Relanceo », « logiciel relance factures TPE » | « Relanceo » | Mention sur l'Accueil ; la page cible sera la fiche projet (ou le site de Relanceo) |

Un modificateur géographique (« développeur n8n [ville] ») peut devenir très efficace pour la clientèle freelance : dépend de la ville que l'utilisateur accepte d'afficher (Q3).

### 3.2 Title et meta description

| | FR (`/`) | EN (`/en`) |
|---|---|---|
| **Title** (recommandé) | `Wilfried NGUEGUIM \| Dev full-stack & automatisation IA` (54 caractères) | `Wilfried NGUEGUIM \| Full-stack & AI automation developer` (56 caractères) |
| Title (variante avec pseudo) | `Wilfried NGUEGUIM (Jack0237), dev full-stack et IA` (50 caractères) | `Wilfried NGUEGUIM (Jack0237), full-stack and AI dev` (51 caractères) |
| **Meta description** | `Wilfried NGUEGUIM (Jack0237), développeur full-stack : sites, applis web et mobiles, automatisations n8n et IA. Projets en production, blog et contact.` (151 caractères) | `Wilfried NGUEGUIM (Jack0237), full-stack developer: websites, web and mobile apps, n8n and AI automations. Live projects, blog and contact details.` (147 caractères) |
| `og:title` | identique au title | identique au title |
| `og:description` | version courte possible : `Dev full-stack et automatisation n8n / IA. Projets, services et blog.` | `Full-stack developer and n8n / AI automation. Projects, services and blog.` |

Le title recommandé met le nom en tête (requête n° 1) et reprend mot pour mot le titre validé du brief. Le pseudo passe dans la description, où il reste visible dans les résultats. Pas de `\| Jack0237` en suffixe sur l'Accueil (title absolu), pour ne pas dépasser 60 caractères.

Si `content-writer` ajuste la phrase de valeur, la description peut en reprendre l'idée, en gardant le nom, « Jack0237 », « full-stack » et « n8n » dans les 120 premiers caractères.

### 3.3 Structure des titres (alignée sur les 6 scènes de `DESIGN.md`)

Règle : **un seul H1**, un H2 par scène, H3 pour les éléments (projets, services, articles). Les étiquettes mono (« ÉTAPE 02 · PROJETS ») sont du texte décoratif, pas des titres (`<p>` ou `<span>`). Les noms narratifs internes (« L'expédition », « Le journal de bord ») ne servent pas de titres.

| Scène | Balise | FR | EN |
|---|---|---|---|
| 01 Hero | **H1** | `Wilfried NGUEGUIM` (prénom en italique serif, NGUEGUIM géant, dans le même H1) | identique |
| 01 Hero | `<p>` juste après le H1 | `Dev full-stack & automatisation IA` | `Full-stack & AI automation developer` |
| 02 Projets | H2 | `Projets` | `Projects` |
| 02 | H3 | `Relanceo` | `Relanceo` |
| 02 | H3 (sous-bloc) | `Automatisations n8n / IA` (titre de la partie B, en H3 car sous « Projets ») | `n8n / AI automations` |
| 02 | H4 | nom de chaque automatisation | idem |
| 03 Services | H2 | `Services` | `Services` |
| 03 | H3 x 3 | `Sites et applis web`, `Applis mobiles`, `Automatisations n8n / IA` | `Websites and web apps`, `Mobile apps`, `n8n / AI automations` |
| 04 Stack | H2 | `Stack` | `Stack` |
| 04 | H3 (groupes, facultatif) | `Front`, `Back`, `Mobile`, `Automatisation / IA`, `Infra` | `Front end`, `Back end`, `Mobile`, `Automation / AI`, `Infra` |
| 05 Blog | H2 | `Blog` | `Blog` |
| 05 | H3 x 3 | titre de chaque article (avec `lang` de l'article) | idem |
| 06 Appel final | H2 | `Contact` (étiquette visible de la scène, à styler en titre de scène) ou l'invitation elle-même si le design préfère | `Contact` |

Pourquoi le titre de métier hors du H1 : un H1 court et identique dans les deux langues donne un signal très net sur le nom, et le métier est déjà porté par le title, la description et le texte adjacent. Mettre le métier dans le H1 est acceptable aussi (léger gain sur « développeur full-stack », au prix d'un H1 long et traduit) : je recommande la version courte.

Scène 06 : `DESIGN.md` ne prévoit pas de titre de scène visible. Il faut **un H2 visible** (pas de titre caché pour les seuls robots). Deux solutions : l'étiquette « CONTACT » stylée comme titre de scène, ou l'invitation en italique serif balisée en H2. À arbitrer entre `design-director` et `content-writer`.

### 3.4 Consignes mots-clés par scène (pour `content-writer`)

Règles générales : écrire pour le recruteur et le client d'abord ; chaque mot-clé apparaît naturellement, une à deux fois par scène au plus ; aucun bourrage, aucun texte caché ; aucun chiffre, client ou résultat inventé ; aucun tiret cadratin. Les deux langues sont rédigées, pas traduites mot à mot : l'EN utilise les formulations que tape un recruteur anglophone (« full-stack developer », « n8n developer »).

| Scène | Mots-clés à placer | Où | À éviter |
|---|---|---|---|
| 01 Hero | Wilfried NGUEGUIM, Jack0237, développeur full-stack / full-stack developer, automatisation IA, n8n | Phrase de valeur : citer ce que tu construis (sites, applis, automatisations n8n et IA) et pour qui. Signature « Jack0237 » en texte réel. `alt` du portrait : « Portrait de Wilfried NGUEGUIM » | Formules creuses (« passionné par le code »), jargon d'expédition dans l'information clé |
| 02 Projets | Relanceo, SaaS, relance de factures, TPE, n8n, automatisation, IA, noms réels des outils (Gemini, Firestore...) | « Le problème » : vocabulaire du client (« relancer les factures impayées », « TPE ») ; « Ce que ça fait » : verbes concrets ; cartes d'automatisation : ce qui est automatisé, avec quel déclencheur et quelle sortie, en une phrase ; `aria-label` des schémas descriptif | Le nom du client d'Ad Studio nulle part, ni dans le texte, ni dans `alt`, ni dans les métadonnées ; tout chiffre de résultat non fourni |
| 03 Services | création de site web, application web, application mobile, automatisation n8n, automatisation IA, développeur freelance (si l'utilisateur est ouvert au freelance) | H3 des cartes (voir 3.3) ; 2 lignes par carte : pour qui et quel résultat ; lien « Voir les services et me contacter » (ancre descriptive) | Tarifs, délais ou garanties non fournis ; icônes et adjectifs génériques |
| 04 Stack | Noms exacts des outils validés (React, Next.js, Node.js, Firebase, PostgreSQL, Supabase, Expo / React Native, Flutter, n8n, API Gemini, Docker, Traefik : liste à valider) | Nom de chaque outil en texte (`aria-label` ou libellé visible), pas seulement le logo ; étiquettes de groupe | Barres ou pourcentages de maîtrise ; outils jamais utilisés |
| 05 Blog | Titres réels des articles ; accroche italique qui dit de quoi parle le blog (automatisation, IA, dev web) | Accroche de scène ; lien « Tout le blog » | Réécrire les titres des articles (ils viennent de Firestore) |
| 06 Appel final | recruter / embaucher, mission freelance, projet, contact, CV (selon la disponibilité réelle validée) | Invitation : dire clairement ce que le visiteur peut proposer (CDI, mission, projet) ; bouton « Télécharger mon CV » avec le nom de fichier explicite (`CV-Wilfried-NGUEGUIM.pdf` recommandé plutôt que `RN_CV_NGUEGUIM_WILFRIED.pdf`) | Promesse de disponibilité non confirmée |

Libellés de liens : toujours descriptifs et distincts (« Voir Relanceo en ligne », « Tous les projets », « Lire l'article : [titre] » en libellé accessible), pour le maillage interne et l'accessibilité.

---

## 4. Questions ouvertes pour l'utilisateur

1. **Langue par défaut** : français à la racine et anglais sous `/en` (recommandé), ou anglais par défaut si le recrutement international est la priorité ?
2. **Blog** : acceptez-vous que `blog.jack0237.com` redirige vers `jack0237.com/blog` (recommandé, le sous-domaine continue de fonctionner), ou tenez-vous à ce que le sous-domaine reste l'adresse affichée ?
3. **Ville** à afficher (métadonnées du hero, requêtes locales type « développeur n8n [ville] ») : laquelle, ou aucune ?
4. **Workflow n8n** : êtes-vous d'accord pour le faire évoluer plus tard (champ `slug`, `metaDescription`, `lang`, appel de revalidation), ou doit-il rester strictement tel quel ?
5. **Titres d'articles** : les afficher en casse de phrase dans les résultats Google et les aperçus sociaux (recommandé), tout en gardant les capitales à l'écran ?
6. **Compte X `Jason_0237`** : est-ce bien votre compte, à relier à votre identité (`sameAs`, `twitter:creator`) ?
7. **Disponibilité** : recherchez-vous un CDI, des missions freelance, ou les deux ? Cela change les mots-clés des scènes 03 et 06.
8. **Correctif immédiat** : voulez-vous que je corrige dès maintenant les meta du site CRA actuel (`public/index.html`, qui affiche encore « S0umyajit ») en attendant la bascule Next.js ?
9. **Accès** : avez-vous déjà Google Search Console sur `jack0237.com` ? Sinon, il faudra valider le domaine (enregistrement DNS) au moment de la bascule.
10. **`www`** : voulez-vous créer l'enregistrement DNS `www` (redirigé vers `jack0237.com`) ?

---

## 5. Sources consultées

- Google Search Central, « Tell Google about localized versions of your page » (hreflang, réciprocité, `x-default`, pas de redirection automatique), consulté le 2026-09-25 : https://developers.google.com/search/docs/specialty/international/localized-versions
- Next.js, `generateMetadata` et champs `metadataBase`, `alternates`, métadonnées en streaming et `htmlLimitedBots` (doc 16.3), consulté le 2026-09-25 : https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- À revérifier au moment de l'implémentation : conventions de fichiers `sitemap`, `robots`, `opengraph-image` (https://nextjs.org/docs/app/api-reference/file-conventions/metadata), données structurées `ProfilePage` et `Article` de Google (https://developers.google.com/search/docs/appearance/structured-data/profile-page, https://developers.google.com/search/docs/appearance/structured-data/article), Core Web Vitals (https://web.dev/articles/vitals).
