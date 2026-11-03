# AGENTS.md

Règles pour travailler sur ce dépôt (humains et agents de code). Le README décrit la stack et le déploiement.

- **Contenu** : les faits (adresse, horaires, praticiens, tarifs, société) vivent dans `src/content/` et nulle part ailleurs. Une page lit ces fichiers, elle ne recopie pas une valeur.
- **Déontologie** : pas de témoignages, de comparaisons, d'allégations non prouvées, de marques d'équipement, ni de vocabulaire promotionnel (« premium », « pack offert »). Les spécialités affichées sont des « domaines d'intervention » tant que les formations reconnues par l'Ordre ne sont pas confirmées.
- **Vie privée** : aucun traceur, aucune police ou carte chargée depuis un service tiers. Une carte intégrée imposerait un bandeau de consentement : on met un lien d'itinéraire à la place.
- **Composants** : utiliser ceux de Coreloom (`coreloom.json`) avant d'en écrire. Ne pas modifier `src/styles/coreloom/` ; adapter un composant Coreloom est permis, en le signalant dans la PR pour le remonter au design system.
- **Style** : tokens sémantiques (`bg-background`, `text-fg-secondary`, `text-primary-text`), jamais de couleur en dur hors `src/styles/`. Titres en `font-display` (Marcellus, une seule graisse), sur-titres avec `.atlas-eyebrow`. Une bande claire : `data-theme="light" data-surface="bone" data-accent="atlas"` + `bg-background`.
- **Accessibilité** : WCAG 2.1 AA. Liens externes avec `target="_blank"` annoncés « (nouvel onglet) » ; une image qui dit quelque chose a un `alt`.
- **Outils** : Node et pnpm viennent de `mise.toml` (`mise install`) ; changer une version, c'est changer `mise.toml`, `packageManager` et le réglage Node de Hostinger ensemble.
- **Avant de pousser** : `mise run check` (format, types, build ; le pré-rendu échoue si une page plante).
