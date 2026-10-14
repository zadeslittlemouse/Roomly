// Catalog thumbnails are rendered from the SAME 3D models used in the room, using a
// small temporary renderer. If WebGL is unavailable the catalog falls back to a tile.
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { ALL_MODELS as MODELS } from '../furniture/index.js'
import { CATALOG } from '../data/catalog.js'
import { disposeGroup } from '../utils/three-helpers.js'

let cache = null // id -> data URL
let promise = null

function renderAll() {
  if (promise) return promise
  promise = new Promise((resolve) => {
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    } catch {
      resolve({})
      return
    }
    const SIZE = 192
    renderer.setSize(SIZE, SIZE)
    renderer.setPixelRatio(1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.setClearColor(0x000000, 0)
    const scene = new THREE.Scene()
    scene.add(new THREE.HemisphereLight('#FFF8EA', '#D8C9B2', 1.5))
    const sun = new THREE.DirectionalLight('#ffffff', 2.6)
    sun.position.set(3, 5, 4)
    scene.add(sun)
    const camera = new THREE.PerspectiveCamera(28, 1, 0.05, 50)
    const out = {}
    const ids = CATALOG.map((c) => c.id)

    const step = () => {
      const id = ids.shift()
      if (!id) {
        renderer.dispose()
        renderer.forceContextLoss?.()
        cache = out
        resolve(out)
        return
      }
      try {
        const model = MODELS[id]()
        scene.add(model)
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const radius = box.getSize(new THREE.Vector3()).length() / 2
        const isArt = id.startsWith('art-')
        const dir = (isArt ? new THREE.Vector3(0.18, 0.08, 1) : new THREE.Vector3(1, 0.8, 1.15)).normalize()
        const dist = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * 0.98
        camera.position.copy(center).addScaledVector(dir, dist)
        camera.lookAt(center)
        renderer.render(scene, camera)
        out[id] = renderer.domElement.toDataURL('image/png')
        scene.remove(model)
        disposeGroup(model)
      } catch {
        /* skip this thumbnail, the tile fallback is used */
      }
      setTimeout(step, 0) // yield to the browser between renders
    }
    step()
  })
  return promise
}

export function useThumbnails() {
  const [thumbs, setThumbs] = useState(cache || {})
  useEffect(() => {
    if (cache) return
    let alive = true
    // wait a moment so the first screen paints before we spend time on thumbnails
    const t = setTimeout(() => renderAll().then((r) => alive && setThumbs(r)), 400)
    return () => { alive = false; clearTimeout(t) }
  }, [])
  return thumbs
}
