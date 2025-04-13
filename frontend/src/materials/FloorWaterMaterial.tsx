// FloorWaterMaterial.tsx
import { useFrame } from '@react-three/fiber'
import { JSX, useRef } from 'react'

type Props = JSX.IntrinsicElements['shaderMaterial']

export function FloorWaterMaterial({ ...props }: Props) {
  const ref = useRef<any>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uTime = clock.getElapsedTime()
    }
  })

  return (
    <waterShaderMaterial
      ref={ref}

      {...props}
    />
  )
}

// WaterShaderMaterial.ts
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

const WaterShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uBaseColor: new THREE.Color(0.2, 0.4, 0.7),
    uRippleColor: new THREE.Color(0.1, 0.4, 0.9),  
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
  uniform vec3 uBaseColor;
  uniform vec3 uRippleColor;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv * 24.0; // smaller ripple scale
  
    // Oscillating animation: yoyo with sin(uTime)
    float t = sin(uTime * 1.5);
  
    // Multi-layered ripple effect
    float ripple =
        0.4 * sin(uv.x * 2.0 + t * 2.0) +
        0.3 * cos((uv.x + uv.y) * 3.0 + t * 1.5) +
        0.3 * sin(uv.y * 4.0 - t * 1.2);
  
    // Normalize to [0,1]
    float rippleMask = ripple * 0.5 + 0.5;
  
    // Blend ripple on top of base color
    vec3 color = mix(uBaseColor, uRippleColor, rippleMask);
  
    gl_FragColor = vec4(color, 1.0);
  }
  `
)

extend({ WaterShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    waterShaderMaterial: JSX.IntrinsicElements['shaderMaterial']
  }
}

export { WaterShaderMaterial }