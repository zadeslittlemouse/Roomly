// The interactive 3D scene: lights, room, furniture, placement preview and all
// pointer interactions (place, select, drag-to-move). It only READS the editor
// state and calls editor actions, so the UI and the scene always agree.
import { useMemo, useRef, useState, useEffect, memo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import RoomStructure from './RoomStructure.jsx'
import { LightingRig, Motes, CameraRig } from './SceneEffects.jsx'
import FurnitureObject from './FurnitureObject.jsx'
import Ghost from './Ghost.jsx'
import { ROOM_SIZE } from '../rooms/rooms.js'
import { getDef } from '../data/catalog.js'
import { WALLS, FLOORS, LIGHTING, byId } from '../data/palette.js'
import { clampFloor, clampWall, clampOnSurface, overlapsWindow, snap } from '../utils/placement.js'

const { W, D, H } = ROOM_SIZE
const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const Furniture = memo(FurnitureObject)

// Invisible planes that catch the mouse so we know where on the floor / walls it points.
function Catcher({ position, rotation, size, handlers }) {
  return (
    <mesh position={position} rotation={rotation} {...handlers}>
      <planeGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

function Scene({ room, design, selected, placing, actions, notify, interactive, intro = false, autoOrbit = false, userControl = true, cameraScale = 1, minAz = -0.2, maxAz = 1.6, introAngle = 0.75, orbitSpeed = 0.5, motes = 70 }) {
  const controls = useThree((s) => s.controls)
  const [ghost, setGhost] = useState(null)
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)

  const lighting = byId(LIGHTING, design.lighting)
  const wall = byId(WALLS, design.walls)
  const floor = byId(FLOORS, design.floor)
  const placeDef = placing ? getDef(placing) : null

  // Always-fresh values for the (stable) event handlers below.
  const live = useRef({})
  live.current = { design, selected, placing, placeDef, actions, notify, controls, room }

  useEffect(() => { if (!placing) setGhost(null) }, [placing])
  useEffect(() => {
    document.body.style.cursor = placing ? 'crosshair' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [placing])

  // furniture present when the room opens drops in one piece at a time
  const introOrder = useRef(new Map(design.furniture.map((f, i) => [f.uid, i]))).current

  const byUid = useMemo(() => new Map(design.furniture.map((f) => [f.uid, f])), [design.furniture])

  /* ---- pose helpers (where would the item go for this pointer position?) ---- */
  const H_ = useMemo(() => {
    const floorPose = (def, p) => ({ ...clampFloor(def, snap(p.x), snap(p.z), 0), rot: 0 })
    const wallPose = (def, w, p) => {
      const u = clampWall(def, w, snap(w === 'back' ? p.x : p.z))
      return { wall: w, u, valid: !overlapsWindow(live.current.room, def, w, u, def.wallY) }
    }
    const surfacePose = (table, tdef, def, p) => {
      const q = clampOnSurface(table, tdef, def, p.x, p.z)
      return { x: q.x, z: q.z, rot: table.rot || 0, parent: table.uid, y: tdef.surface, valid: true }
    }

    const endDrag = () => {
      const { controls: c, actions: a } = live.current
      drag.current = null
      setDragging(false)
      if (c) c.enabled = true
      a.moveEnd()
      document.body.style.cursor = 'auto'
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    }
    const startDrag = (e, item, def) => {
      const { controls: c } = live.current
      if (c) c.enabled = false // stop the camera from orbiting while we carry furniture
      let offX = 0
      let offZ = 0
      if (def.kind === 'floor') {
        const v = new THREE.Vector3()
        if (e.ray.intersectPlane(FLOOR_PLANE, v)) { offX = item.x - v.x; offZ = item.z - v.z }
      }
      drag.current = { uid: item.uid, kind: def.kind, def, offX, offZ }
      setDragging(true)
      document.body.style.cursor = 'grabbing'
      window.addEventListener('pointerup', endDrag)
      window.addEventListener('pointercancel', endDrag)
    }

    const furniture = {
      down(e, item, def) {
        const L = live.current
        if (L.placeDef) return // while placing, clicks go through to the floor / walls
        e.stopPropagation()
        if (L.selected === item.uid) startDrag(e, item, def)
        else L.actions.select(item.uid)
      },
      move(e, item, def) {
        const L = live.current
        const d = drag.current
        if (d && d.kind === 'top' && d.uid !== item.uid && def.surface != null) {
          const q = clampOnSurface(item, def, d.def, e.point.x, e.point.z)
          L.actions.moveLive(d.uid, { x: q.x, z: q.z, parent: item.uid })
          e.stopPropagation()
          return
        }
        if (!d && L.placeDef?.kind === 'top' && def.surface != null) {
          setGhost(surfacePose(item, def, L.placeDef, e.point))
          e.stopPropagation()
        }
      },
      click(e, item, def) {
        const L = live.current
        if (L.placeDef) {
          if (L.placeDef.kind === 'top' && def.surface != null) {
            const p = surfacePose(item, def, L.placeDef, e.point)
            L.actions.add({ id: L.placeDef.id, x: p.x, z: p.z, rot: p.rot, parent: p.parent })
            e.stopPropagation()
          }
          return
        }
        e.stopPropagation() // do not let the click fall through and deselect
      },
      over() { if (!live.current.placeDef && !drag.current) document.body.style.cursor = 'pointer' },
      out() { if (!live.current.placeDef && !drag.current) document.body.style.cursor = 'auto' },
    }

    const ground = {
      onPointerMove(e) {
        const L = live.current
        const d = drag.current
        if (d) {
          if (d.kind === 'floor') L.actions.moveLive(d.uid, { x: snap(e.point.x + d.offX), z: snap(e.point.z + d.offZ) })
          return
        }
        const def = L.placeDef
        if (!def) return
        if (def.kind === 'floor') setGhost({ ...floorPose(def, e.point), y: 0, valid: true })
        else if (def.kind === 'top') setGhost({ x: e.point.x, z: e.point.z, y: 0, rot: 0, valid: false })
      },
      onClick(e) {
        const L = live.current
        const def = L.placeDef
        if (!def) { L.actions.select(null); return }
        e.stopPropagation()
        if (def.kind === 'floor') {
          const p = floorPose(def, e.point)
          L.actions.add({ id: def.id, x: p.x, z: p.z, rot: 0 })
        } else if (def.kind === 'top') {
          L.notify('This item rests on a table. Hover over a table and click.')
        } else {
          L.notify('Wall art hangs on the back or left wall. Click a wall.')
        }
      },
    }

    const wallHandlers = (w) => ({
      onPointerMove(e) {
        const L = live.current
        const d = drag.current
        if (d && d.kind === 'wall') {
          const h = wallPose(d.def, w, e.point)
          if (h.valid) L.actions.moveLive(d.uid, { wall: h.wall, u: h.u })
          return
        }
        if (!d && L.placeDef?.kind === 'wall') setGhost(wallPose(L.placeDef, w, e.point))
      },
      onClick(e) {
        const L = live.current
        const def = L.placeDef
        if (!def) { L.actions.select(null); return }
        e.stopPropagation()
        if (def.kind !== 'wall') { L.notify(def.kind === 'top' ? 'This item rests on a table.' : 'Click the floor to place this.'); return }
        const h = wallPose(def, w, e.point)
        if (!h.valid) { L.notify('The window is in the way. Try another spot.'); return }
        L.actions.add({ id: def.id, wall: h.wall, u: h.u })
      },
    })

    return { furniture, ground, back: wallHandlers('back'), left: wallHandlers('left') }
  }, [])

  /* ---- lamp lights: a fixed pool of 4 so the shader never has to recompile ---- */
  const lamps = useMemo(() => {
    return design.furniture
      .map((f) => ({ f, def: getDef(f.id) }))
      .filter(({ def }) => def?.lamp)
      .slice(0, 4)
      .map(({ f, def }) => {
        const parent = f.parent && byUid.get(f.parent)
        const base = parent ? getDef(parent.id).surface : 0
        return [f.x, base + def.lightY, f.z]
      })
  }, [design.furniture, byUid])

  const shadowSize = typeof window !== 'undefined' && window.innerWidth < 700 ? 1024 : 2048

  return (
    <>
      <CameraRig intro={intro} autoOrbit={autoOrbit} cameraScale={cameraScale} minAz={minAz} maxAz={maxAz} introAngle={introAngle} orbitSpeed={orbitSpeed} />
      <LightingRig lighting={lighting} lamps={lamps} shadowSize={shadowSize} />
      {motes > 0 && <Motes lighting={lighting} count={motes} />}

      <RoomStructure room={room} wallColor={wall.color} curtainColor={wall.curtain} floor={floor} sky={lighting.sky} />

      {design.furniture.map((item) => {
        const def = getDef(item.id)
        const parent = item.parent && byUid.get(item.parent)
        const y = parent ? getDef(parent.id).surface : 0
        return (
          <Furniture
            key={item.uid}
            item={item}
            def={def}
            y={y}
            selected={interactive && selected === item.uid}
            glow={lighting.shadeGlow}
            interactive={interactive}
            handlers={H_.furniture}
            delay={introOrder.has(item.uid) ? 0.25 + introOrder.get(item.uid) * 0.07 : 0}
          />
        )
      })}

      {ghost && placeDef && <Ghost def={placeDef} ghost={ghost} />}

      {/* Mouse catchers (invisible) */}
      {interactive && (
        <>
          <Catcher position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[40, 40]} handlers={H_.ground} />
          <Catcher position={[0, H / 2, -D / 2 + 0.005]} rotation={[0, 0, 0]} size={[W, H]} handlers={H_.back} />
          <Catcher position={[-W / 2 + 0.005, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} size={[D, H]} handlers={H_.left} />
        </>
      )}

      <OrbitControls
        makeDefault
        enabled={!dragging}
        enableRotate={userControl}
        enableZoom={userControl}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        target={[0, 0.9, 0]}
        minDistance={3.5}
        maxDistance={16}
        minPolarAngle={0.35}
        maxPolarAngle={1.42}
        minAzimuthAngle={minAz}
        maxAzimuthAngle={maxAz}
      />
    </>
  )
}

export default function RoomScene({ interactive = true, paused = false, userControl = true, ...props }) {
  return (
    <Canvas
      shadows
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.75]}
      camera={{ position: [6.4, 5.4, 7.6], fov: 36, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => {
        if (!interactive) return
        props.placing ? props.actions.cancelPlace() : props.actions.select(null)
      }}
      style={{ touchAction: userControl ? 'none' : 'pan-y' }}
    >
      <Scene {...props} interactive={interactive} userControl={userControl} />
    </Canvas>
  )
}
