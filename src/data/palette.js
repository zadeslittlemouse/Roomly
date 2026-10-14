// Brand colours + the options users can pick for walls, floors, lighting and themes.
// Everything here is plain data. The 3D scene reads these values to set real
// material colours and light intensities.

export const BRAND = {
  ivory: '#F7F3EC',
  cream: '#EDE4D8',
  rose: '#D9A9A5',
  sage: '#9BAA8B',
  burgundy: '#633D46',
  walnut: '#8B674D',
  charcoal: '#38332F',
}

export const WALLS = [
  { id: 'warm-white', name: 'Warm white', color: '#F3EEE6', curtain: '#E6DACB' },
  { id: 'cream', name: 'Cream', color: '#EADFCF', curtain: '#C9B9A2' },
  { id: 'dusty-pink', name: 'Dusty pink', color: '#E3BFBA', curtain: '#F4ECE2' },
  { id: 'sage', name: 'Sage green', color: '#AEBBA0', curtain: '#F1EBDD' },
  { id: 'muted-blue', name: 'Muted blue', color: '#A9B8C4', curtain: '#F1ECE3' },
  { id: 'burgundy', name: 'Deep burgundy', color: '#7B4E58', curtain: '#E4C9C3' },
]

export const FLOORS = [
  { id: 'light-oak', name: 'Light oak', base: '#C99F70', dark: '#B58A5C', style: 'planks' },
  { id: 'walnut', name: 'Warm walnut', base: '#8B674D', dark: '#6F503A', style: 'planks' },
  { id: 'pale-wood', name: 'Pale natural wood', base: '#E0CBA6', dark: '#CDB48B', style: 'planks' },
  { id: 'parquet', name: 'Basketweave parquet', base: '#B98D5E', dark: '#9A7248', style: 'parquet' },
  { id: 'stone', name: 'Stone tile', base: '#D2CABE', dark: '#BFB6A8', grout: '#EAE4DA', style: 'tile' },
  { id: 'checker', name: 'Cream & rose checker', base: '#EDE4D8', dark: '#D9A9A5', grout: '#CFC3B3', style: 'checker' },
  { id: 'deck', name: 'Weathered deck', base: '#9A8670', dark: '#7F6C58', style: 'deck', planks: 14 },
]

// Each lighting preset sets the sky colour, the sun and ambient light, and
// how strongly lamps glow. `lamp` is the intensity of every lamp in the room.
export const LIGHTING = [
  {
    id: 'daylight',
    name: 'Daylight',
    background: '#EFE8DC',
    sky: '#F5F1E6',
    hemi: { sky: '#FFF8EA', ground: '#D8C9B2', intensity: 0.85 },
    sun: { color: '#FFFFFF', intensity: 2.1, position: [4, 7, 5] },
    lamp: 0,
    shadeGlow: 0.0,
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    background: '#EBD2B2',
    sky: '#F6C98F',
    hemi: { sky: '#FFD9A8', ground: '#B98A6A', intensity: 0.6 },
    sun: { color: '#FFB066', intensity: 2.4, position: [6, 3.2, 4] },
    lamp: 0.6,
    shadeGlow: 0.35,
  },
  {
    id: 'evening',
    name: 'Evening',
    background: '#2C2A3A',
    sky: '#2B3350',
    hemi: { sky: '#6C7AA8', ground: '#2A2230', intensity: 0.35 },
    sun: { color: '#8FA2D8', intensity: 0.45, position: [3, 6, 4] },
    lamp: 2.2,
    shadeGlow: 1.0,
  },
]

export const THEMES = [
  { id: 'soft-minimal', name: 'Soft Minimal', blurb: 'Warm white walls, pale wood, morning light', walls: 'warm-white', floor: 'pale-wood', lighting: 'daylight' },
  { id: 'vintage-romance', name: 'Vintage Romance', blurb: 'Dusty pink, walnut floors, golden light', walls: 'dusty-pink', floor: 'walnut', lighting: 'golden-hour' },
  { id: 'sage-sanctuary', name: 'Sage Sanctuary', blurb: 'Sage walls, light oak, soft daylight', walls: 'sage', floor: 'light-oak', lighting: 'daylight' },
  { id: 'warm-neutral', name: 'Warm Neutral', blurb: 'Cream walls, oak floors, golden hour', walls: 'cream', floor: 'light-oak', lighting: 'golden-hour' },
]

export const byId = (list, id, fallback = list[0]) => list.find((x) => x.id === id) || fallback
