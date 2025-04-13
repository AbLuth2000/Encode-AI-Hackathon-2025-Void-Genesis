import { useGLTF } from '@react-three/drei'
import { JSX, useEffect, useRef } from 'react'
import { Box3, Group, Vector3 } from 'three'

type NormalizedAssetProps = {
  url: string
  size?: number // desired normalized size (e.g. tile width)
} & JSX.IntrinsicElements['group']

export function NormalizedAsset({ url, size = 1, ...props }: NormalizedAssetProps) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<Group>(null)

  useEffect(() => {
    if (groupRef.current) {
      const box = new Box3().setFromObject(groupRef.current)
      const center = new Vector3()
      const sizeVec = new Vector3()
      box.getCenter(center)
      box.getSize(sizeVec)

      // Center it
      groupRef.current.position.sub(center)

      // Normalize scale
      const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z)
      const scale = size / maxDim
      groupRef.current.scale.setScalar(scale)
    }
  }, [scene])

  return (
    <group {...props}>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </group>
  )
}