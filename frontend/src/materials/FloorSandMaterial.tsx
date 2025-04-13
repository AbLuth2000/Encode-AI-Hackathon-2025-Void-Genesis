import { useLoader } from '@react-three/fiber'
import { Color, TextureLoader } from 'three'
import grassTextureURL from '../assets/textures/sand.png'
import { JSX } from 'react'
import { TileBlendMaterial, TileMaterialProps } from './TileBlendMaterial'

export function FloorSandMaterial(props: TileMaterialProps) {
  const texture = useLoader(TextureLoader, grassTextureURL)
//   const texture = useLoader<Texture, string>(TextureLoader, grassTextureURL)
  // Optional: wrap texture repeat if needed
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping
//   texture.repeat.set(2, 2)

 return <TileBlendMaterial
   uTexture={texture}
   uNeighborColors={[
     new Color('#ccc'),
     new Color('#bbb'),
     new Color('#aaa'),
     new Color('#999')
   ]}
   uIsSelected={props.isSelected ? 1 : 0}
   uIsCollided={props.isColliding ? 1 : 0}
   uIsForeign={props.isForeign ? 1 : 0}
 />
}