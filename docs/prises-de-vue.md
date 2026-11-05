# Prises de vue

Les photos à faire pour le site. Chaque emplacement est déclaré dans `src/content/photos.ts` : tant
qu'il vaut `null`, la section se met en page sans image. Une fois la photo livrée, on l'exporte en
WebP (et AVIF) dans `public/images/photos/` et on remplit l'entrée.

## Direction

- La salle telle que le moodboard la décrit (p. 17) : sol noir, piste de sprint, lames de noyer,
  appliques à lumière chaude, travertin, colonne, le logo lumineux.
- Lumière chaude et latérale, ombres franches. Pas de flash frontal, pas de blanc clinique.
- Des gens en mouvement plutôt que posés. Aucun patient reconnaissable sans accord écrit.
- Pas de photo de banque d'images, pas de retouche qui invente du matériel.
- Boîtier en RAW, 24 Mpx ou plus ; on recadre au montage.

## Emplacements du site

| Emplacement  | Page                                   | Format                                | Ce qu'on voit                                                         |
| ------------ | -------------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| `plateau`    | Accueil, « Une rééducation active »    | 4:3 paysage                           | La piste de sprint au ras du sol, la zone de charges floue au fond.   |
| `plateauVue` | Le cabinet, sous la légende du plateau | 21:9 (recadré 16:9 et 4:3 sur mobile) | Tout le plateau vu de l'entrée, appliques allumées.                   |
| `embleme`    | Le cabinet, « Pourquoi Atlas »         | 4:5 portrait                          | Le logo lumineux sur les lames de noyer, une plante en bord de cadre. |

## Portraits

- Les deux kinés, même cadrage que les portraits actuels (4:5, tête et épaules), sur fond sombre
  (bleu nuit ou le mur de noyer flou), lumière chaude d'un côté.
- Tenue de travail identique pour les deux.
- Une version en situation par kiné : en séance, mains au travail, regard sur le patient.

## Pour plus tard (pages à enrichir)

- Mains en thérapie manuelle (épaule, genou), serré.
- Capteurs de force et analyse vidéo : l'écran et le geste dans le même cadre.
- Détails matière : disque de fonte, travertin, lame de bois, piste « START ».
- L'entrée du cabinet et la façade, pour la page Infos pratiques.
