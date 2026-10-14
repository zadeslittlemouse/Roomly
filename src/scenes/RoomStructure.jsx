// The room shell: floor, back + left walls (the front and right sides stay open
// so you can see in), baseboards, a window, curtains and a floor slab.
import { useMemo, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOM_SIZE } from '../rooms/rooms.js'
import { WALL_T } from '../utils/placement.js'
import { BRAND } from '../data/palette.js'
import { makeFloorTextures } from '../utils/floorTexture.js'
import { LerpColor, prefersReducedMotion } from './SceneEffects.jsx'

const { W, D, H } = ROOM_SIZE

// Curtain panel: a plane bent into soft vertical folds.
function useCurtainGeometry(width, height) {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(width, height, 28, 1)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      pos.setZ(i, Math.sin((x / width) * Math.PI * 7) * 0.035)
    }
    g.computeVertexNormals()
    return g
  }, [width, height])
}

function Curtain({ x, y, width, height, color, phase = 0 }) {
  const geo = useCurtainGeometry(width, height)
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo])
  const reduced = prefersReducedMotion()
  // a very gentle breeze: the folds drift a little and the hem moves most
  useFrame(({ clock }) => {
    if (reduced) return
    const pos = geo.attributes.position
    const t = clock.elapsedTime
    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3]
      const by = base[i * 3 + 1]
      const hem = 1 - (by + height / 2) / height // 0 at the top, 1 at the bottom
      pos.setZ(i, base[i * 3 + 2] + Math.sin(t * 0.9 + phase + bx * 4) * 0.012 * hem + Math.sin(t * 0.5 + phase) * 0.02 * hem)
    }
    pos.needsUpdate = true
  })
  return (
    <mesh geometry={geo} position={[x, y, -D / 2 + 0.08]} receiveShadow>
      <LerpColor color={color} roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  )
}

export default function RoomStructure({ room, wallColor, curtainColor, floor, sky }) {
  const win = room.window // may be null (no window), a window, or a door (win.door)
  const hasLeftRail = room.leftWall === 'rail' // balcony: open railing instead of a left wall
  const winL = win ? win.u - win.width / 2 : 0
  const winH = win ? win.top - win.bottom : 0

  const floorTex = useMemo(() => makeFloorTextures(floor), [floor])
  useEffect(() => () => { floorTex.map.dispose(); floorTex.bumpMap.dispose() }, [floorTex])

  // Back wall = a big rectangle, with a rectangular hole when there is a window or door.
  const backWall = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-W / 2 - WALL_T, 0)
    s.lineTo(W / 2, 0)
    s.lineTo(W / 2, H)
    s.lineTo(-W / 2 - WALL_T, H)
    s.closePath()
    if (win) {
      const hole = new THREE.Path()
      hole.moveTo(winL, win.bottom)
      hole.lineTo(winL + win.width, win.bottom)
      hole.lineTo(winL + win.width, win.top)
      hole.lineTo(winL, win.top)
      hole.closePath()
      s.holes.push(hole)
    }
    return new THREE.ExtrudeGeometry(s, { depth: WALL_T, bevelEnabled: false })
  }, [win, winL])
  useEffect(() => () => backWall.dispose(), [backWall])

  const frame = '#F2ECE2'
  const ft = 0.05
  const showCurtains = win && !win.door && win.curtains !== false

  return (
    <group>
      {/* Floor: planks on top, solid slab underneath */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={floorTex.map} bumpMap={floorTex.bumpMap} bumpScale={1.2} roughness={floorTex.rough} />
      </mesh>
      {/* the slab sits just BELOW the floor surface; at the same height the two surfaces flicker */}
      <mesh position={[0, -0.108, 0]} receiveShadow>
        <boxGeometry args={[W + 0.01, 0.2, D + 0.01]} />
        <meshStandardMaterial color="#5A4636" roughness={0.9} />
      </mesh>

      {/* Back wall (receives shadows but does not cast them, so the sun can reach the room) */}
      <mesh geometry={backWall} position={[0, 0, -D / 2 - WALL_T]} receiveShadow>
        <LerpColor color={wallColor} roughness={0.95} />
      </mesh>

      {/* Left side: a wall, or a railing on the balcony */}
      {hasLeftRail ? (
        <group position={[-W / 2 + 0.03, 0, 0]}>
          <mesh position={[0, 1.02, 0]} castShadow>
            <boxGeometry args={[0.07, 0.05, D]} />
            <meshStandardMaterial color={BRAND.charcoal} roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.06, 0]} castShadow>
            <boxGeometry args={[0.07, 0.1, D]} />
            <meshStandardMaterial color={BRAND.charcoal} roughness={0.5} metalness={0.4} />
          </mesh>
          {Array.from({ length: Math.round(D / 0.14) + 1 }).map((_, i) => (
            <mesh key={i} position={[0, 0.54, -D / 2 + 0.03 + i * ((D - 0.06) / Math.round(D / 0.14))]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.98, 6]} />
              <meshStandardMaterial color={BRAND.charcoal} roughness={0.5} metalness={0.4} />
            </mesh>
          ))}
        </group>
      ) : (
        <mesh position={[-W / 2 - WALL_T / 2, H / 2, 0]} receiveShadow>
          <boxGeometry args={[WALL_T, H, D]} />
          <LerpColor color={wallColor} roughness={0.95} />
        </mesh>
      )}

      {/* Baseboards */}
      <mesh position={[0, 0.06, -D / 2 + 0.015]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.12, 0.03]} />
        <meshStandardMaterial color={BRAND.ivory} roughness={0.7} />
      </mesh>
      {!hasLeftRail && (
        <mesh position={[-W / 2 + 0.015, 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.03, 0.12, D]} />
          <meshStandardMaterial color={BRAND.ivory} roughness={0.7} />
        </mesh>
      )}

      {/* Window or door: sky behind, thin glass, frame with a cross bar */}
      {win && (
        <>
          <mesh position={[win.u, win.bottom + winH / 2, -D / 2 - WALL_T - 0.05]}>
            <planeGeometry args={[win.width + 0.4, winH + 0.4]} />
            <LerpColor basic color={sky} toneMapped={false} />
          </mesh>
          <mesh position={[win.u, win.bottom + winH / 2, -D / 2 - WALL_T / 2]}>
            <planeGeometry args={[win.width, winH]} />
            <meshStandardMaterial color="#DDEBF2" transparent opacity={0.18} roughness={0.1} />
          </mesh>
          {[
            !win.door && [win.u, win.bottom - ft / 2, win.width + ft * 2, ft],
            [win.u, win.top + ft / 2, win.width + ft * 2, ft],
            [winL - ft / 2, win.bottom + winH / 2, ft, winH],
            [winL + win.width + ft / 2, win.bottom + winH / 2, ft, winH],
            [win.u, win.bottom + winH / 2, win.width, 0.03],
            [win.u, win.bottom + winH / 2, 0.03, winH],
          ]
            .filter(Boolean)
            .map(([x, y, w, h], i) => (
              <mesh key={i} position={[x, y, -D / 2 - WALL_T / 2]} castShadow>
                <boxGeometry args={[w, h, WALL_T + 0.02]} />
                <meshStandardMaterial color={frame} roughness={0.6} />
              </mesh>
            ))}
          {!win.door && (
            <mesh position={[win.u, win.bottom - 0.04, -D / 2 + 0.05]} castShadow receiveShadow>
              <boxGeometry args={[win.width + 0.25, 0.04, 0.2]} />
              <meshStandardMaterial color={frame} roughness={0.6} />
            </mesh>
          )}
        </>
      )}

      {/* Curtains: rod + two folded panels. Their colour follows the wall colour. */}
      {showCurtains && (
        <>
          <mesh position={[win.u, win.top + 0.22, -D / 2 + 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, win.width + 0.9, 10]} />
            <meshStandardMaterial color="#B89A6A" metalness={0.8} roughness={0.35} />
          </mesh>
          <Curtain x={winL - 0.15} y={(win.top + 0.2) / 2 + 0.02} width={0.45} height={win.top + 0.15} color={curtainColor} phase={0} />
          <Curtain x={winL + win.width + 0.15} y={(win.top + 0.2) / 2 + 0.02} width={0.45} height={win.top + 0.15} color={curtainColor} phase={1.7} />
        </>
      )}
    </group>
  )
}
