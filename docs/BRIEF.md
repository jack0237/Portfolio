# Brief de refonte du portfolio

Source de vérité des choix de l'utilisateur. Tous les agents de l'équipe lisent ce fichier avant d'agir. Décisions prises le 2026-09-25.

## Objectifs
- Vitrine / personal branding (blog vivant, projets).
- Mettre en avant ses produits (SaaS).
- Trouver un emploi (recruteurs, équipes tech).
- Disponibilité (2026-09-25) : **CDI et freelance**, les deux.

## Identité
- Nom : **Wilfried NGUEGUIM**, pseudo **Jack0237** (par défaut : nom en titre, Jack0237 comme signature/marque).
- Titre : **Dev full-stack & automatisation IA**.
- Photo : on garde `src/Assets/profile.jpg` pour l'instant (remplaçable plus tard).
- Profils : GitHub https://github.com/jack0237 · LinkedIn https://www.linkedin.com/in/ngueguim-wilfried/ · X https://x.com/Jason_0237 (compte X confirmé par l'utilisateur)
- Moyen de contact (2026-09-25) : **e-mail jasonngueguim@gmail.com** et téléphone (numéro fourni par l'utilisateur, non stocké ici ; **pas affiché sur le site**, uniquement sur le CV (option 1, validé le 2026-09-25)).
- Relanceo : site public https://relanceo.cloud/ (détails dans le vault, `30_Resources/Relanceo.md`), aucun résultat chiffré à publier.
- Automatisations : l'utilisateur n'a pas de choix à proposer (2026-09-25) ; **3 cartes validées** : blog automatique, recaps manga, Flux (2026-09-25).

## Direction visuelle
- Garder l'esprit actuel (sombre, tech, touches de cyan), en beaucoup plus soigné et sans aspect template.
- **Ambiance choisie le 2026-09-25 : C « Expédition cinématique »** (voir `docs/MOODBOARD.md`), avec deux éléments de B « Grand titre éditorial » : un mot en très grand dans le hero, et une italique serif pour la voix personnelle.
- Mot géant du hero : choix délégué à l'équipe design (à justifier dans `docs/DESIGN.md`).
- Accent : le cyan reste l'accent principal ; un second accent est autorisé s'il est parfaitement intégré (rôle précis, usage limité, contraste vérifié).
- Direction détaillée **validée le 2026-09-25** dans `docs/DESIGN.md` (mot géant « NGUEGUIM », portrait détouré, accent braise pour le contact, Lenis sur desktop, interrupteur « Réduire les animations »). Stack : **Next.js** validé.
- Typographie : **remplacer Space Grotesk** par une police de meilleure qualité (choix argumenté par l'équipe design).
- Sites aimés par l'utilisateur : https://moneyincheck.org/ et https://white-desert.com/ (à analyser : ce qui plaît probablement, et comment le transposer à un portfolio dev sombre et tech).

## Langue
Bilingue FR/EN avec sélecteur. **Français par défaut à `/`, anglais sous `/en`** (validé le 2026-09-25).

## Technique
- Nouvelle base moderne (choix du framework à recommander, argumenté, avant de décider).
- **Firebase conservé** (Firestore blog + projets, Storage, Auth admin) : le workflow n8n de publication du blog ne doit pas être cassé.
- **Blog** : `blog.jack0237.com` redirigé (301/308) vers `jack0237.com/blog`, adresse de référence unique (validé le 2026-09-25, à faire avec la migration Next.js).
- **Meta du template corrigées sur le site CRA actuel** : commit `e2675a4` poussé le 2026-09-25 (title, description, OG/Twitter, JSON-LD Person/WebSite, image `public/og-image.jpg`, manifest).

## Pages du nouveau site
Accueil, Projets, CV + Certifications, Blog, Contact / services. (Admin conservé pour la gestion.)
Refonte **page par page**, en commençant par l'Accueil ; page suivante uniquement après validation.

## Projets phares
- Relanceo (SaaS relance de factures TPE).
- Automatisations n8n / IA (pipeline manga TikTok, Flux, blog automatique, Ad Studio). Ad Studio montrable publiquement **sans jamais citer le nom du client**.

## Services proposés
- Sites et applis web.
- Applis mobiles.
- Automatisations n8n / IA.

## Page d'accueil (structure validée)
1. **Hero** : nom + Jack0237, titre, phrase de valeur, 2 CTA (« Voir mes projets », « Me contacter »), photo discrète, sélecteur FR/EN. Pas de préchargeur ni d'effet machine à écrire.
2. **Projets phares** : Relanceo en grand (problème, capture, stack, lien prod), 2 ou 3 automatisations en plus petit, lien vers Projets.
3. **Services** : 3 cartes courtes, lien vers Contact / services.
4. **Stack** : rangée compacte de logos groupés par domaine. Pas de barres de pourcentage.
5. **Derniers articles** : 3 derniers articles du blog (Firestore).
6. **Appel final** : invitation, liens sociaux, bouton contact, « Télécharger mon CV ».

Déplacés : bio longue et calendrier GitHub vers la page CV. Particules supprimées ou fortement adoucies selon l'ambiance choisie.

## Règles
- Aucun tiret cadratin (—) entre les mots dans le texte public.
- Aucun chiffre, client ou témoignage inventé.

## Choix d'assets (2026-09-25)
- Portrait : **B, couleur désaturée** (`docs/assets-staging/portrait/portrait-desature-*`).
- **Mise à jour 2026-09-25 : portrait retiré du hero** à la demande de l'utilisateur (photo jugée pas assez bonne). À remplacer par un visuel 3D ou plus attrayant : candidats en préparation, choix utilisateur. L'image de partage social (OG) garde la photo pour l'instant.
- **Retour utilisateur 2026-09-25 : le fond du hero n'est pas assez vivant ni impactant.** Le visuel de remplacement et le fond doivent former une seule scène plein écran, vivante (profondeur, mouvement continu discret, lumière), sans nuire à la lisibilité.
- **Visuel du hero choisi le 2026-09-25 : A « Relief topographique »** (`docs/assets-staging/hero-visual/relief/`), sur recommandation de l'orchestrateur. À réécrire en maillage 3D performant (cible 1 à 3 ms par image) ; poster fixe sur mobile, appareils modestes et mode réduit. Remplace le fond de brume actuel.
- Fond du hero : **A, brume basse** (`mist-poster-basse-*`).
- Favicon : **A, « J. »** (`favicon-j-*`).
