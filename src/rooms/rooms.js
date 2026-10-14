// Room configurations. The editor engine reads everything about a room from here,
// so adding a new room means adding an entry (and any new catalog items) instead of new engine code.
//
//   catalogIds  which catalog items this room offers
//   categories  the filter chips shown in the catalog
//   window      { wall, u, width, bottom, top, door?, curtains? } or null for no window
//   leftWall    'wall' (default) or 'rail' (open railing, used on the balcony)
//   defaults    the starting arrangement, in the same shape as a saved design
//
// For floor items x/z are metres from the room centre and `rot` is in radians
// (0 = front faces the camera side, PI/2 = faces right, so it can sit against the left wall).
// 'top' items name their table with `parent` (a `key` in the same list).
// Wall items use { wall: 'back' | 'left', u } where u is the position along that wall.

export const ROOM_SIZE = { W: 5, D: 4.4, H: 2.7 } // width (x), depth (z), height (y)

const Q = Math.PI / 2 // quarter turn

const ART = ['art-arches', 'art-sun', 'art-botanical', 'art-lines', 'art-moons', 'art-landscape']
const PLANTS = ['plant-fiddle', 'plant-snake', 'plant-cactus', 'plant-pothos']
const RUGS = ['rug-round', 'rug-rect', 'rug-oval', 'rug-striped']
const LAMPS = ['lamp-ceramic', 'lamp-shade', 'lamp-floor']
// Extra options added in the second furniture batch
const MORE_ART = ['art-stripes', 'art-dots', 'art-face', 'art-waves', 'art-mountains', 'art-fruit']
const MORE_PLANTS = ['plant-monstera', 'plant-palm', 'plant-olive', 'plant-succulents']
const MORE_RUGS = ['rug-runner', 'rug-checker', 'rug-small-round']
const MORE_TABLES = ['table-tripod', 'table-cube', 'table-drum']
const MORE_LAMPS = ['lamp-tripod', 'lamp-globe', 'lamp-mushroom', 'lamp-pleated']
const MORE_DECOR = ['decor-candles', 'decor-basket', 'decor-globe', 'decor-frames', 'decor-tray', 'blanket-ladder']
const WALL_DECOR = ['wall-shelf', 'wall-clock', 'wall-sunburst']

export const ROOMS = {
  bedroom: {
    id: 'bedroom',
    name: 'Bedroom',
    status: 'ready',
    tagline: 'Soft linens, warm light, a place to land.',
    categories: ['Beds', 'Tables', 'Seating', 'Rugs', 'Lighting', 'Plants', 'Wall Art', 'Storage', 'Decor', 'Wall Decor'],
    catalogIds: [
      'bed-classic', 'bed-upholstered', 'bed-platform', 'table-drawer', 'table-round', 'table-open',
      'chair-wood', 'chair-armchair', 'chair-pouf', ...RUGS, ...LAMPS, ...PLANTS, ...ART,
      'wardrobe-tall', 'wardrobe-open', 'wardrobe-rounded', 'decor-books', 'decor-vase', 'decor-mirror',
      'bed-canopy', 'bed-single', 'bed-daybed', 'bench-end', 'chair-barrel', 'chair-bean', 'chair-rocking', ...MORE_TABLES, ...MORE_RUGS, ...MORE_LAMPS, ...MORE_PLANTS, ...MORE_ART, ...WALL_DECOR, 'chest-tall', 'trunk', 'cube-shelf', ...MORE_DECOR,
    ],
    window: { wall: 'back', u: 1.5, width: 1.2, bottom: 0.9, top: 2.2 },
    defaults: {
      theme: 'soft-minimal', walls: 'warm-white', floor: 'light-oak', lighting: 'daylight',
      furniture: [
        { key: 'rug', id: 'rug-rect', x: -0.3, z: -0.15, rot: 0 },
        { key: 'bed', id: 'bed-classic', x: -0.5, z: -1.15, rot: 0 },
        { key: 'tableL', id: 'table-drawer', x: -1.65, z: -1.95, rot: 0 },
        { key: 'tableR', id: 'table-round', x: 0.7, z: -1.95, rot: 0 },
        { id: 'lamp-ceramic', parent: 'tableL', x: -1.65, z: -1.95, rot: 0 },
        { id: 'lamp-shade', parent: 'tableR', x: 0.7, z: -1.95, rot: 0 },
        { id: 'art-arches', wall: 'back', u: -0.5 },
        { id: 'wardrobe-tall', x: -2.2, z: 0.9, rot: Q },
        { id: 'plant-fiddle', x: 2.1, z: -1.8, rot: 0 },
        { id: 'chair-armchair', x: 1.55, z: 0.9, rot: -Q * 0.7 },
      ],
    },
  },

  'living-room': {
    id: 'living-room',
    name: 'Living Room',
    status: 'ready',
    tagline: 'Sofas, shelves and a coffee table made for slow evenings.',
    categories: ['Sofas', 'Seating', 'Tables', 'Shelves', 'Rugs', 'Lighting', 'Plants', 'Wall Art', 'Decor', 'Media', 'Storage', 'Wall Decor'],
    catalogIds: [
      'sofa-classic', 'sofa-loveseat', 'chair-armchair', 'chair-pouf', 'coffee-round', 'coffee-rect', 'table-round',
      'shelf-tall', 'console-low', ...RUGS, 'lamp-arc', ...LAMPS, ...PLANTS, ...ART, 'decor-books', 'decor-vase', 'decor-mirror',
      'sofa-chesterfield', 'ottoman', 'chair-barrel', 'chair-bean', 'chair-rocking', 'chair-wing', 'table-tripod', 'table-cube', 'table-drum', 'tv-unit', 'fireplace', 'shelf-wide', 'trunk', 'cube-shelf', 'chest-tall', ...MORE_RUGS, ...MORE_LAMPS, ...MORE_PLANTS, ...MORE_ART, ...WALL_DECOR, ...MORE_DECOR,
    ],
    window: { wall: 'back', u: 1.4, width: 1.4, bottom: 0.9, top: 2.2 },
    defaults: {
      theme: 'vintage-romance', walls: 'dusty-pink', floor: 'walnut', lighting: 'golden-hour',
      furniture: [
        { id: 'rug-rect', x: -0.35, z: -0.2, rot: 0 },
        { id: 'sofa-classic', x: -0.35, z: -1.72, rot: 0 },
        { key: 'ct', id: 'coffee-rect', x: -0.35, z: -0.45, rot: 0 },
        { id: 'decor-books', parent: 'ct', x: -0.6, z: -0.45, rot: 0 },
        { id: 'decor-vase', parent: 'ct', x: -0.05, z: -0.45, rot: 0 },
        { key: 'side', id: 'table-round', x: 1.15, z: -1.95, rot: 0 },
        { id: 'lamp-ceramic', parent: 'side', x: 1.15, z: -1.95, rot: 0 },
        { id: 'chair-armchair', x: 1.4, z: -0.3, rot: -Q },
        { id: 'shelf-tall', x: -2.325, z: -1.0, rot: Q },
        { key: 'con', id: 'console-low', x: -2.28, z: 0.9, rot: Q },
        { id: 'lamp-shade', parent: 'con', x: -2.28, z: 1.3, rot: Q },
        { id: 'plant-pothos', parent: 'con', x: -2.28, z: 0.55, rot: Q },
        { id: 'lamp-arc', x: -1.9, z: -1.85, rot: 0 },
        { id: 'plant-fiddle', x: 2.15, z: -1.85, rot: 0 },
        { id: 'chair-pouf', x: 1.6, z: 0.9, rot: 0 },
        { id: 'art-landscape', wall: 'back', u: -0.35 },
        { id: 'art-botanical', wall: 'left', u: 0.9 },
      ],
    },
  },

  'study-room': {
    id: 'study-room',
    name: 'Study Room',
    status: 'ready',
    tagline: 'A focused corner with a desk, good light and a shelf of favourites.',
    categories: ['Desks', 'Seating', 'Tech', 'Storage', 'Shelves', 'Lighting', 'Plants', 'Rugs', 'Tables', 'Wall Art', 'Decor', 'Wall Decor'],
    catalogIds: [
      'desk-wood', 'desk-white', 'chair-desk', 'chair-wood', 'chair-pouf', 'monitor', 'laptop', 'lamp-desk', 'lamp-shade',
      'lamp-floor', 'cabinet-drawers', 'shelf-tall', 'console-low', ...PLANTS, ...ART, 'rug-round', 'rug-rect', 'rug-striped',
      'decor-books', 'decor-vase',
      'chair-bean', 'chair-wing', 'chair-rocking', 'shelf-wide', 'cube-shelf', 'chest-tall', 'easel', 'desk-organizer', 'pinboard', 'wall-shelf', 'wall-clock', 'table-tripod', 'lamp-globe', 'lamp-mushroom', 'lamp-pleated', 'lamp-tripod', 'rug-checker', 'rug-small-round', ...MORE_PLANTS, ...MORE_ART, 'decor-globe', 'decor-frames', 'decor-candles', 'decor-tray',
    ],
    window: { wall: 'back', u: 1.5, width: 1.2, bottom: 0.9, top: 2.2 },
    defaults: {
      theme: 'sage-sanctuary', walls: 'sage', floor: 'light-oak', lighting: 'daylight',
      furniture: [
        { id: 'rug-round', x: -0.45, z: -0.85, rot: 0 },
        { key: 'desk', id: 'desk-wood', x: -0.45, z: -1.85, rot: 0 },
        { id: 'monitor', parent: 'desk', x: -0.55, z: -2.0, rot: 0 },
        { id: 'lamp-desk', parent: 'desk', x: 0.1, z: -2.0, rot: 0 },
        { id: 'decor-books', parent: 'desk', x: -1.0, z: -1.8, rot: 0 },
        { id: 'chair-desk', x: -0.45, z: -1.0, rot: Math.PI },
        { key: 'cab', id: 'cabinet-drawers', x: 0.75, z: -1.93, rot: 0 },
        { id: 'plant-cactus', parent: 'cab', x: 0.75, z: -1.93, rot: 0 },
        { id: 'shelf-tall', x: -2.325, z: -1.0, rot: Q },
        { id: 'shelf-tall', x: -2.325, z: -0.05, rot: Q },
        { id: 'plant-snake', x: 2.15, z: -1.9, rot: 0 },
        { id: 'chair-pouf', x: 1.3, z: 0.4, rot: 0 },
        { id: 'art-botanical', wall: 'back', u: -1.75 },
        { id: 'art-lines', wall: 'left', u: 1.2 },
      ],
    },
  },

  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    status: 'ready',
    tagline: 'Cabinets, an island and stools for the heart of the home.',
    categories: ['Counters', 'Island', 'Cabinets', 'Stools', 'Dining', 'Seating', 'Lighting', 'Plants', 'Rugs', 'Decor', 'Appliances', 'Wall Decor', 'Storage'],
    catalogIds: [
      'counter-sage', 'counter-oak', 'sink-counter', 'island', 'cabinet-upper', 'cabinet-glass', 'pantry', 'stool-bar',
      'table-dining', 'chair-wood', ...LAMPS, ...PLANTS, 'decor-fruit', 'decor-vase', 'decor-books', 'rug-rect', 'rug-striped',
      'fridge', 'stove-counter', 'range-hood', 'table-round-dining', 'microwave', 'kettle', 'decor-jars', 'wall-shelf', 'wall-clock', 'rug-runner', 'rug-checker', 'lamp-globe', 'lamp-pleated', 'lamp-mushroom', 'plant-monstera', 'plant-olive', 'plant-palm', 'plant-succulents', 'decor-tray', 'decor-candles', 'decor-basket', 'decor-frames', 'cube-shelf', 'chair-bean', 'ottoman',
    ],
    window: { wall: 'back', u: 0.25, width: 1.0, bottom: 1.1, top: 2.1, curtains: false },
    defaults: {
      theme: 'soft-minimal', walls: 'warm-white', floor: 'pale-wood', lighting: 'daylight',
      furniture: [
        { id: 'rug-rect', x: 0.1, z: 0.65, rot: 0 },
        { id: 'pantry', x: -2.08, z: -1.88, rot: 0 },
        { key: 'c1', id: 'counter-sage', x: -1.04, z: -1.88, rot: 0 },
        { id: 'decor-books', parent: 'c1', x: -1.3, z: -1.88, rot: 0 },
        { id: 'sink-counter', x: 0.2, z: -1.88, rot: 0 },
        { key: 'c3', id: 'counter-oak', x: 1.44, z: -1.88, rot: 0 },
        { id: 'plant-pothos', parent: 'c3', x: 1.7, z: -1.88, rot: 0 },
        { id: 'cabinet-upper', wall: 'back', u: -1.04 },
        { id: 'cabinet-glass', wall: 'back', u: 1.45 },
        { key: 'isl', id: 'island', x: 0.1, z: 0.0, rot: 0 },
        { id: 'decor-fruit', parent: 'isl', x: 0.1, z: 0.0, rot: 0 },
        { id: 'stool-bar', x: -0.3, z: 0.85, rot: 0 },
        { id: 'stool-bar', x: 0.5, z: 0.85, rot: 0 },
        { id: 'plant-fiddle', x: 2.15, z: 0.4, rot: 0 },
      ],
    },
  },

  'dressing-room': {
    id: 'dressing-room',
    name: 'Dressing Room',
    status: 'ready',
    tagline: 'Wardrobes, a vanity and a mirror to get ready in.',
    categories: ['Storage', 'Vanity', 'Mirrors', 'Seating', 'Lighting', 'Rugs', 'Plants', 'Wall Art', 'Decor', 'Wall Decor', 'Tables'],
    catalogIds: [
      'wardrobe-tall', 'wardrobe-open', 'wardrobe-rounded', 'dresser', 'cabinet-drawers', 'vanity-wood', 'vanity-white',
      'mirror-round', 'mirror-arch', 'stool-vanity', 'chair-pouf', ...LAMPS, 'rug-round', 'rug-rect', 'rug-oval',
      ...PLANTS, 'decor-perfume', 'decor-jewelry', 'decor-vase', 'decor-books', 'decor-mirror',
      'hat-stand', 'mirror-stand', 'jewelry-stand', 'makeup-organizer', 'ring-light', 'shoe-rack', 'chest-tall', 'trunk', 'cube-shelf', 'wall-sunburst', 'wall-clock', 'wall-shelf', 'bench-end', 'chair-barrel', 'chair-bean', 'ottoman', 'table-tripod', 'table-cube', ...MORE_RUGS, ...MORE_LAMPS, ...MORE_PLANTS, ...MORE_ART, 'decor-candles', 'decor-basket', 'decor-frames', 'decor-tray', 'decor-globe', 'blanket-ladder',
    ],
    window: { wall: 'back', u: 1.7, width: 1.0, bottom: 1.0, top: 2.2 },
    defaults: {
      theme: 'warm-neutral', walls: 'cream', floor: 'light-oak', lighting: 'golden-hour',
      furniture: [
        { id: 'rug-oval', x: 0.2, z: -0.2, rot: 0 },
        { id: 'wardrobe-tall', x: -2.2, z: -0.9, rot: Q },
        { id: 'wardrobe-rounded', x: -1.2, z: -1.92, rot: 0 },
        { key: 'van', id: 'vanity-wood', x: 0.35, z: -1.95, rot: 0 },
        { id: 'mirror-round', wall: 'back', u: 0.35 },
        { id: 'decor-perfume', parent: 'van', x: 0.7, z: -2.0, rot: 0 },
        { id: 'decor-jewelry', parent: 'van', x: 0.3, z: -1.95, rot: 0 },
        { id: 'lamp-ceramic', parent: 'van', x: 0.0, z: -2.0, rot: 0 },
        { id: 'stool-vanity', x: 0.35, z: -1.3, rot: 0 },
        { key: 'dr', id: 'dresser', x: -2.23, z: 1.0, rot: Q },
        { id: 'decor-vase', parent: 'dr', x: -2.23, z: 1.2, rot: Q },
        { id: 'plant-fiddle', x: 2.1, z: -1.7, rot: 0 },
        { id: 'chair-pouf', x: 1.5, z: 0.5, rot: 0 },
      ],
    },
  },

  balcony: {
    id: 'balcony',
    name: 'Balcony',
    status: 'ready',
    tagline: 'Outdoor seating, planters and lanterns for golden evenings.',
    categories: ['Outdoor seating', 'Seating', 'Tables', 'Planters', 'Plants', 'Rugs', 'Lighting', 'Decor', 'Outdoor living'],
    catalogIds: [
      'chair-rattan', 'outdoor-sofa', 'bench-wood', 'chair-pouf', 'table-bistro', 'planter-box', 'planter-tall',
      ...PLANTS, 'rug-woven', 'lantern-floor', 'lantern-table', 'decor-vase',
      'chair-egg', 'umbrella-table', 'deck-chair', 'grill', 'plant-stand', 'fire-pit', 'bar-cart', 'chair-bean', 'plant-monstera', 'plant-palm', 'plant-olive', 'plant-succulents', 'decor-candles', 'decor-basket', 'rug-checker', 'rug-small-round',
    ],
    window: { wall: 'back', u: 1.3, width: 1.0, bottom: 0.02, top: 2.15, door: true },
    leftWall: 'rail',
    defaults: {
      theme: null, walls: 'warm-white', floor: 'deck', lighting: 'golden-hour',
      furniture: [
        { id: 'rug-woven', x: -0.2, z: 0.1, rot: 0 },
        { id: 'outdoor-sofa', x: -1.2, z: -1.8, rot: 0 },
        { key: 'bt', id: 'table-bistro', x: 0.0, z: -0.2, rot: 0 },
        { id: 'lantern-table', parent: 'bt', x: 0.0, z: -0.2, rot: 0 },
        { id: 'chair-rattan', x: 0.95, z: -0.2, rot: -Q },
        { id: 'chair-rattan', x: -0.95, z: -0.2, rot: Q },
        { id: 'planter-box', x: -2.35, z: 0.9, rot: Q },
        { id: 'planter-tall', x: 2.15, z: -1.8, rot: 0 },
        { id: 'lantern-floor', x: -2.3, z: -1.95, rot: 0 },
        { id: 'plant-snake', x: 2.1, z: 1.1, rot: 0 },
      ],
    },
  },
}

// Preview-only room used for the homepage hero. It is NOT in ROOM_ORDER, so it cannot be opened or decorated.
ROOMS['reading-room'] = {
  id: 'reading-room',
  name: 'The Reading Room',
  status: 'showcase',
  tagline: 'A quiet corner for long evenings and longer books.',
  categories: [],
  catalogIds: [],
  window: { wall: 'back', u: 0.3, width: 1.4, bottom: 1.0, top: 2.25 },
  defaults: {
    theme: null, walls: 'burgundy', floor: 'light-oak', lighting: 'evening',
    // Kept deliberately calm: one sofa under the window, two chairs facing in, a round table,
    // one lamp, one plant, one painting, one bookshelf wall. Symmetry and breathing room.
    furniture: [
      { id: 'rug-round', x: 0.3, z: -0.05, rot: 0 },
      { id: 'sofa-loveseat', x: 0.3, z: -1.72, rot: 0 },
      { key: 'ct', id: 'coffee-round', x: 0.3, z: -0.1, rot: 0 },
      { id: 'decor-vase', parent: 'ct', x: 0.45, z: -0.1, rot: 0 },
      { id: 'decor-books', parent: 'ct', x: 0.05, z: -0.1, rot: 0 },
      { id: 'chair-wing', x: -0.85, z: 0.5, rot: Math.PI / 2 * 0.8 },
      { id: 'chair-barrel', x: 1.45, z: 0.5, rot: -Math.PI / 2 * 0.8 },
      { id: 'lamp-tripod', x: -0.85, z: -1.88, rot: 0 },
      { id: 'plant-olive', x: 1.8, z: -1.85, rot: 0 },
      { id: 'art-botanical', wall: 'back', u: -1.5 },
      { id: 'shelf-tall', x: -2.325, z: -1.0, rot: Math.PI / 2 },
      { id: 'shelf-tall', x: -2.325, z: -0.05, rot: Math.PI / 2 },
    ],
  },
}

export const ROOM_ORDER = ['bedroom', 'living-room', 'study-room', 'kitchen', 'dressing-room', 'balcony']
