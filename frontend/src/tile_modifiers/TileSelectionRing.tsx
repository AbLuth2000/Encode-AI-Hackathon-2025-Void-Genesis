import { DoubleSide } from "three";

export function TileSelectionRing({ visible = false }) {
    return (
    //   <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0,1,0]} visible={visible}>
    //     <ringGeometry args={[0.45, 0.5, 32]} />
    //     <meshBasicMaterial color="cyan" transparent opacity={0.8} />
    //   </mesh>
    <mesh position={[0, 1.0, 0]}>
  <cylinderGeometry args={[0.4, 0.4, 1, 48, 1, true]} />
  <meshBasicMaterial color="cyan" transparent opacity={0.3} side={DoubleSide} />
</mesh>
    )
  }