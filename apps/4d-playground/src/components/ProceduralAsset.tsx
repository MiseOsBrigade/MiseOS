import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { RepositoryAsset } from '../types';

interface ProceduralAssetProps {
  asset: RepositoryAsset;
  reducedMotion?: boolean;
}

export function ProceduralAsset({ asset, reducedMotion = false }: ProceduralAssetProps) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!reducedMotion && ref.current) {
      ref.current.rotation.y += delta * 0.22;
      ref.current.rotation.x += delta * 0.05;
    }
  });

  const geometry = {
    icosahedron: <icosahedronGeometry args={[1.25, 2]} />,
    torus: <torusKnotGeometry args={[0.88, 0.24, 120, 16]} />,
    box: <boxGeometry args={[1.6, 1.6, 1.6]} />,
    sphere: <sphereGeometry args={[1.18, 48, 48]} />,
  }[asset.geometry];

  return (
    <mesh ref={ref} castShadow receiveShadow>
      {geometry}
      <meshPhysicalMaterial
        color={
          asset.dimension === 'evidence'
            ? '#2de8a0'
            : asset.dimension === 'work'
              ? '#f2c94c'
              : asset.dimension === 'memory'
                ? '#1e9bb8'
                : '#e97b22'
        }
        metalness={0.35}
        roughness={0.24}
        clearcoat={0.7}
        clearcoatRoughness={0.22}
      />
    </mesh>
  );
}
