import { useMemo, useState } from 'react'
import { CATALOG } from '../data/catalog.js'

export function Thumb({ def, src }) {
  return src ? (
    <img src={src} alt="" width="96" height="96" loading="lazy" draggable="false" />
  ) : (
    <span className="thumb-fallback" aria-hidden="true">{def.name[0]}</span>
  )
}

const KIND_HINT = { floor: 'Floor', top: 'On a table', wall: 'On a wall' }

export default function FurnitureCatalog({ room, placing, thumbs, onPick }) {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CATALOG.filter(
      (c) =>
        (!room.catalogIds || room.catalogIds.includes(c.id)) &&
        (category === 'All' || c.category === category) &&
        (!q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)),
    )
  }, [room, category, query])

  return (
    <div className="catalog">
      <label className="search">
        <span className="sr-only">Search furniture</span>
        <input type="search" placeholder="Search furniture" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div className="chips" role="tablist" aria-label="Furniture categories">
        {['All', ...room.categories].map((c) => (
          <button key={c} role="tab" aria-selected={category === c} className={`chip ${category === c ? 'is-active' : ''}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="empty">Nothing matches &ldquo;{query}&rdquo;. Try another word or choose All.</p>
      ) : (
        <ul className="catalog-grid">
          {items.map((def, i) => (
            <li key={def.id} style={{ '--i': Math.min(i, 16) }}>
              <button className={`item-card ${placing === def.id ? 'is-active' : ''}`} onClick={() => onPick(def.id)} aria-pressed={placing === def.id}>
                <span className="item-thumb"><Thumb def={def} src={thumbs[def.id]} /></span>
                <span className="item-name">{def.name}</span>
                <span className="item-kind">{KIND_HINT[def.kind]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
