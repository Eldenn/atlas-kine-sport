# Photo shoot

The photos to take for the site. Each slot is declared in `src/content/photos.ts`: while it is
`null`, the section lays itself out without a picture. Once a photo is delivered, export it as
WebP (and AVIF) into `public/images/photos/` and fill in the entry.

## Direction

- The room as the moodboard describes it (p. 17): black floor, sprint track, walnut slats,
  warm-light wall lamps, travertine, column, the lit logo.
- Warm side light, hard shadows. No front flash, no clinical white.
- People moving rather than posing. No recognisable patient without written consent.
- No stock photos, no retouching that invents equipment.
- Shoot RAW, 24 MP or more; cropping happens in the edit.

## Slots on the site

| Slot                | Page                                       | Format                               | What we see                                                         |
| ------------------- | ------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------- |
| `trainingFloor`     | Home, "Une rééducation active"             | 4:3 landscape                        | The sprint track at floor level, the load area blurred behind.      |
| `trainingFloorWide` | Le cabinet, under the training floor scene | 21:9 (cropped 16:9 and 4:3 on phone) | The whole training floor seen from the entrance, wall lamps on.     |
| `emblem`            | Le cabinet, "Pourquoi Atlas"               | 4:5 portrait                         | The lit logo on the walnut slats, a plant at the edge of the frame. |

## Portraits

- Both physios, framed like the current portraits (4:5, head and shoulders), on a dark ground
  (night blue or the blurred walnut wall), warm light from one side.
- The same work outfit for both.
- One in-session shot per physio: during a session, hands at work, eyes on the patient.

## Later (pages to enrich)

- Hands in manual therapy (shoulder, knee), tight.
- Force sensors and video analysis: the screen and the movement in the same frame.
- Material details: cast-iron plate, travertine, wood slat, the "START" track.
- The practice's entrance and front, for the Infos pratiques page.
