import { THEMES, WALLS, FLOORS, byId } from '../data/palette.js'

export default function ThemeSelector({ value, onChange }) {
  return (
    <fieldset className="control-group">
      <legend>Themes</legend>
      <div className="theme-grid">
        {THEMES.map((t) => (
          <button key={t.id} className={`theme-card ${value === t.id ? 'is-active' : ''}`} aria-pressed={value === t.id} onClick={() => onChange(t.id)}>
            <span className="theme-swatch">
              <i style={{ background: byId(WALLS, t.walls).color }} />
              <i style={{ background: byId(FLOORS, t.floor).base }} />
            </span>
            <span className="theme-name">{t.name}</span>
            <span className="theme-blurb">{t.blurb}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
