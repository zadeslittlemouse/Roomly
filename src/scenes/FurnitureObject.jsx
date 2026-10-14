// One piece of furniture in the 3D scene. It builds the model from furniture/models.js,
// and animates: a springy pop-in when placed, smooth gliding and turning when moved or
// rotated, a softly pulsing outline when selected, and lamp glow that fades in and out.
import { useMemo, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ALL_MODELS as MODELS } from '../furniture/index.js'
import { disposeGroup } from '../utils/three-helpers.js'
import { wallPose } from '../utils/placement.js'
import { BRAND } from '../data/palette.js'
import { prefersReducedMotion } from './SceneEffects.jsx'

// World position + rotation of an item. `y` is the height it rests at (tabletop for lamps).
export function itemTransform(item, def, y = 0) {
  if (def.kind === 'wall') {
    const p = wallPose(item.wall, item.u, def.wallY, def.wallDepth)
    return { position: p.position, rotY: p.rotY }
  }
  return { position: [item.x, y, item.z], rotY: item.rot || 0 }
}

const easeOutBack = (t) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function Outline({ def }) {
  const [w, d] = def.size
  const isWall = def.kind === 'wall'
  const args = isWall ? [w + 0.08, d + 0.08, (def.wallDepth || 0.04) + 0.06] : [w + 0.05, def.height + 0.04, d + 0.05]
  const geo = useMemo(() => new THREE.BoxGeometry(...args), [args[0], args[1], args[2]]) // eslint-disable-line
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo])
  const fill = useRef()
  useEffect(() => () => { geo.dispose(); edges.dispose() }, [geo, edges])
  useFrame(({ clock }) => {
    if (fill.current && !prefersReducedMotion()) fill.current.opacity = 0.14 + Math.sin(clock.elapsedTime * 3.2) * 0.07
  })
  const y = isWall ? 0 : def.height / 2
  return (
    <group position={[0, y, 0]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={BRAND.burgundy} />
      </lineSegments>
      <mesh geometry={geo}>
        <meshBasicMaterial ref={fill} color={BRAND.rose} transparent opacity={0.14} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function FurnitureObject({ item, def, y = 0, selected, glow, interactive, handlers, delay = 0 }) {
  const model = useMemo(() => MODELS[def.id](), [def.id])
  useEffect(() => () => disposeGroup(model), [model])

  const ref = useRef()
  const st = useRef({ inited: false, t: -delay, done: false, spawnId: def.id })
  const reduced = prefersReducedMotion()

  // swapping to another style plays the pop-in again
  useEffect(() => {
    if (st.current.spawnId !== def.id) {
      st.current.spawnId = def.id
      st.current.t = 0
      st.current.done = false
    }
  }, [def.id])

  const { position, rotY } = itemTransform(item, def, y)

  useFrame((_, rawDt) => {
    const g = ref.current
    if (!g) return
    const dt = Math.min(rawDt, 0.05)
    const s = st.current
    if (!s.inited || reduced) {
      g.position.set(position[0], position[1], position[2])
      g.rotation.y = rotY
      s.inited = true
    } else {
      // glide towards the target position and turn the short way round
      const k = 1 - Math.exp(-dt * 18)
      g.position.x += (position[0] - g.position.x) * k
      g.position.y += (position[1] - g.position.y) * k
      g.position.z += (position[2] - g.position.z) * k
      const diff = ((((rotY - g.rotation.y + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI
      g.rotation.y += diff * k
    }
    if (!s.done) {
      s.t += dt
      const p = reduced ? 1 : Math.min(Math.max(s.t / 0.5, 0), 1)
      g.scale.setScalar(p <= 0 ? 0.0001 : Math.max(easeOutBack(p), 0.0001))
      if (p >= 1) {
        g.scale.setScalar(1)
        s.done = true
      }
    }
    // lamp shades fade their glow up and down with the lighting preset
    const shades = model.userData.shades
    if (shades) {
      const kk = 1 - Math.exp(-dt * 4)
      shades.forEach((m) => { m.emissiveIntensity += (glow - m.emissiveIntensity) * kk })
    }
  })

  return (
    <group
      ref={ref}
      scale={0.0001}
      onPointerDown={interactive ? (e) => handlers.down(e, item, def) : undefined}
      onPointerMove={interactive ? (e) => handlers.move(e, item, def) : undefined}
      onClick={interactive ? (e) => handlers.click(e, item, def) : undefined}
      onPointerOver={interactive ? (e) => handlers.over(e, item, def) : undefined}
      onPointerOut={interactive ? (e) => handlers.out(e, item, def) : undefined}
    >
      <primitive object={model} />
      {selected && <Outline def={def} />}
    </group>
  )
}
