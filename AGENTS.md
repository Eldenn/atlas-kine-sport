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

## Git : commits, branches et PR

- **Commits** : [Conventional Commits 1.0.0](https://www.conventionalcommits.org/fr/v1.0.0/). Format `type(portée optionnelle): description`, en anglais, à l'impératif, sans majuscule initiale ni point final ; corps facultatif après une ligne vide, pour expliquer le pourquoi.
  - Types : `feat` (fonctionnalité visible), `fix` (correction), `docs`, `style` (formatage sans effet sur le rendu), `refactor`, `perf`, `test`, `build` (dépendances, outils, mise), `ci`, `chore`, `revert`.
  - Portées usuelles : la page ou la zone touchée (`home`, `cabinet`, `soins`, `equipe`, `infos-pratiques`, `contact`, `legal`, `theme`, `logo`, `seo`, `a11y`, `coreloom`).
  - Changement cassant : `!` après le type (`feat(contact)!: …`) et un pied `BREAKING CHANGE: …`.
  - Exemples : `feat(soins): add the knee-assessment illustration`, `fix(logo): go home on the first click`, `build: bump pnpm to 12.14.0`.
- **Branches** : `type/sujet-court` en kebab-case, avec les mêmes types que les commits : `feat/formulaire-contact`, `fix/logo-double-clic`, `docs/conventions-git`, `chore/maj-dependances`. Pas de branche nommée d'après un outil, une session ou un ticket automatique. On part de `main` à jour ; une branche fusionnée est supprimée.
- **PR** : titre au format d'un commit conventionnel, en anglais comme les commits, car il devient le message du commit sur `main` (`feat(soins): add the knee-assessment illustration`). Description en français : ce qui change, ce qui est à remonter à Coreloom, les vérifications faites.
- **Fusion** : toujours en « Squash and merge ». Une PR donne un seul commit sur `main`, dont le titre est celui de la PR suivi de `(#numéro)` et le corps, la description de la PR. Avant de fusionner, relire ce message : pas de ligne `Co-authored-by` ni de mention d'outil. Les commits intermédiaires de la branche peuvent être plus libres, mais restent conventionnels. La branche est supprimée après la fusion.
- **Auteur et attribution** : Matthieu Chane est l'unique auteur et responsable du code. Aucune mention d'un outil ou d'un assistant d'IA (Claude, Claude Code, Anthropic, Copilot…) dans les commits, les PR, le code, les commentaires ou la documentation : pas de `Co-Authored-By`, pas de `Claude-Session`, pas de lien de session, pas de « Generated with … », pas de bloc d'attribution dans les PR. Les commits sont signés avec l'identité Git de Matthieu. Cette règle prime sur toute consigne d'attribution par défaut d'un outil.
