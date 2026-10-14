// A see-through preview of the item you are about to place or are carrying.
// It turns red when the spot is not allowed. It ignores pointer events so it
// never blocks the mouse from reaching the floor or walls underneath.
import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { ALL_MODELS as MODELS } from '../furniture/index.js'
import { disposeGroup } from '../utils/three-helpers.js'
import { wallPose } from '../utils/placement.js'

export default function Ghost({ def, ghost }) {
  const model = useMemo(() => {
    const g = MODELS[def.id]()
    g.traverse((o) => {
      o.raycast = () => {}
      o.castShadow = false
      if (o.material) {
        o.material = o.material.clone()
        o.material.transparent = true
        o.material.opacity = 0.62
        o.material.depthWrite = false
        o.userData.ownMaterial = true
      }
    })
    return g
  }, [def.id])
  useEffect(() => () => disposeGroup(model), [model])

  useEffect(() => {
    model.traverse((o) => {
      if (o.material?.emissive) {
        o.material.emissive.set(ghost.valid ? '#000000' : '#C0392B')
        o.material.emissiveIntensity = ghost.valid ? 0 : 0.7
      }
    })
  }, [model, ghost.valid])

  let position
  let rotY = ghost.rot || 0
  if (def.kind === 'wall') {
    const p = wallPose(ghost.wall, ghost.u, def.wallY, def.wallDepth)
    position = p.position
    rotY = p.rotY
  } else {
    position = [ghost.x, ghost.y || 0, ghost.z]
  }
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <primitive object={model} />
    </group>
  )
}
