// The furniture catalog. Each entry says WHAT an item is and how it behaves.
// The 3D shape itself lives in furniture/models.js (looked up by `id`).
//
// kind:
//   'floor' - stands on the floor, must stay inside the room
//   'top'   - rests on a table (needs an item with `surface` beneath it)
//   'wall'  - hangs on the back or left wall
// size: [width, depth] in metres for floor/top items, [width, height] for wall items
// height: how tall the item is (used for the selection outline)
// surface: height of the tabletop, if other items can rest on it
// lamp: true if it should light up the room in Golden Hour / Evening

export const CATEGORIES = ['Beds', 'Tables', 'Seating', 'Rugs', 'Lighting', 'Plants', 'Wall Art', 'Storage', 'Decor']

const art = (id, name, w, h) => ({ id, name, category: 'Wall Art', kind: 'wall', size: [w, h], height: h, wallY: 1.6 })

export const CATALOG = [
  { id: 'bed-classic', name: 'Heirloom Bed', category: 'Beds', kind: 'floor', size: [1.7, 2.1], height: 1.1 },
  { id: 'bed-upholstered', name: 'Blush Upholstered Bed', category: 'Beds', kind: 'floor', size: [1.7, 2.1], height: 1.35 },
  { id: 'bed-platform', name: 'Oak Platform Bed', category: 'Beds', kind: 'floor', size: [1.7, 2.15], height: 0.85 },

  { id: 'table-drawer', name: 'Walnut Nightstand', category: 'Tables', kind: 'floor', size: [0.54, 0.44], height: 0.62, surface: 0.62 },
  { id: 'table-round', name: 'Round Side Table', category: 'Tables', kind: 'floor', size: [0.5, 0.5], height: 0.54, surface: 0.54 },
  { id: 'table-open', name: 'Painted Shelf Table', category: 'Tables', kind: 'floor', size: [0.52, 0.4], height: 0.57, surface: 0.57 },

  { id: 'chair-wood', name: 'Oak Chair', category: 'Seating', kind: 'floor', size: [0.46, 0.46], height: 0.95 },
  { id: 'chair-armchair', name: 'Rose Armchair', category: 'Seating', kind: 'floor', size: [0.85, 0.78], height: 0.92 },
  { id: 'chair-pouf', name: 'Burgundy Pouf', category: 'Seating', kind: 'floor', size: [0.56, 0.56], height: 0.43 },

  { id: 'rug-round', name: 'Cream Round Rug', category: 'Rugs', kind: 'floor', size: [1.8, 1.8], height: 0.03 },
  { id: 'rug-rect', name: 'Sage Border Rug', category: 'Rugs', kind: 'floor', size: [2.0, 1.4], height: 0.03 },
  { id: 'rug-oval', name: 'Rose Oval Rug', category: 'Rugs', kind: 'floor', size: [2.2, 1.5], height: 0.03 },
  { id: 'rug-striped', name: 'Burgundy Stripe Rug', category: 'Rugs', kind: 'floor', size: [2.0, 1.4], height: 0.03 },

  { id: 'lamp-ceramic', name: 'Sage Ceramic Lamp', category: 'Lighting', kind: 'top', size: [0.34, 0.34], height: 0.5, lamp: true, lightY: 0.4 },
  { id: 'lamp-shade', name: 'Blush Drum Lamp', category: 'Lighting', kind: 'top', size: [0.3, 0.3], height: 0.47, lamp: true, lightY: 0.38 },
  { id: 'lamp-floor', name: 'Ivory Floor Lamp', category: 'Lighting', kind: 'floor', size: [0.4, 0.4], height: 1.65, lamp: true, lightY: 1.5 },

  { id: 'plant-fiddle', name: 'Fiddle Leaf Fig', category: 'Plants', kind: 'floor', size: [0.62, 0.62], height: 1.5 },
  { id: 'plant-snake', name: 'Snake Plant', category: 'Plants', kind: 'floor', size: [0.4, 0.4], height: 1.25 },
  { id: 'plant-cactus', name: 'Little Cactus', category: 'Plants', kind: 'top', size: [0.2, 0.2], height: 0.36 },
  { id: 'plant-pothos', name: 'Trailing Pothos', category: 'Plants', kind: 'top', size: [0.3, 0.3], height: 0.26 },

  art('art-arches', 'Rainbow Arches', 0.7, 0.95),
  art('art-sun', 'Burgundy Sunset', 0.75, 0.75),
  art('art-botanical', 'Botanical Sprig', 0.6, 0.9),
  art('art-lines', 'Line & Circle', 0.8, 0.6),
  art('art-moons', 'Moon Phases', 1.3, 0.5),
  art('art-landscape', 'Rolling Hills', 1.1, 0.7),

  { id: 'wardrobe-tall', name: 'Walnut Wardrobe', category: 'Storage', kind: 'floor', size: [1.16, 0.6], height: 2.05 },
  { id: 'wardrobe-open', name: 'Open Clothing Rail', category: 'Storage', kind: 'floor', size: [0.94, 0.5], height: 1.92 },
  { id: 'wardrobe-rounded', name: 'Sage Rounded Wardrobe', category: 'Storage', kind: 'floor', size: [1.2, 0.56], height: 1.86 },

  { id: 'decor-books', name: 'Book Stack', category: 'Decor', kind: 'top', size: [0.28, 0.2], height: 0.15 },
  { id: 'decor-vase', name: 'Dried Flower Vase', category: 'Decor', kind: 'top', size: [0.22, 0.22], height: 0.6 },
  { id: 'decor-mirror', name: 'Leaning Floor Mirror', category: 'Decor', kind: 'floor', size: [0.66, 0.2], height: 1.65 },

  // ---- Living Room ----
  { id: 'sofa-classic', name: 'Sage Three-Seat Sofa', category: 'Sofas', kind: 'floor', size: [2.1, 0.95], height: 0.95 },
  { id: 'sofa-loveseat', name: 'Linen Loveseat', category: 'Sofas', kind: 'floor', size: [1.5, 0.95], height: 0.95 },
  { id: 'coffee-round', name: 'Round Coffee Table', category: 'Tables', kind: 'floor', size: [0.9, 0.9], height: 0.42, surface: 0.42 },
  { id: 'coffee-rect', name: 'Oak Coffee Table', category: 'Tables', kind: 'floor', size: [1.1, 0.6], height: 0.4, surface: 0.4 },
  { id: 'shelf-tall', name: 'Tall Bookshelf', category: 'Shelves', kind: 'floor', size: [0.9, 0.35], height: 1.92 },
  { id: 'console-low', name: 'Low Console', category: 'Shelves', kind: 'floor', size: [1.46, 0.44], height: 0.57, surface: 0.57 },
  { id: 'lamp-arc', name: 'Arc Floor Lamp', category: 'Lighting', kind: 'floor', size: [0.7, 0.44], height: 1.7, lamp: true, lightY: 1.5 },

  // ---- Study Room ----
  { id: 'desk-wood', name: 'Walnut Desk', category: 'Desks', kind: 'floor', size: [1.4, 0.7], height: 0.76, surface: 0.75 },
  { id: 'desk-white', name: 'Painted Writing Desk', category: 'Desks', kind: 'floor', size: [1.2, 0.6], height: 0.76, surface: 0.75 },
  { id: 'chair-desk', name: 'Burgundy Desk Chair', category: 'Seating', kind: 'floor', size: [0.6, 0.6], height: 1.0 },
  { id: 'monitor', name: 'Monitor', category: 'Tech', kind: 'top', size: [0.6, 0.2], height: 0.47 },
  { id: 'laptop', name: 'Laptop', category: 'Tech', kind: 'top', size: [0.34, 0.25], height: 0.22 },
  { id: 'lamp-desk', name: 'Desk Lamp', category: 'Lighting', kind: 'top', size: [0.36, 0.2], height: 0.4, lamp: true, lightY: 0.33 },
  { id: 'cabinet-drawers', name: 'Drawer Unit', category: 'Storage', kind: 'floor', size: [0.54, 0.54], height: 0.61, surface: 0.6 },

  // ---- Kitchen ----
  { id: 'counter-sage', name: 'Sage Counter', category: 'Counters', kind: 'floor', size: [1.24, 0.64], height: 0.9, surface: 0.9 },
  { id: 'counter-oak', name: 'Oak Counter', category: 'Counters', kind: 'floor', size: [1.24, 0.64], height: 0.9, surface: 0.9 },
  { id: 'sink-counter', name: 'Sink Counter', category: 'Counters', kind: 'floor', size: [1.24, 0.64], height: 1.12, surface: 0.9 },
  { id: 'island', name: 'Kitchen Island', category: 'Island', kind: 'floor', size: [1.6, 0.9], height: 0.93, surface: 0.92 },
  { id: 'cabinet-upper', name: 'Wall Cabinet', category: 'Cabinets', kind: 'wall', size: [1.0, 0.7], height: 0.7, wallY: 1.75, wallDepth: 0.35 },
  { id: 'cabinet-glass', name: 'Glass-Door Cabinet', category: 'Cabinets', kind: 'wall', size: [1.0, 0.7], height: 0.7, wallY: 1.75, wallDepth: 0.35 },
  { id: 'pantry', name: 'Tall Pantry', category: 'Cabinets', kind: 'floor', size: [0.84, 0.64], height: 2.14 },
  { id: 'stool-bar', name: 'Bar Stool', category: 'Stools', kind: 'floor', size: [0.4, 0.4], height: 0.72 },
  { id: 'table-dining', name: 'Oak Dining Table', category: 'Dining', kind: 'floor', size: [1.4, 0.85], height: 0.76, surface: 0.76 },
  { id: 'decor-fruit', name: 'Fruit Bowl', category: 'Decor', kind: 'top', size: [0.3, 0.3], height: 0.14 },

  // ---- Dressing Room ----
  { id: 'vanity-wood', name: 'Walnut Vanity', category: 'Vanity', kind: 'floor', size: [1.1, 0.5], height: 0.78, surface: 0.78 },
  { id: 'vanity-white', name: 'Painted Vanity', category: 'Vanity', kind: 'floor', size: [1.1, 0.5], height: 0.78, surface: 0.78 },
  { id: 'mirror-round', name: 'Round Wall Mirror', category: 'Mirrors', kind: 'wall', size: [0.8, 0.8], height: 0.8, wallY: 1.55, wallDepth: 0.05 },
  { id: 'mirror-arch', name: 'Arched Wall Mirror', category: 'Mirrors', kind: 'wall', size: [0.6, 1.2], height: 1.2, wallY: 1.35, wallDepth: 0.05 },
  { id: 'stool-vanity', name: 'Rose Vanity Stool', category: 'Seating', kind: 'floor', size: [0.42, 0.42], height: 0.48 },
  { id: 'dresser', name: 'Walnut Dresser', category: 'Storage', kind: 'floor', size: [1.06, 0.54], height: 0.84, surface: 0.84 },
  { id: 'decor-perfume', name: 'Perfume Bottles', category: 'Decor', kind: 'top', size: [0.15, 0.1], height: 0.15 },
  { id: 'decor-jewelry', name: 'Jewellery Box', category: 'Decor', kind: 'top', size: [0.2, 0.14], height: 0.1 },

  // ---- Balcony ----
  { id: 'chair-rattan', name: 'Rattan Lounge Chair', category: 'Outdoor seating', kind: 'floor', size: [0.72, 0.72], height: 0.9 },
  { id: 'outdoor-sofa', name: 'Rattan Sofa', category: 'Outdoor seating', kind: 'floor', size: [1.7, 0.8], height: 0.95 },
  { id: 'bench-wood', name: 'Teak Bench', category: 'Outdoor seating', kind: 'floor', size: [1.4, 0.5], height: 0.85 },
  { id: 'table-bistro', name: 'Bistro Table', category: 'Tables', kind: 'floor', size: [0.6, 0.6], height: 0.7, surface: 0.7 },
  { id: 'planter-box', name: 'Herb Planter Box', category: 'Planters', kind: 'floor', size: [1.0, 0.3], height: 0.75 },
  { id: 'planter-tall', name: 'Tall Grass Planter', category: 'Planters', kind: 'floor', size: [0.4, 0.4], height: 1.3 },
  { id: 'rug-woven', name: 'Jute Outdoor Rug', category: 'Rugs', kind: 'floor', size: [2.0, 1.4], height: 0.03 },
  { id: 'lantern-floor', name: 'Floor Lantern', category: 'Lighting', kind: 'floor', size: [0.3, 0.3], height: 0.56, lamp: true, lightY: 0.28 },
  { id: 'lantern-table', name: 'Table Lantern', category: 'Lighting', kind: 'top', size: [0.2, 0.2], height: 0.37, lamp: true, lightY: 0.18 },

  // ---- More options: beds, tables, seating, rugs ----
  { id: 'bed-canopy', name: 'Canopy Bed', category: 'Beds', kind: 'floor', size: [1.7, 2.15], height: 2.05 },
  { id: 'bed-single', name: 'Cosy Single Bed', category: 'Beds', kind: 'floor', size: [1.1, 2.1], height: 0.9 },
  { id: 'bed-daybed', name: 'Black Iron Daybed', category: 'Beds', kind: 'floor', size: [1.05, 2.1], height: 0.95 },
  { id: 'table-tripod', name: 'Oak Tripod Table', category: 'Tables', kind: 'floor', size: [0.5, 0.5], height: 0.54, surface: 0.54 },
  { id: 'table-cube', name: 'Sage Cube Table', category: 'Tables', kind: 'floor', size: [0.42, 0.42], height: 0.45, surface: 0.45 },
  { id: 'table-drum', name: 'Drum Side Table', category: 'Tables', kind: 'floor', size: [0.46, 0.46], height: 0.5, surface: 0.5 },
  { id: 'chair-barrel', name: 'Blush Barrel Chair', category: 'Seating', kind: 'floor', size: [0.8, 0.8], height: 0.85 },
  { id: 'bench-end', name: 'End-of-Bed Bench', category: 'Seating', kind: 'floor', size: [1.2, 0.45], height: 0.5 },
  { id: 'chair-bean', name: 'Sage Bean Bag', category: 'Seating', kind: 'floor', size: [0.8, 0.8], height: 0.62 },
  { id: 'chair-rocking', name: 'Oak Rocking Chair', category: 'Seating', kind: 'floor', size: [0.52, 0.82], height: 0.95 },
  { id: 'chair-wing', name: 'Blue Wingback Chair', category: 'Seating', kind: 'floor', size: [0.8, 0.78], height: 1.15 },
  { id: 'sofa-chesterfield', name: 'Plum Sofa', category: 'Sofas', kind: 'floor', size: [2.0, 0.95], height: 0.95 },
  { id: 'ottoman', name: 'Linen Ottoman', category: 'Seating', kind: 'floor', size: [0.9, 0.9], height: 0.42, surface: 0.4 },
  { id: 'rug-runner', name: 'Hallway Runner', category: 'Rugs', kind: 'floor', size: [0.8, 2.4], height: 0.03 },
  { id: 'rug-checker', name: 'Checkerboard Rug', category: 'Rugs', kind: 'floor', size: [2.0, 1.4], height: 0.03 },
  { id: 'rug-small-round', name: 'Small Round Rug', category: 'Rugs', kind: 'floor', size: [1.2, 1.2], height: 0.03 },

  // ---- More options: lighting, plants, wall pieces ----
  { id: 'lamp-tripod', name: 'Tripod Floor Lamp', category: 'Lighting', kind: 'floor', size: [0.55, 0.55], height: 1.7, lamp: true, lightY: 1.55 },
  { id: 'lamp-globe', name: 'Globe Lamp', category: 'Lighting', kind: 'top', size: [0.22, 0.22], height: 0.34, lamp: true, lightY: 0.22 },
  { id: 'lamp-mushroom', name: 'Mushroom Lamp', category: 'Lighting', kind: 'top', size: [0.28, 0.28], height: 0.22, lamp: true, lightY: 0.15 },
  { id: 'lamp-pleated', name: 'Pleated Brass Lamp', category: 'Lighting', kind: 'top', size: [0.36, 0.36], height: 0.44, lamp: true, lightY: 0.32 },
  { id: 'plant-monstera', name: 'Monstera', category: 'Plants', kind: 'floor', size: [0.95, 0.95], height: 1.55 },
  { id: 'plant-palm', name: 'Areca Palm', category: 'Plants', kind: 'floor', size: [1.2, 1.2], height: 1.6 },
  { id: 'plant-olive', name: 'Potted Olive Tree', category: 'Plants', kind: 'floor', size: [0.7, 0.7], height: 1.7 },
  { id: 'plant-succulents', name: 'Succulent Trio', category: 'Plants', kind: 'top', size: [0.3, 0.1], height: 0.12 },
  art('art-stripes', 'Warm Stripes', 0.9, 0.6),
  art('art-dots', 'Dot Grid', 0.7, 0.7),
  art('art-face', 'Abstract Portrait', 0.6, 0.8),
  art('art-waves', 'Soft Waves', 1.0, 0.6),
  art('art-mountains', 'Layered Peaks', 0.8, 0.55),
  art('art-fruit', 'Still Life Fruit', 0.6, 0.6),
  { id: 'wall-shelf', name: 'Floating Shelf', category: 'Wall Decor', kind: 'wall', size: [1.0, 0.3], height: 0.3, wallY: 1.5, wallDepth: 0.22 },
  { id: 'wall-clock', name: 'Walnut Wall Clock', category: 'Wall Decor', kind: 'wall', size: [0.5, 0.5], height: 0.5, wallY: 1.9, wallDepth: 0.05 },
  { id: 'wall-sunburst', name: 'Sunburst Mirror', category: 'Wall Decor', kind: 'wall', size: [0.94, 0.94], height: 0.94, wallY: 1.6, wallDepth: 0.04 },
  { id: 'pinboard', name: 'Cork Pinboard', category: 'Wall Decor', kind: 'wall', size: [0.9, 0.6], height: 0.6, wallY: 1.6, wallDepth: 0.04 },

  // ---- More options: storage and decor ----
  { id: 'chest-tall', name: 'Tall Chest of Drawers', category: 'Storage', kind: 'floor', size: [0.86, 0.49], height: 1.21, surface: 1.2 },
  { id: 'trunk', name: 'Blanket Trunk', category: 'Storage', kind: 'floor', size: [0.94, 0.5], height: 0.45, surface: 0.45 },
  { id: 'cube-shelf', name: 'Cube Shelf', category: 'Storage', kind: 'floor', size: [0.8, 0.36], height: 0.8, surface: 0.8 },
  { id: 'shoe-rack', name: 'Shoe Rack', category: 'Storage', kind: 'floor', size: [0.92, 0.36], height: 0.74 },
  { id: 'decor-candles', name: 'Candle Trio', category: 'Decor', kind: 'top', size: [0.2, 0.2], height: 0.18 },
  { id: 'decor-basket', name: 'Woven Blanket Basket', category: 'Decor', kind: 'floor', size: [0.5, 0.5], height: 0.6 },
  { id: 'decor-globe', name: 'World Globe', category: 'Decor', kind: 'top', size: [0.2, 0.2], height: 0.32 },
  { id: 'decor-frames', name: 'Photo Frames', category: 'Decor', kind: 'top', size: [0.32, 0.12], height: 0.22 },
  { id: 'decor-tray', name: 'Tea Tray', category: 'Decor', kind: 'top', size: [0.4, 0.26], height: 0.15 },
  { id: 'blanket-ladder', name: 'Blanket Ladder', category: 'Decor', kind: 'floor', size: [0.6, 0.5], height: 1.6 },

  // ---- More options: living room, study ----
  { id: 'tv-unit', name: 'Media Unit with TV', category: 'Media', kind: 'floor', size: [1.6, 0.42], height: 1.3 },
  { id: 'fireplace', name: 'Mantel Fireplace', category: 'Media', kind: 'floor', size: [1.52, 0.46], height: 1.1 },
  { id: 'shelf-wide', name: 'Wide Bookcase', category: 'Shelves', kind: 'floor', size: [1.2, 0.34], height: 1.12, surface: 1.12 },
  { id: 'easel', name: 'Artist Easel', category: 'Decor', kind: 'floor', size: [0.7, 0.7], height: 1.75 },
  { id: 'desk-organizer', name: 'Pen Cups', category: 'Tech', kind: 'top', size: [0.2, 0.1], height: 0.14 },

  // ---- More options: kitchen ----
  { id: 'fridge', name: 'Tall Fridge', category: 'Appliances', kind: 'floor', size: [0.78, 0.72], height: 1.87 },
  { id: 'stove-counter', name: 'Range Counter', category: 'Counters', kind: 'floor', size: [1.24, 0.64], height: 0.93, surface: 0.9 },
  { id: 'range-hood', name: 'Range Hood', category: 'Appliances', kind: 'wall', size: [0.9, 0.9], height: 0.9, wallY: 1.85, wallDepth: 0.45 },
  { id: 'table-round-dining', name: 'Round Dining Table', category: 'Dining', kind: 'floor', size: [1.0, 1.0], height: 0.76, surface: 0.75 },
  { id: 'microwave', name: 'Microwave', category: 'Appliances', kind: 'top', size: [0.5, 0.38], height: 0.3 },
  { id: 'kettle', name: 'Steel Kettle', category: 'Appliances', kind: 'top', size: [0.26, 0.2], height: 0.24 },
  { id: 'decor-jars', name: 'Pantry Jars', category: 'Decor', kind: 'top', size: [0.34, 0.12], height: 0.22 },

  // ---- More options: dressing room ----
  { id: 'hat-stand', name: 'Hat & Coat Stand', category: 'Storage', kind: 'floor', size: [0.42, 0.42], height: 1.6 },
  { id: 'mirror-stand', name: 'Standing Mirror', category: 'Mirrors', kind: 'floor', size: [0.64, 0.5], height: 1.8 },
  { id: 'jewelry-stand', name: 'Jewellery Stand', category: 'Decor', kind: 'top', size: [0.2, 0.2], height: 0.3 },
  { id: 'makeup-organizer', name: 'Makeup Organiser', category: 'Decor', kind: 'top', size: [0.26, 0.16], height: 0.2 },
  { id: 'ring-light', name: 'Vanity Ring Light', category: 'Lighting', kind: 'top', size: [0.26, 0.2], height: 0.65, lamp: true, lightY: 0.5 },

  // ---- More options: balcony ----
  { id: 'chair-egg', name: 'Hanging Egg Chair', category: 'Outdoor seating', kind: 'floor', size: [0.95, 0.95], height: 2.0 },
  { id: 'umbrella-table', name: 'Parasol Table', category: 'Tables', kind: 'floor', size: [0.72, 0.72], height: 2.35, surface: 0.72 },
  { id: 'deck-chair', name: 'Folding Deck Chair', category: 'Outdoor seating', kind: 'floor', size: [0.62, 1.1], height: 0.9 },
  { id: 'grill', name: 'Charcoal Grill', category: 'Outdoor living', kind: 'floor', size: [0.72, 0.5], height: 1.1 },
  { id: 'plant-stand', name: 'Plant Stand', category: 'Planters', kind: 'floor', size: [0.42, 0.42], height: 0.55, surface: 0.54 },
  { id: 'fire-pit', name: 'Stone Fire Pit', category: 'Outdoor living', kind: 'floor', size: [0.86, 0.86], height: 0.6, lamp: true, lightY: 0.5 },
  { id: 'bar-cart', name: 'Brass Bar Cart', category: 'Outdoor living', kind: 'floor', size: [0.86, 0.46], height: 1.0, surface: 0.85 },
]

export const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((c) => [c.id, c]))
export const getDef = (id) => CATALOG_BY_ID[id]
