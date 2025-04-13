import { useGLTF } from '@react-three/drei'
import { NormalizedAsset } from '../NormalizedAsset'


type SelectionBobProps = {
  visible: boolean
  position?: [number, number, number]
  modelUrl?: string
  scale?: number
} & React.ComponentProps<'group'>

export function TileSelectionBob({
  visible,
  position = [0, 1.0, 0], // Default Y = 3
  modelUrl = '/assets/glb_models/star.glb',
  scale = 1.0,
  ...props
}: SelectionBobProps) {

  if (!visible) return null

  return (
    <group position={position} scale={scale} {...props}>
              {/* Debug red box */}
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {/* <NormalizedAsset url="/assets/glb_models/star.glb" size={10} /> */}
    </group>
  )
}