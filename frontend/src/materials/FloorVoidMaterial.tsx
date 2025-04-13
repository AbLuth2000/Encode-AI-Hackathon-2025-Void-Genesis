import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

// 1. Shader material definition
const VoidShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color(0.0, 0.0, 0.0),
    uColor2: new THREE.Color(0.15, 0.0, 0.25),
    uIsSelected: 0,
    uIsColliding: 0
  },
  // Vertex shader
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uIsSelected;
    uniform float uIsColliding;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv - 0.5;
      float angle = atan(uv.y, uv.x);
      float radius = length(uv);

      float swirlSpeed = 6.0;
      float swirlDensity = 40.0;
      float swirl = sin(angle * swirlDensity - uTime * swirlSpeed + radius * 20.0);

      float band = step(0.0, swirl);
      float glow = smoothstep(0.8, 0.2, radius);
      float blackHole = smoothstep(0.1, 0.0, radius);

      vec3 rimColor = uColor2 * (1.0 - blackHole) * glow * band;
      vec3 baseColor = mix(rimColor, uColor1, blackHole);

      float brightness = 1.0 + (uIsColliding * 0.2) + (uIsSelected * 0.5);
      baseColor *= brightness;

      gl_FragColor = vec4(baseColor, 1.0);
    }
  `
)

// 2. Register with R3F
extend({ VoidShaderMaterial })

// 3. Component wrapper
type Props = JSX.IntrinsicElements['voidShaderMaterial'] & {
  isSelected?: boolean
  isColliding?: boolean
}

export function FloorVoidMaterial({
  isSelected = false,
  isColliding = false,
  ...props
}: Props) {
  const ref = useRef<any>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uTime = clock.getElapsedTime()
      ref.current.uIsSelected = isSelected ? 1.0 : 0.0
      ref.current.uIsColliding = isColliding ? 1.0 : 0.0
    }
  })

  return (
    <voidShaderMaterial
      ref={ref}
      {...props}
    />
  )
}