// Textes publics FR / EN, repris de docs/CONTENT.md (validé le 2026-09-25).
// Règle : aucun tiret cadratin, aucune donnée inventée. Les capitales sont appliquées en CSS.
import type { Locale } from "@/lib/site";

export type FlowCard = {
  id: string;
  fig: string;
  name: string;
  description: string;
  note?: string;
  stack: string[];
  diagramLabel: string;
  steps: string[];
  voice?: string;
};

const fr = {
  locale: "fr" as Locale,
  global: { skip: "Aller au contenu" },
  meta: {
    title: "Wilfried NGUEGUIM | Dev full-stack & automatisation IA",
    description:
      "Wilfried NGUEGUIM (Jack0237), développeur full-stack : sites, applis web et mobiles, automatisations n8n et IA. Projets en production, blog et contact.",
    ogDescription: "Dev full-stack et automatisation n8n / IA. Projets, services et blog.",
    ogAlt: "Wilfried NGUEGUIM, dev full-stack et automatisation IA",
    jobTitle: "Développeur full-stack et automatisation IA",
    ogLocale: "fr_FR",
  },
  nav: {
    label: "Navigation principale",
    logoAria: "Jack0237, retour à l'accueil",
    projects: "Projets",
    resume: "CV",
    blog: "Blog",
    contact: "Contact",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    menuDialog: "Menu",
  },
  lang: { group: "Langue du site" },
  contactTab: "Me contacter",
  newTab: "nouvel onglet",
  footer: {
    title: "Dev full-stack & automatisation IA",
    pages: "Pages",
    profiles: "Profils",
    contact: "Contact",
    cv: "Télécharger mon CV",
    updated: "Mise à jour :",
    top: "Haut",
    topAria: "Revenir en haut de la page",
  },
  motion: {
    label: "Réduire les animations",
    hint: "Par défaut, le site suit le réglage de votre appareil.",
    system: "Votre appareil demande déjà moins d'animations.",
  },
  home: {
    steps: ["Étape 01", "Étape 02 · Projets", "Étape 03 · Services", "Étape 04 · Stack", "Étape 05 · Blog", "Étape 06 · Contact"],
    hero: {
      firstName: "Wilfried",
      lastName: "NGUEGUIM",
      title: "Dev full-stack & automatisation IA",
      value:
        "Je construis des applis web et mobiles, et des automatisations n8n et IA. Ce que je livre tourne en production.",
      signature: "alias Jack0237",
      ctaProjects: "Voir mes projets",
      ctaContact: "Me contacter",
      portraitAlt: "Portrait de Wilfried NGUEGUIM",
    },
    projects: {
      title: "Projets",
      relanceo: {
        fig: "Fig. 01 · SaaS · En production",
        name: "Relanceo",
        subtitle:
          "Le suivi des factures et la relance des impayés, pour les TPE et les indépendants.",
        problemLabel: "Le problème",
        problem:
          "Relancer un client qui tarde à payer prend du temps et finit souvent par passer à la trappe. Pour une TPE ou un indépendant, chaque retard pèse directement sur la trésorerie.",
        doesLabel: "Ce que ça fait",
        does: [
          "Suit chaque facture et envoie les relances par e-mail au bon moment, au nom de l'entreprise.",
          "Arrête les relances dès qu'une facture est marquée payée.",
          "Permet de travailler à plusieurs sur un même compte, avec invitations et rôles.",
        ],
        stackLabel: "Stack",
        stack: ["React", "TypeScript", "Node.js", "Fastify", "PostgreSQL", "Docker"],
        voice:
          "« Mon premier produit conçu pour des clients extérieurs. Une règle que je ne négocie pas : aucune relance ne part après un paiement. »",
        cta: "Voir Relanceo en ligne",
        ctaAria: "Voir Relanceo en ligne (nouvel onglet)",
      },
      automations: {
        title: "Automatisations n8n / IA",
        carouselLabel: "Automatisations n8n et IA",
        prev: "Automatisation précédente",
        next: "Automatisation suivante",
        cards: [
          {
            id: "blog",
            fig: "Fig. 02 · n8n · IA · Firebase",
            name: "Blog automatique",
            description:
              "J'envoie un sujet à un bot Telegram. Gemini rédige l'article, le workflow l'enregistre dans Firestore, le blog de ce site l'affiche, et le bot me renvoie le lien.",
            note: "Les articles de la scène Blog, plus bas, arrivent par ce chemin.",
            stack: ["n8n", "Gemini", "Firestore", "Telegram"],
            diagramLabel:
              "Message Telegram, rédaction par Gemini, enregistrement dans Firestore, confirmation avec le lien de l'article.",
            steps: ["Telegram", "Gemini", "Firestore", "Lien"],
          },
          {
            id: "manga",
            fig: "Fig. 03 · n8n · IA · Vidéo",
            name: "Recaps manga en vidéo",
            description:
              "J'envoie le titre d'un manga et un chapitre sur Telegram. Le workflow récupère les pages, fait écrire le script par Gemini, génère la voix off, puis monte une vidéo verticale sous-titrée qu'il me renvoie, prête pour TikTok.",
            stack: ["n8n", "Gemini", "ElevenLabs", "Whisper", "FFmpeg", "Python"],
            diagramLabel:
              "Message Telegram, récupération des pages, script écrit par Gemini, voix off, montage vidéo, envoi de la vidéo sur Telegram.",
            steps: ["Telegram", "Pages", "Gemini", "Voix off", "Montage", "Vidéo"],
            voice:
              "« L'IA a été la partie rapide. Faire passer la vidéo sous la taille limite de Telegram a pris plus longtemps. »",
          },
          {
            id: "flux",
            fig: "Fig. 04 · n8n · IA · API",
            name: "Pipeline éditorial Flux",
            description:
              "Chaque matin, le workflow lit une sélection de flux RSS, écarte les doublons et fait rédiger un résumé court par Gemini. Chaque carte m'arrive sur Telegram avec deux boutons, publier ou rejeter : rien n'est publié sans validation humaine.",
            note: "Pour Flux, une appli mobile de culture générale en cours de développement.",
            stack: ["n8n", "Gemini", "Telegram", "Fastify", "PostgreSQL"],
            diagramLabel:
              "Déclenchement chaque matin, lecture des flux RSS, suppression des doublons, résumé par Gemini, validation sur Telegram, publication via l'API.",
            steps: ["Chaque matin", "RSS", "Doublons", "Gemini", "Validation", "API"],
          },
        ] as FlowCard[],
        all: "Tous les projets",
      },
    },
    services: {
      title: "Services",
      voice: "« Dites-moi ce qui vous ralentit, on part de là. »",
      cards: [
        {
          title: "Sites et applis web",
          text: "Un site rapide ou une application métier sur mesure, en ligne et facile à faire évoluer. De la maquette au déploiement.",
          stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
        },
        {
          title: "Applis mobiles",
          text: "Une appli iOS et Android à partir d'une seule base de code, reliée à votre back-office ou à votre API.",
          stack: ["React Native", "Expo", "Flutter"],
        },
        {
          title: "Automatisations n8n / IA",
          text: "Les tâches répétitives confiées à un workflow n8n, avec de l'IA quand elle apporte vraiment quelque chose et une validation humaine là où il en faut.",
          stack: ["n8n", "Gemini", "Claude", "Telegram"],
        },
      ],
      cta: "Discuter d'une mission",
    },
    stack: {
      title: "Stack",
      intro: "Les outils derrière les projets de cette page.",
      groups: [
        { label: "Front", aria: "Outils front-end", tools: ["react"] },
        { label: "Back", aria: "Outils back-end", tools: ["nodejs", "express", "postgresql"] },
        { label: "Mobile", aria: "Outils mobiles", tools: ["expo", "flutter"] },
        { label: "Automatisation / IA", aria: "Outils d'automatisation et d'IA", tools: ["n8n", "gemini"] },
        { label: "Infra", aria: "Outils d'infrastructure", tools: ["docker", "traefik", "firebase", "supabase"] },
      ],
      gemini: "API Gemini",
    },
    blog: {
      title: "Blog",
      voice: "« Mon journal de bord : automatisation, IA et développement web. »",
      minRead: "min de lecture",
      read: "Lire",
      readAria: "Lire l'article :",
      otherLangBadge: "EN",
      otherLangAria: "Article en anglais",
      all: "Tout le blog",
      empty: "« Le journal de bord s'ouvre bientôt. Les premiers articles arrivent. »",
      emptyLink: "Aller au blog",
    },
    contact: {
      title: "Parlons-en",
      voice: "« Un poste à pourvoir, une mission ou un projet à lancer ? Racontez-moi. »",
      cta: "Me contacter",
      cv: "Télécharger mon CV",
      cvAria: "Télécharger mon CV (PDF)",
      signature: "Jack0237",
    },
  },
  notFound: {
    title: "Page introuvable",
    text: "Cette page n'existe pas, ou plus.",
    back: "Retour à l'accueil",
  },
};

export type Dictionary = typeof fr;

const en: Dictionary = {
  locale: "en",
  global: { skip: "Skip to content" },
  meta: {
    title: "Wilfried NGUEGUIM | Full-stack & AI automation developer",
    description:
      "Wilfried NGUEGUIM (Jack0237), full-stack developer: websites, web and mobile apps, n8n and AI automations. Live projects, blog and contact details.",
    ogDescription: "Full-stack developer and n8n / AI automation. Projects, services and blog.",
    ogAlt: "Wilfried NGUEGUIM, full-stack and AI automation developer",
    jobTitle: "Full-stack and AI automation developer",
    ogLocale: "en_US",
  },
  nav: {
    label: "Main navigation",
    logoAria: "Jack0237, back to home",
    projects: "Projects",
    resume: "Resume",
    blog: "Blog",
    contact: "Contact",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuDialog: "Menu",
  },
  lang: { group: "Site language" },
  contactTab: "Contact me",
  newTab: "opens in a new tab",
  footer: {
    title: "Full-stack & AI automation developer",
    pages: "Pages",
    profiles: "Profiles",
    contact: "Contact",
    cv: "Download my resume (in French)",
    updated: "Updated:",
    top: "Top",
    topAria: "Back to top of page",
  },
  motion: {
    label: "Reduce motion",
    hint: "By default, the site follows your device setting.",
    system: "Your device already asks for less motion.",
  },
  home: {
    steps: ["Step 01", "Step 02 · Projects", "Step 03 · Services", "Step 04 · Stack", "Step 05 · Blog", "Step 06 · Contact"],
    hero: {
      firstName: "Wilfried",
      lastName: "NGUEGUIM",
      title: "Full-stack & AI automation developer",
      value: "I build web and mobile apps, and n8n and AI automations. What I ship runs in production.",
      signature: "aka Jack0237",
      ctaProjects: "See my projects",
      ctaContact: "Contact me",
      portraitAlt: "Portrait of Wilfried NGUEGUIM",
    },
    projects: {
      title: "Projects",
      relanceo: {
        fig: "Fig. 01 · SaaS · Live",
        name: "Relanceo",
        subtitle: "Invoice tracking and late-payment reminders for small businesses and freelancers.",
        problemLabel: "The problem",
        problem:
          "Chasing a client who pays late takes time, and it is easy to let it slide. For a small business or a freelancer, every late invoice hits cash flow directly.",
        doesLabel: "What it does",
        does: [
          "Tracks every invoice and sends email reminders at the right time, under the company's own name.",
          "Stops reminders as soon as an invoice is marked as paid.",
          "Lets a whole team share one account, with invitations and roles.",
        ],
        stackLabel: "Stack",
        stack: ["React", "TypeScript", "Node.js", "Fastify", "PostgreSQL", "Docker"],
        voice:
          "“My first product built for outside customers. One rule I never bend: no reminder goes out once an invoice is paid.”",
        cta: "See Relanceo live",
        ctaAria: "See Relanceo live (opens in a new tab)",
      },
      automations: {
        title: "n8n / AI automations",
        carouselLabel: "n8n and AI automations",
        prev: "Previous automation",
        next: "Next automation",
        cards: [
          {
            id: "blog",
            fig: "Fig. 02 · n8n · AI · Firebase",
            name: "Self-publishing blog",
            description:
              "I send a topic to a Telegram bot. Gemini writes the article, the workflow saves it to Firestore, this site's blog displays it, and the bot replies with the link.",
            note: "The posts in the Blog section below come in this way.",
            stack: ["n8n", "Gemini", "Firestore", "Telegram"],
            diagramLabel:
              "Telegram message, article written by Gemini, saved to Firestore, confirmation with the article link.",
            steps: ["Telegram", "Gemini", "Firestore", "Link"],
          },
          {
            id: "manga",
            fig: "Fig. 03 · n8n · AI · Video",
            name: "Manga recap videos",
            description:
              "I send a manga title and a chapter number on Telegram. The workflow fetches the pages, has Gemini write the script, generates the voice-over, then edits a subtitled vertical video and sends it back, ready for TikTok.",
            stack: ["n8n", "Gemini", "ElevenLabs", "Whisper", "FFmpeg", "Python"],
            diagramLabel:
              "Telegram message, page retrieval, script written by Gemini, voice-over, video editing, video sent back on Telegram.",
            steps: ["Telegram", "Pages", "Gemini", "Voice-over", "Editing", "Video"],
            voice:
              "“The AI part was quick. Keeping the video under Telegram's file size limit took longer.”",
          },
          {
            id: "flux",
            fig: "Fig. 04 · n8n · AI · API",
            name: "Flux editorial pipeline",
            description:
              "Every morning, the workflow reads a set of RSS feeds, drops duplicates and has Gemini draft a short summary. Each card reaches me on Telegram with two buttons, publish or reject, so nothing goes live without a human check.",
            note: "Built for Flux, a general-knowledge mobile app currently in development.",
            stack: ["n8n", "Gemini", "Telegram", "Fastify", "PostgreSQL"],
            diagramLabel:
              "Daily morning trigger, RSS feeds read, duplicates removed, summary by Gemini, approval on Telegram, publication through the API.",
            steps: ["Every morning", "RSS", "Duplicates", "Gemini", "Approval", "API"],
          },
        ],
        all: "All projects",
      },
    },
    services: {
      title: "Services",
      voice: "“Tell me what slows you down. We start there.”",
      cards: [
        {
          title: "Websites and web apps",
          text: "A fast website or a custom business app, live and easy to extend. From mockup to deployment.",
          stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
        },
        {
          title: "Mobile apps",
          text: "One codebase for an iOS and Android app, connected to your back office or API.",
          stack: ["React Native", "Expo", "Flutter"],
        },
        {
          title: "n8n / AI automations",
          text: "Repetitive tasks handed over to an n8n workflow, with AI where it actually helps and a human check where one is needed.",
          stack: ["n8n", "Gemini", "Claude", "Telegram"],
        },
      ],
      cta: "Discuss a freelance project",
    },
    stack: {
      title: "Stack",
      intro: "The tools behind the projects on this page.",
      groups: [
        { label: "Front end", aria: "Front-end tools", tools: ["react"] },
        { label: "Back end", aria: "Back-end tools", tools: ["nodejs", "express", "postgresql"] },
        { label: "Mobile", aria: "Mobile tools", tools: ["expo", "flutter"] },
        { label: "Automation / AI", aria: "Automation and AI tools", tools: ["n8n", "gemini"] },
        { label: "Infra", aria: "Infrastructure tools", tools: ["docker", "traefik", "firebase", "supabase"] },
      ],
      gemini: "Gemini API",
    },
    blog: {
      title: "Blog",
      voice: "“My logbook: automation, AI and web development.”",
      minRead: "min read",
      read: "Read",
      readAria: "Read the article:",
      otherLangBadge: "FR",
      otherLangAria: "Article in French",
      all: "All blog posts",
      empty: "“The logbook opens soon. The first posts are on their way.”",
      emptyLink: "Go to the blog",
    },
    contact: {
      title: "Let's talk",
      voice: "“A role to fill, a freelance job or a product to launch? Tell me about it.”",
      cta: "Contact me",
      cv: "Download my resume (in French)",
      cvAria: "Download my resume (PDF, in French)",
      signature: "Jack0237",
    },
  },
  notFound: {
    title: "Page not found",
    text: "This page does not exist, or no longer does.",
    back: "Back to home",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { fr, en };
export const getDictionary = (locale: Locale) => dictionaries[locale];
