import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Tile from './Tile'
import { RigidBody } from '@react-three/rapier'
import { JSX } from 'react'

export type AssetProps = {
  modelUrl: string
  position?: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number],

}

export type PlayerTileProps = {
  tilePosition: [number, number]
  assetUrl?:string
  material: JSX.Element,
  effects?: React.ReactNode[],
  
  onPlayerEnter?: () => void,
  onPlayerExit?: () => void
}

export default function PlayerTile({
  material,
  effects,
  assetUrl,
  tilePosition,
  onPlayerEnter,
  onPlayerExit
}: PlayerTileProps) {
  return (
    <group position={[tilePosition[0], 0, tilePosition[1]]}>
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
      <Tile position={tilePosition} size={1.0} material={material}  color='green' />
      {assetUrl && (
        <AssetInstance
          modelUrl={assetUrl}
        />
      )}
    </RigidBody>
     </group>
  )
}

function AssetInstance({
  modelUrl,
  position = [0, 0.5, 0], // Centered by default
  scale = [0.8, 0.8, 0.8],
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