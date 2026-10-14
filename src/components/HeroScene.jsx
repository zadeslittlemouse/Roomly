// A live, slowly orbiting 3D bedroom for the homepage. It switches between the four
// themes on its own (or when a visitor picks one), so the moods and lighting can be seen working.
import { useMemo } from 'react'
import RoomScene from '../scenes/RoomScene.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import RoomIllustration from './RoomIllustration.jsx'
import { ROOMS } from '../rooms/rooms.js'
import { createDefaultDesign } from '../utils/design.js'
import { useInView } from '../hooks/useInView.js'

const NOOP = {}

export default function HeroScene({ mood }) {
  const room = ROOMS['reading-room'] // a preview-only room that is not one of the six decorating rooms
  const base = useMemo(() => createDefaultDesign('reading-room'), [])
  const design = useMemo(
    () => ({ ...base, walls: mood.walls, lighting: mood.lighting, floor: 'light-oak', theme: mood.id }),
    [base, mood],
  )
  const [ref, visible] = useInView({ threshold: 0.05 })
  return (
    <div className="hero-canvas" ref={ref}>
      <ErrorBoundary fallback={<RoomIllustration roomId="bedroom" />}>
        <RoomScene
          room={room}
          design={design}
          selected={null}
          placing={null}
          actions={NOOP}
          notify={() => {}}
          interactive={false}
          userControl={false}
          autoOrbit
          intro
          cameraScale={0.86}
          minAz={0.3}
          maxAz={1.1}
          introAngle={0.3}
          orbitSpeed={0.3}
          motes={12}
          paused={!visible}
        />
      </ErrorBoundary>
    </div>
  )
}
