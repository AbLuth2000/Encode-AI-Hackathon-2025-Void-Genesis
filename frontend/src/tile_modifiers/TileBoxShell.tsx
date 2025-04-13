import { BoxGeometry, MeshStandardMaterial } from 'three'

type TileBoxShellProps = {
  size?: number
  height?: number
  thickness?: number
  color?: string
  opacity?: number,
  emissive?: string
  emissiveIntensity?: number
}

export default function TileBoxShell({
  size = 1,
  height = 1,
  thickness = 0.05,
  color = 'red',
  opacity = 0.3,
  emissive = 'red',
  emissiveIntensity = 2,
}: TileBoxShellProps) {
  const half = size / 2
  const t = thickness / 2
  const h = height / 2

  const materialProps = {
    color,
    transparent: true,
    opacity,
    emissive,
    emissiveIntensity,
  }
  return (
    <group>
      {/* Left wall */}
      <mesh position={[-half + t, h, 0]}>
        <boxGeometry args={[thickness, height, size]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Right wall */}
      <mesh position={[half - t, h, 0]}>
        <boxGeometry args={[thickness, height, size]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, h, -half + t]}>
        <boxGeometry args={[size, height, thickness]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, h, half - t]}>
        <boxGeometry args={[size, height, thickness]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  )
}