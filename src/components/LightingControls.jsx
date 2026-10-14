import { LIGHTING } from '../data/palette.js'

export default function LightingControls({ value, onChange }) {
  return (
    <fieldset className="control-group">
      <legend>Lighting</legend>
      <div className="seg">
        {LIGHTING.map((l) => (
          <button key={l.id} className={`seg-btn ${value === l.id ? 'is-active' : ''}`} aria-pressed={value === l.id} onClick={() => onChange(l.id)}>
            <span className="seg-dot" style={{ background: l.sky }} />
            {l.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
