// Game.tsx
import { Canvas} from '@react-three/fiber'
import { OrbitControls, Sky} from '@react-three/drei'
import WorldMap from './WorldMap'
import WorldTile from './tiles/WorldTile'
import Hud from './Hud'
import Scene from './Scene'
// import WorldMap from './WorldMap'
// import WorldTile from './WorldTile'
// import tileData from './tileData'

import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export function EnableAudio() {
  const { camera } = useThree()

  useEffect(() => {
    const listener = new THREE.AudioListener()
    camera.add(listener)

    const unlockAudio = () => {
      const context = listener.context
      if (context.state === 'suspended') {
        context.resume().then(() => {
          console.log('🎧 Audio context resumed globally')
        })
      }
      document.removeEventListener('click', unlockAudio)
    }

    document.addEventListener('click', unlockAudio)
  }, [camera])

  return null
}


import { Suspense } from 'react'
import { Physics } from '@react-three/rapier'

export default function Game() {

  return (
    <div id="canvas-container" style={{ height: '100vh', width: '100vw' }}>
      <Hud/>
      <Canvas>
      <EnableAudio />
        {/* <OrbitControls/> */}
        <Suspense>
          <Physics gravity={[0, 0.0, 0]}>
              <Scene/>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}