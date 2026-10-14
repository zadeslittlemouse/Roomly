import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// Materials are cached by their settings so hundreds of meshes can share a few.
const cache = new Map()
export function mat(color, { rough = 0.8, metal = 0, opacity = 1 } = {}) {
  const key = `${color}|${rough}|${metal}|${opacity}`
  if (!cache.has(key)) {
    cache.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        roughness: rough,
        metalness: metal,
        transparent: opacity < 1,
        opacity,
      }),
    )
  }
  return cache.get(key)
}

function finish(mesh, x, y, z) {
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

// x, y, z is the CENTER of the shape.
export const box = (w, h, d, m, x = 0, y = 0, z = 0) =>
  finish(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m), x, y, z)

export const rbox = (w, h, d, r, m, x = 0, y = 0, z = 0) =>
  finish(
    new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)),
      m,
    ),
    x,
    y,
    z,
  )

export const cyl = (rTop, rBottom, h, m, x = 0, y = 0, z = 0, seg = 24) =>
  finish(new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, seg), m), x, y, z)

export const sphere = (r, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => {
  const mesh = finish(new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m), x, y, z)
  mesh.scale.set(sx, sy, sz)
  return mesh
}

export function group(...children) {
  const g = new THREE.Group()
  children.forEach((c) => c && g.add(c))
  return g
}

// Free the GPU memory used by a furniture model's own geometry (shared materials are kept).
export function disposeGroup(g) {
  g.traverse((o) => {
    if (o.geometry) o.geometry.dispose()
    if (o.userData?.ownMaterial && o.material) {
      if (o.material.map) o.material.map.dispose()
      o.material.dispose()
    }
  })
}
