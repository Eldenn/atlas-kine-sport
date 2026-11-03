# Atlas Kiné Sport

Site du cabinet de kinésithérapie du sport Atlas, à Chasseneuil-du-Poitou : [atlas-kine-sport.fr](https://atlas-kine-sport.fr).

- **Stack** : [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router et Form), Tailwind CSS v4, composants [Coreloom UI](https://github.com/Eldenn/coreloom-ui), Nitro pour le serveur Node.
- **Rendu** : toutes les pages sont pré-rendues au build (`prerender.crawlLinks`) ; le serveur Node sert les redirections des anciennes adresses, le sitemap et, bientôt, l'envoi du formulaire de contact.
- **DA** : moodboard du cabinet (bleu minéral `#121A26`, bone `#EBE7E3`, or antique `#B0903D`, Marcellus / Montserrat / Cormorant Garamond). Voir `src/styles/atlas.css`.

## Développer

Les outils sont fixés par [mise](https://mise.jdx.dev) dans `mise.toml` : Node 22 (la version choisie sur Hostinger) et pnpm 12.13.

```bash
mise install             # Node et pnpm aux bonnes versions
mise run dev             # http://localhost:3000 (installe les dépendances d'abord)
mise run check           # avant de pousser : format, types, build
mise run start           # build de production servi comme sur Hostinger
mise tasks               # toutes les tâches
```

`pnpm install` n'installe que des versions publiées depuis au moins 14 jours (`pnpm-workspace.yaml`). Hostinger n'utilise pas mise : il lit `package.json` et `pnpm-lock.yaml`.

## Où est quoi

| Chemin                                  | Contenu                                                                                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/cabinet.ts`                | Toutes les infos du cabinet : adresse, horaires, praticiens (RPPS, Doctolib), société, hébergeur                                        |
| `src/content/tarifs.ts`                 | Prestations non remboursées (information, sans mise en avant : code de déontologie)                                                     |
| `src/routes/`                           | Une page par fichier ; `a-propos`, `services`, `delman-ahmed-mustafa`, `moeine-khalifeh` redirigent (301) les adresses de l'ancien site |
| `src/components/atlas/`                 | Composants propres au site (logo, en-tête de page, boutons Doctolib, emplacement photo)                                                 |
| `src/components/`, `src/components/ui/` | Composants Coreloom installés (registre shadcn), listés dans `coreloom.json`                                                            |
| `src/styles/coreloom/`                  | Styles Coreloom, à ne pas modifier : la DA Atlas se règle dans `atlas.css` et `atlas-accent.css`                                        |

## Mettre à jour Coreloom UI

```bash
pnpm dlx shadcn@latest add @coreloom/showcase --overwrite   # depuis le registre
mise run coreloom:sync ../coreloom-ui                      # ou depuis un clone local, pour tous les items de coreloom.json
```

Les fichiers installés nous appartiennent : relire le diff avant de valider.

## Déployer sur Hostinger

Hébergement « Unlimited Web Hosting », application Node.js connectée à ce dépôt GitHub (chaque push sur la branche choisie redéploie).

| Réglage hPanel          | Valeur             |
| ----------------------- | ------------------ |
| Type d'application      | Nitro              |
| Version de Node         | 22                 |
| Gestionnaire de paquets | pnpm               |
| Script de build         | `build`            |
| Dossier de sortie       | `.output`          |
| Fichier d'entrée        | `server/index.mjs` |

Variables d'environnement : aucune pour l'instant. Le formulaire de contact demandera le jeton de la Mail API Hostinger (créé dans _Agentic Mail → API access_), uniquement côté serveur.

## Règles de contenu

Le code de déontologie des masseurs-kinésithérapeutes (R.4321-67 et suivants) s'applique au site : pas de témoignages de patients, pas de comparaison avec d'autres cabinets, pas de promesse non démontrée, pas de marque d'équipement, tarifs présentés comme une information. Les n° RPPS (et d'Ordre, à ajouter) figurent sur les fiches et dans les mentions légales.
