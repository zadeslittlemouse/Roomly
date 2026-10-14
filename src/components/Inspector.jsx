// Controls for the currently selected item: rotate, swap style, remove, deselect.
import { CATALOG } from '../data/catalog.js'
import { Thumb } from './FurnitureCatalog.jsx'

export default function Inspector({ def, ids, thumbs, onRotate, onReplace, onRemove, onDone }) {
  const isWall = def.kind === 'wall'
  const alternatives = CATALOG.filter((c) => c.category === def.category && c.kind === def.kind && (!ids || ids.includes(c.id)))
  return (
    <section className="inspector" aria-label={`Editing ${def.name}`}>
      <div className="inspector-head">
        <div>
          <span className="eyebrow">Selected</span>
          <strong>{def.name}</strong>
        </div>
        <button className="btn btn-quiet" onClick={onDone}>Done</button>
      </div>
      <div className="inspector-actions">
        <button className="btn" onClick={() => onRotate(-1)} disabled={isWall} title={isWall ? 'Wall art cannot rotate' : 'Rotate left'}>&#8630; Rotate left</button>
        <button className="btn" onClick={() => onRotate(1)} disabled={isWall} title={isWall ? 'Wall art cannot rotate' : 'Rotate right'}>Rotate right &#8631;</button>
        <button className="btn btn-danger" onClick={onRemove}>Remove</button>
      </div>
      {alternatives.length > 1 && (
        <div className="swap">
          <span className="eyebrow">Swap style</span>
          <div className="swap-row">
            {alternatives.map((alt) => (
              <button key={alt.id} className={`swap-btn ${alt.id === def.id ? 'is-active' : ''}`} onClick={() => alt.id !== def.id && onReplace(alt.id)} aria-label={alt.name} aria-pressed={alt.id === def.id} title={alt.name}>
                <Thumb def={alt} src={thumbs[alt.id]} />
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="hint">{isWall ? 'Drag the picture along the walls to move it.' : 'Drag the item on the floor to move it. Orbiting is paused while you drag.'}</p>
    </section>
  )
}
