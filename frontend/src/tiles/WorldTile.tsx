import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Tile from './Tile'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { JSX } from 'react'

export type AssetProps = {
  modelUrl: string
  position?: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number]
}

export type WorldTileProps = {
  tilePosition: [number, number]
  assetUrl?:string,
  material: JSX.Element
  effects?: React.ReactNode[]

  onPlayerEnter?: () => void
  onPlayerExit?: () => void
}

export default function WorldTile({
  material,
  effects,
  tilePosition,
  assetUrl,
  onPlayerEnter,
  onPlayerExit
}: WorldTileProps) {
  return (
    <group position={[tilePosition[0], 0, tilePosition[1]]} >
        {effects}
        <RigidBody colliders="cuboid" type="fixed"
        onIntersectionEnter={()=>{
          console.log('Intersection ENTER detected!')
          if (onPlayerEnter) {
            onPlayerEnter()
          }
      }}
    onIntersectionExit={()=>{
          console.log("Intersection EXIT detected");
          if (onPlayerExit) {
              onPlayerExit();
            }
          }}>
      <Tile position={tilePosition} size={1.0} material={material} color='red' />
      {assetUrl && (
        <AssetInstance
          modelUrl={assetUrl}
        />
      )}
        <CuboidCollider
           args={[0.5, 1, 0.5]}
           position={[0.0, 1, 0.0]} // center of collider 1 unit tall
           sensor={true}
         />
       </RigidBody>
       </group>
  )
}

function AssetInstance({
  modelUrl,
  position = [0, 0.1, 0], // Centered by default
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