# ROOMLY

A cozy 3D room-makeover game. React + Vite + Three.js (React Three Fiber + Drei). No backend, no paid services.
Designs are saved in your browser's LocalStorage only.

## Run it

```bash
npm install
npm run dev        # open the address it prints (usually http://localhost:5173)
```

Build for production: `npm run build` (output in `dist/`), preview it with `npm run preview`.

## Deploy to Vercel

1. Push this folder to a GitHub repository (do not commit `node_modules`; `.gitignore` is included).
2. Go to vercel.com, sign in, choose **Add New... > Project**, and import the repository.
3. Vercel detects Vite automatically. Build command `npm run build`, output directory `dist`. Click **Deploy**.

(Or from the terminal: `npm i -g vercel`, then `vercel` inside this folder.)

## How to play

- Pick a catalog item, then click the floor (furniture), a table (lamps, small plants, decor) or a wall (art).
- Click a placed item to select it. Drag a **selected** item to move it (camera orbit pauses while dragging).
- Rotate (45° steps), swap to another style, or remove from the panel at the bottom of the scene.
- Shortcuts: `R` rotate right (`Shift+R` left), `Delete` remove, `Esc` deselect, `Ctrl/Cmd+Z` undo, `Ctrl/Cmd+Shift+Z` redo.
- "Walls & light" tab: themes, wall colour, floor, lighting (Daylight, Golden Hour, Evening).

## Project map

```
src/
  data/        palette.js (colours, themes, lighting)  catalog.js (every furniture item)
  rooms/       rooms.js (room configs: size, window, default layout, coming-soon rooms)
  furniture/   models.js (procedural 3D models)  art.js (wall-art paintings)
  scenes/      RoomScene (lights + interaction)  RoomStructure  FurnitureObject  Ghost
  hooks/       useEditor (state, undo/redo, autosave)  useThumbnails
  utils/       placement.js (bounds maths)  design.js  storage.js  three-helpers.js
  components/  RoomSelector, EditorScreen, EditorToolbar, FurnitureCatalog, Inspector,
               LightingControls, ThemeSelector, SaveIndicator, CompletionScreen, ...
```

## Assets and licences

There are no external 3D files or images. Every model is built from Three.js geometry in `src/furniture/models.js`,
and the paintings are drawn on a canvas in `src/furniture/art.js`. Fonts (Fraunces, Inter) load from Google Fonts
(SIL Open Font License); the app falls back to system fonts if they cannot load.

## Status

All six rooms are playable and use the same editor engine. The catalog now has 141 pieces (the number per room is in the table):

| Room | Notes |
| --- | --- |
| Bedroom (71) | 6 beds incl. canopy, single and daybed; 6 side tables; rocking, barrel and bean-bag seats; chests, trunk, 12 paintings, wall clock, shelf and sunburst mirror |
| Living Room (71) | 3 sofas, fireplace, media unit with TV, wingback and barrel chairs, ottoman; sofas, coffee tables, armchairs, shelves, arc and floor lamps |
| Study Room (60) | easel, pinboard, wide bookcase, pen cups; desks, desk chair, monitor, laptop, desk lamp, bookshelves, drawer unit |
| Kitchen (47) | fridge, range counter and hood, microwave, kettle, pantry jars; counters, sink, island, stools, dining table, wall cabinets, pantry |
| Dressing Room | wardrobes, vanities, round and arched wall mirrors, dresser, accessories |
| Balcony (31) | hanging egg chair, parasol table, deck chair, grill, fire pit, bar cart; door instead of window, open railing, rattan seating, planters, lanterns |

Each room has its own catalog, default arrangement and saved design (LocalStorage key `roomly:v1:<room>`).
To add or change a room, edit `src/rooms/rooms.js` (and `src/data/catalog.js` + `src/furniture/models-rooms.js` for new items).

Not included: image export of the finished room, and furniture-to-furniture collision (items can overlap).

## Motion and floors

- Floors: 7 styles (3 wood plank, basketweave parquet, stone tile, checker, weathered deck), painted with grain, joints and a bump map. The floor and the slab under it no longer sit at the same height (that made floors flicker).
- 3D room: furniture pops in one piece at a time when a room opens, glides when moved, turns smoothly, lamp glow fades, light changes cross-fade, curtains sway, dust or fireflies drift, and the camera swoops in. The finish screen orbits slowly and drops confetti.
- Homepage: a live 3D bedroom that cycles through themes (and you can pick one), word-by-word headline, scrolling marquee of furniture names, count-up stats, tilting room cards and a "how it works" section.
- All of this switches off automatically if the visitor's device is set to "reduce motion".
