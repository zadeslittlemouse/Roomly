import { ROOMS } from '../rooms/rooms.js'
import RoomIllustration from './RoomIllustration.jsx'

export default function ComingSoon({ roomId, onBack, onOpenBedroom }) {
  const room = ROOMS[roomId]
  return (
    <main className="soon">
      <button className="btn btn-quiet" onClick={onBack}>&larr; All rooms</button>
      <div className="soon-card">
        <RoomIllustration roomId={roomId} />
        <div className="soon-body">
          <span className="pill pill-soon">Coming soon</span>
          <h1>{room.name}</h1>
          <p>{room.tagline}</p>
          <p className="muted">The {room.name.toLowerCase()} is still being built, so there is nothing to decorate here yet. It will include:</p>
          <p className="soon-list">{room.planned.join(' · ')}</p>
          <div className="row">
            <button className="btn btn-primary" onClick={onOpenBedroom}>Decorate the bedroom instead</button>
            <button className="btn" onClick={onBack}>Back to rooms</button>
          </div>
        </div>
      </div>
    </main>
  )
}
