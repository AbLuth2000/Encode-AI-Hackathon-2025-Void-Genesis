/* eslint-disable @typescript-eslint/no-namespace */
import { shaderMaterial } from '@react-three/drei'
import { extend, ReactThreeFiber } from '@react-three/fiber'
type Props = JSX.IntrinsicElements['shaderMaterial']

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export type TileMaterialProps = JSX.IntrinsicElements['tileBlendShaderMaterial'] & {
    isSelected?: boolean
    isCollided?: boolean
    isForeign?: boolean
  }

export function TileBlendMaterial({
  isSelected = false,
  isCollided = false,
  isForeign = false,
  ...props
}: TileMaterialProps) {
  const ref = useRef<any>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uTime = clock.getElapsedTime()
      ref.current.uIsSelected = isSelected ? 1.0 : 0.0
      ref.current.uIsCollided = isCollided ? 1.0 : 0.0
      ref.current.uIsForeign = isForeign ? 1.0 : 0.0
    }
  })

  return (
    <tileBlendShaderMaterial
      ref={ref}
      {...props}
    />
  )
}

const TileBlendShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uNeighborColors: [
      new THREE.Color(),
      new THREE.Color(),
      new THREE.Color(),
      new THREE.Color()
    ],
    uIsSelected: 0,
    uIsCollided: 0,
    uIsForeign: 0
  },
  // Vertex Shader
  /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  /* glsl */ `
  uniform float uTime;
  uniform sampler2D uTexture;
  uniform vec3 uNeighborColors[4]; // top, right, bottom, left
  uniform float uIsSelected;
  uniform float uIsCollided;
  uniform float uIsForeign;
  varying vec2 vUv;

  void main() {
    vec4 baseColor = texture2D(uTexture, vUv);

    // Edge blending
    float edgeThreshold = 0.2;
    float fadeTop = smoothstep(0.0, edgeThreshold, vUv.y);
    float fadeBottom = smoothstep(1.0, 1.0 - edgeThreshold, vUv.y);
    float fadeLeft = smoothstep(0.0, edgeThreshold, vUv.x);
    float fadeRight = smoothstep(1.0, 1.0 - edgeThreshold, vUv.x);

    vec3 blended = baseColor.rgb;
    blended = mix(blended, uNeighborColors[0], 1.0 - fadeTop);
    blended = mix(blended, uNeighborColors[1], 1.0 - fadeRight);
    blended = mix(blended, uNeighborColors[2], 1.0 - fadeBottom);
    blended = mix(blended, uNeighborColors[3], 1.0 - fadeLeft);

    // Lighten if collided
    if (uIsCollided > 0.5) {
      blended += 0.2;
    }

    // Shadow tinting (ONLY affect shadows, not rim or bands)
    float luminance = (blended.r + blended.g + blended.b) / 3.0;
    float shadow = 1.0 - luminance;

    // If foreign: red shadow tint only
    if (uIsForeign > 0.5) {
      blended.r += shadow * 0.3;
      blended.g -= shadow * 0.1;
      blended.b -= shadow * 0.1;
    }

    // If selected: blue shadow tint only
    if (uIsSelected > 0.5) {
      blended.b += shadow * 0.3;
      blended.r -= shadow * 0.1;
      blended.g -= shadow * 0.1;
    }

    gl_FragColor = vec4(blended, baseColor.a);
  }
  `
)

extend({ TileBlendShaderMaterial })

export { TileBlendShaderMaterial}

declare global {
    namespace JSX {
      interface IntrinsicElements {
        tileBlendShaderMaterial: Object3DNode<typeof TileBlendShaderMaterial, typeof TileBlendShaderMaterial>
      }
    }
  }