import { LIGHTING, byId } from '../data/palette.js'

// A short, poetic title based on the light you chose.
const TITLES = {
  daylight: 'The Sunday Morning',
  'golden-hour': 'The Golden Hour',
  evening: 'The Quiet Evening',
}

export function designTitle(design, roomName) {
  return `${TITLES[byId(LIGHTING, design.lighting).id]} ${roomName}`
}

const CONFETTI = ['#D9A9A5', '#9BAA8B', '#633D46', '#8B674D', '#EDE4D8', '#F7F3EC']

// A short burst of confetti when you finish a room (hidden if the visitor prefers reduced motion).
function Confetti() {
  const pieces = Array.from({ length: 46 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    delay: `${((i * 53) % 90) / 100}s`,
    dur: `${2.4 + ((i * 31) % 18) / 10}s`,
    color: CONFETTI[i % CONFETTI.length],
    rot: `${(i * 47) % 360}deg`,
  }))
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i key={i} style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur, background: p.color, '--r': p.rot }} />
      ))}
    </div>
  )
}

export default function CompletionScreen({ design, roomName, onKeepEditing, onRooms }) {
  return (
    <div className="complete">
      <Confetti />
      <div className="complete-card">
        <span className="eyebrow">{roomName} · finished</span>
        <h1>{designTitle(design, roomName)}</h1>
        <p>{design.furniture.length} pieces, arranged by you. Drag the room to look around.</p>
        <div className="row">
          <button className="btn btn-primary" onClick={onKeepEditing}>Keep editing</button>
          <button className="btn" onClick={onRooms}>Back to rooms</button>
        </div>
        <span className="stamp">Designed in ROOMLY</span>
      </div>
    </div>
  )
}
