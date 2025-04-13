import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Tile from './Tile'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { JSX, useState } from 'react'
import { PositionalAudio, SpotLight } from '@react-three/drei'
import voidSound from '../assets/sound/voidSound.mp3'
import { useGameContext } from '../context/useGame'

export type AssetProps = {
  modelUrl: string
  position?: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number]
}

export type VoidTileProps = {
  tilePosition: [number, number],
  material: JSX.Element
  effects?: React.ReactNode[],
  onSelect?: () => void
  onDeselect?: () => void
  onCollide?: () => void
  onUncollide?: () => void
}

export default function VoidTile({
  tilePosition,
  material,
  effects,
  onCollide = () => {},
  onUncollide = () => {},
  onSelect = () => {},
  onDeselect = () => {},
}: VoidTileProps) {

  const [colliding, setColliding] = useState(false); 
  const { isAudioEnabled } = useGameContext()
  
  
  return (
    <group position={[tilePosition[0], 0, tilePosition[1]]}>
    {effects}

    <RigidBody colliders="cuboid" type="fixed" onCollisionEnter={()=>{
        console.log('Collision ENTER detected!')
        setColliding(true)
        if (onCollide){
          console.log('onCollide called')
          onCollide()
        }

    }} onCollisionExit={()=>{
        console.log("Collision EXIT detected");
        setColliding(false)
        if (onUncollide){
          console.log('onUncollide called')
          onUncollide()
        }
      }}>
        {isAudioEnabled && <PositionalAudio
        url={voidSound}
        distance={0.5}
        autoplay={true}
    
        loop
        setMaxDistance={3}
        setRolloffFactor={0.5}
        // {...props} // All THREE.PositionalAudio props are valid
      />}
      <Tile position={tilePosition} size={1.0} material={material} color='black' onPointerUp={()=> {
        console.log('Pointer UP detected!')
        // only allow selection if colliding
        if (colliding && onSelect) {
        onSelect()
        }
        
      }}/>
      <CuboidCollider
        args={[0.5, 1, 0.5]}
        position={[0.0, 1, 0.0]} // center of collider 1 unit tall
      />

    </RigidBody>
    </group>
  )
}

function AssetInstance({
  modelUrl,
  position = [0, 0.1, 0], // slightly above tile
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
}: AssetProps) {
  const gltf = useLoader(GLTFLoader, modelUrl)

  return (
    <primitive
      object={gltf.scene.clone()}
      position={position}
      scale={scale}
      rotation={rotation}
      dispose={null}
    />
  )
}