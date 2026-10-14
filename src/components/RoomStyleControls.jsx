import { WALLS, FLOORS } from '../data/palette.js'

export default function RoomStyleControls({ walls, floor, onWalls, onFloor }) {
  return (
    <>
      <fieldset className="control-group">
        <legend>Walls</legend>
        <div className="swatches">
          {WALLS.map((w) => (
            <button key={w.id} className={`swatch ${walls === w.id ? 'is-active' : ''}`} style={{ background: w.color }} aria-label={w.name} aria-pressed={walls === w.id} title={w.name} onClick={() => onWalls(w.id)} />
          ))}
        </div>
      </fieldset>
      <fieldset className="control-group">
        <legend>Floor</legend>
        <div className="seg">
          {FLOORS.map((f) => (
            <button key={f.id} className={`seg-btn ${floor === f.id ? 'is-active' : ''}`} aria-pressed={floor === f.id} onClick={() => onFloor(f.id)}>
              <span className="seg-dot" style={{ background: f.base }} />
              {f.name}
            </button>
          ))}
        </div>
      </fieldset>
    </>
  )
}
