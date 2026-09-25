---
name: portfolio-team
description: Orchestre l'équipe de sous-agents du portfolio (design-director, visual-asset-curator, seo-strategist, content-writer, frontend-developer, ux-qa-auditor) pour concevoir, refondre ou mettre à jour le site jack0237.com et son blog, avec validation utilisateur entre les phases. Invoquer avec /portfolio-team pour lancer ou faire avancer le pipeline, ou /portfolio-team <phase> pour cibler une phase (audit, design, assets, seo, content, dev, qa).
---

Ce skill fait avancer le portfolio à travers un pipeline design → contenu → développement → QA, un rôle à la fois, en s'arrêtant pour validation humaine sur les décisions subjectives ou irréversibles.

Chemin du projet : `C:\Users\Wilfreid\Documents\GitHub\Portfolio`. Donne toujours ce chemin absolu dans le prompt de délégation.

## Séquence

1. **Audit initial** (si `docs/DESIGN.md` et `docs/SEO.md` n'existent pas) : invoque en parallèle `design-director` (audit UI/UX de l'existant) et `seo-strategist` (audit SEO). Présente à l'utilisateur une synthèse commune : forces, problèmes majeurs, options de direction, décision d'architecture éventuelle (garder CRA ou migrer). **Attends sa validation.**
2. **Design** : `design-director` finalise `docs/DESIGN.md` avec le brief visuel. **Présente la direction (tokens, références, wireframes clés) et attends la validation explicite** avant toute production.
3. **Assets et contenu** (en parallèle) :
   - `visual-asset-curator` trouve, vérifie les licences, optimise et range les visuels selon le brief ; il présente les candidats pour les emplacements subjectifs (hero, illustrations principales). **L'utilisateur choisit.**
   - `content-writer` rédige `docs/CONTENT.md` à partir de `docs/DESIGN.md` et `docs/SEO.md`. **L'utilisateur valide les textes** et fournit les informations `[À COMPLÉTER]`.
4. **Dev** : `frontend-developer` implémente design, assets, contenus et actions SEO P0/P1.
5. **QA** : `ux-qa-auditor` produit `docs/AUDIT.md`. Pour chaque finding bloquant ou « à corriger », relance le rôle destinataire indiqué, puis repasse en QA. Limite à 2 allers-retours automatiques ; au-delà, remonte la situation à l'utilisateur.
6. **Mise en production** : Vercel déploie au push. **Ne jamais commit, push, merger ou déployer sans confirmation explicite de l'utilisateur à ce moment précis.** Jamais de ligne `Co-Authored-By` dans les commits.
7. Termine chaque passage par un résumé court : phase(s) exécutée(s), statut, ce qui bloque, prochaine action attendue (de l'utilisateur ou de toi).

## Refonte page par page (mode choisi par l'utilisateur le 2026-09-25)

La refonte avance **une page à la fois**, dans cet ordre par défaut : Home → Projects → Resume → Certifications → Blog → BlogPost → Admin. On ne passe à la page suivante qu'après validation explicite de l'utilisateur sur la page en cours.

- La première page traitée (Home) fixe aussi le socle global : design tokens, typographie, Navbar, Footer, préchargeur. Les pages suivantes réutilisent ce socle sans le redéfinir.
- Pour chaque page, dérouler la séquence complète ci-dessus limitée à cette page, et consigner l'avancement dans `docs/DESIGN.md` (section « Suivi de la refonte » : page, statut, date de validation).
- Une page validée n'est plus retouchée, sauf demande de l'utilisateur ou changement de socle global accepté par lui.

## Mise à jour ponctuelle (hors refonte)

Pour une tâche ciblée, n'appelle que les rôles utiles, par exemple :
- Ajouter un projet : `content-writer` (texte) + `visual-asset-curator` (capture/mockup) → `frontend-developer` → `ux-qa-auditor`.
- Visuel d'un article de blog ou image OG : `visual-asset-curator` seul.
- Optimiser un article ou une page pour la recherche : `seo-strategist` + `content-writer`.

## Règles transverses

- Les docs de `docs/` (DESIGN, ASSETS, SEO, CONTENT, AUDIT) sont la mémoire partagée de l'équipe : chaque rôle lit celles qui le concernent avant d'agir.
- Pas de `frontend-developer` avant validation de `docs/DESIGN.md` (sauf corrections SEO/texte isolées).
- Toute migration de stack (Vite, Next.js, Astro, React 18/19) est une décision utilisateur, réalisée sur une branche dédiée.
- Aucun asset sans licence vérifiée et consignée dans `docs/ASSETS.md`.
- Aucun tiret cadratin (—) entre les mots dans le texte public du site.
- Aucun secret, IP ou URL interne du vault ne doit se retrouver dans le site.
- Après une session significative, propose d'enregistrer une note de session dans le vault : `C:\Users\Wilfreid\Documents\Gemini\10_Projects\Portfolio\Sessions\YYYY-MM-DD Session - <Sujet>.md` (modèle `99_Templates/T - Conversation`).
