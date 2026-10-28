import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ToonOutlineProps {
  geometry: THREE.BufferGeometry;
  thickness?: number;
  color?: string;
  renderOrder?: number;
}

// Caché global de materiales para no compilar shaders repetidos ni duplicar objetos WebGL
const materialCache = new Map<string, THREE.ShaderMaterial>();

function getOrCreateOutlineMaterial(thickness: number, color: string): THREE.ShaderMaterial {
  const key = `${thickness.toFixed(4)}_${color}`;
  let mat = materialCache.get(key);
  if (!mat) {
    mat = new THREE.ShaderMaterial({
      uniforms: {
        thickness: { value: thickness },
        outlineColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        uniform float thickness;
        void main() {
          vec3 transformed = position + normal * thickness;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 outlineColor;
        void main() {
          gl_FragColor = vec4(outlineColor, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: true,
    });
    materialCache.set(key, mat);
  }
  return mat;
}

export const ToonOutline: React.FC<ToonOutlineProps> = ({
  geometry,
  thickness = 0.025,
  color = '#2a1714',
  renderOrder = 0,
}) => {
  const material = useMemo(() => {
    return getOrCreateOutlineMaterial(thickness, color);
  }, [thickness, color]);

  return <mesh geometry={geometry} material={material} renderOrder={renderOrder} />;
};

interface ToonMeshProps {
  geometry: THREE.BufferGeometry;
  children?: React.ReactNode;
  outlineThickness?: number;
  outlineColor?: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  name?: string;
}

export const ToonMesh: React.FC<ToonMeshProps> = ({
  geometry,
  children,
  outlineThickness = 0.022,
  outlineColor = '#2a1714',
  castShadow = true,
  receiveShadow = false,
  position,
  rotation,
  scale,
  name,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale} name={name}>
      <mesh geometry={geometry} castShadow={castShadow} receiveShadow={receiveShadow}>
        {children}
      </mesh>
      {outlineThickness > 0 && (
        <ToonOutline geometry={geometry} thickness={outlineThickness} color={outlineColor} />
      )}
    </group>
  );
};
