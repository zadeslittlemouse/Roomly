// Small animated helpers used inside the 3D scene:
//   LerpColor  - a material whose colour fades smoothly to a new colour
//   LightingRig- the lights; changing the lighting preset fades instead of snapping
//   Motes      - drifting dust (day) or fireflies (evening) for atmosphere
//   CameraRig  - the opening camera swoop and the slow orbit on the finish screen
import { useRef, useMemo, useEffect, useLayoutEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function LerpColor({ color, basic = false, speed = 5, ...props }) {
  const ref = useRef()
  const first = useRef(color) // the prop given to the material never changes, so React does not snap it
  const target = useMemo(() => new THREE.Color(color), [color])
  useFrame((_, dt) => {
    if (ref.current) ref.current.color.lerp(target, 1 - Math.exp(-Math.min(dt, 0.05) * speed))
  })
  return basic ? <meshBasicMaterial ref={ref} color={first.current} {...props} /> : <meshStandardMaterial ref={ref} color={first.current} {...props} />
}

export function LightingRig({ lighting, lamps, shadowSize }) {
  const { scene } = useThree()
  const init = useRef(lighting).current
  const hemi = useRef()
  const sun = useRef()
  const points = useRef([])
  const bg = useMemo(() => new THREE.Color(init.background), [init])
  useEffect(() => {
    scene.background = bg
    return () => { scene.background = null }
  }, [scene, bg])

  const t = useMemo(
    () => ({
      bg: new THREE.Color(lighting.background),
      hs: new THREE.Color(lighting.hemi.sky),
      hg: new THREE.Color(lighting.hemi.ground),
      sc: new THREE.Color(lighting.sun.color),
      sp: new THREE.Vector3(...lighting.sun.position),
    }),
    [lighting],
  )

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 3.2)
    bg.lerp(t.bg, k)
    if (hemi.current) {
      hemi.current.color.lerp(t.hs, k)
      hemi.current.groundColor.lerp(t.hg, k)
      hemi.current.intensity += (lighting.hemi.intensity * 1.5 - hemi.current.intensity) * k
    }
    if (sun.current) {
      sun.current.color.lerp(t.sc, k)
      sun.current.position.lerp(t.sp, k)
      sun.current.intensity += (lighting.sun.intensity * 1.4 - sun.current.intensity) * k
    }
    points.current.forEach((p, i) => {
      if (!p) return
      const want = lamps[i] ? lighting.lamp * 4 : 0
      p.intensity += (want - p.intensity) * (1 - Math.exp(-Math.min(dt, 0.05) * 5))
    })
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={[init.hemi.sky, init.hemi.ground, init.hemi.intensity * 1.5]} />
      <directionalLight
        ref={sun}
        color={init.sun.color}
        intensity={init.sun.intensity * 1.4}
        position={init.sun.position}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      {[0, 1, 2, 3].map((i) => (
        <pointLight key={i} ref={(el) => (points.current[i] = el)} color="#FFC98A" position={lamps[i] || [0, 2, 0]} intensity={0} distance={6} decay={2} />
      ))}
    </>
  )
}

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.5)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

export function Motes({ lighting, count = 70 }) {
  const ref = useRef()
  const matRef = useRef()
  const reduced = prefersReducedMotion()
  const tex = useMemo(dotTexture, [])
  useEffect(() => () => tex.dispose(), [tex])
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 4.6,
        y: 0.3 + Math.random() * 2.1,
        z: (Math.random() - 0.5) * 4,
        s: 0.15 + Math.random() * 0.35,
        p: Math.random() * 6.28,
      })),
    [count],
  )
  const positions = useMemo(() => new Float32Array(count * 3), [count])
  const col = useMemo(() => new THREE.Color(), [])
  const evening = lighting.id === 'evening'
  const wantColor = useMemo(() => new THREE.Color(evening ? '#FFE3A0' : lighting.id === 'golden-hour' ? '#FFE0B0' : '#FFFFFF'), [evening, lighting.id])
  const wantOpacity = evening ? 0.95 : lighting.id === 'golden-hour' ? 0.6 : 0.4

  useFrame(({ clock }, dt) => {
    const time = reduced ? 0 : clock.elapsedTime
    data.forEach((d, i) => {
      positions[i * 3] = d.x + Math.sin(time * d.s + d.p) * 0.25
      positions[i * 3 + 1] = d.y + Math.sin(time * d.s * 0.8 + d.p * 2) * (evening ? 0.35 : 0.18)
      positions[i * 3 + 2] = d.z + Math.cos(time * d.s + d.p) * 0.25
    })
    if (ref.current) ref.current.attributes.position.needsUpdate = true
    if (matRef.current) {
      const k = 1 - Math.exp(-Math.min(dt, 0.05) * 3)
      matRef.current.color.lerp(wantColor, k)
      matRef.current.opacity += (wantOpacity - matRef.current.opacity) * k
      // fireflies twinkle a little
      matRef.current.size = evening ? 0.1 + Math.sin(clock.elapsedTime * 2) * 0.015 : 0.06
    }
  })
  void col
  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={ref}>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} map={tex} size={0.06} transparent opacity={0.4} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  )
}

const TARGET = new THREE.Vector3(0, 0.9, 0)

export function CameraRig({ intro, autoOrbit, cameraScale = 1, minAz = -0.2, maxAz = 1.6, introAngle = 0.75, orbitSpeed = 0.5 }) {
  const { camera, size } = useThree()
  const controls = useThree((s) => s.controls)
  const st = useRef({ active: false, t: 0, base: new THREE.Vector3(), dir: 1, bound: false })

  useLayoutEffect(() => {
    const a = size.width / size.height
    if (a < 0.9) camera.position.multiplyScalar(1.5)
    else if (a < 1.3) camera.position.multiplyScalar(1.2)
    camera.position.multiplyScalar(cameraScale)
    st.current.base.copy(camera.position).sub(TARGET)
    if (intro && !prefersReducedMotion()) {
      st.current.active = true
      st.current.t = 0
    }
    // only on first mount, so we never fight the user's orbiting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, dt) => {
    const s = st.current
    if (controls && !s.bound) {
      s.bound = true
      controls.addEventListener('start', () => { s.active = false }) // the user took over
    }
    if (s.active) {
      s.t += Math.min(dt, 0.05)
      const p = Math.min(s.t / 2.4, 1)
      const e = 1 - Math.pow(1 - p, 3)
      const ang = (1 - e) * introAngle
      const scale = 1 + (1 - e) * 0.4
      const rel = s.base.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), ang).multiplyScalar(scale)
      rel.y = s.base.y * (1 + (1 - e) * 0.35)
      camera.position.copy(TARGET).add(rel)
      controls?.update()
      if (p >= 1) s.active = false
    }
    if (controls) {
      const orbit = autoOrbit && !prefersReducedMotion()
      controls.autoRotate = orbit
      if (orbit) {
        const az = controls.getAzimuthalAngle()
        if (az > maxAz - 0.1) s.dir = -1
        else if (az < minAz + 0.1) s.dir = 1
        controls.autoRotateSpeed = s.dir * orbitSpeed
      }
    }
  })
  return null
}
