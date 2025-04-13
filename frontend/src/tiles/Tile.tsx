// Tile.tsx
import { useTexture } from "@react-three/drei";
import { JSX, useRef } from "react";

export type TileProps = {
  position?: [number, number];
  size?: number;
  material?: JSX.Element;
  color?: string;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
};
// & MeshProps
const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);
export default function Tile({
  position = [0, 0],
  size = 1,
  material,
  color,
  onPointerDown,
  onPointerUp,
  ...props
}: TileProps) {
  const finalColor = color ? color : randomColor();
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        {...props}
        onPointerDown={() => {
          if (onPointerDown) {
            onPointerDown();
          }
          console.log("Pointer DOWN detected!");
        }}
        onPointerUp={() => {
          if (onPointerUp) {
            onPointerUp();
          }
          console.log("Pointer UP detected!");
        }}
      >
        <planeGeometry args={[size, size]} />
        {material ?? <meshStandardMaterial color={finalColor} />}
      </mesh>
    </group>
  );
}
