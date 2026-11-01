import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Bounds,
  Environment,
  Html,
  OrbitControls,
  PerformanceMonitor,
} from '@react-three/drei';
import type { RepositoryAsset } from '../types';
import { ModelAsset } from './ModelAsset';
import { ProceduralAsset } from './ProceduralAsset';

interface AssetViewerProps {
  asset: RepositoryAsset;
  mode?: 'card' | 'detail';
  onPerformanceChange?: (dpr: number) => void;
}

function Loader() {
  return (
    <Html center>
      <div className="viewer-loader">Loading asset…</div>
    </Html>
  );
}

export function AssetViewer({
  asset,
  mode = 'card',
  onPerformanceChange,
}: AssetViewerProps) {
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    if (asset.modelUrl) {
      // The model is retained only while this viewer is active. The cache manager
      // can explicitly clear it after inactivity or memory pressure.
      return undefined;
    }
  }, [asset.modelUrl]);

  return (
    <div className={`asset-viewer asset-viewer--${mode}`}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: mode === 'detail',
          powerPreference: 'high-performance',
          alpha: true,
        }}
        camera={{
          position: mode === 'detail' ? [0, 0.4, 5.8] : [0, 0.2, 4.4],
          fov: 44,
        }}
      >
        <PerformanceMonitor
          onIncline={() => onPerformanceChange?.(1.5)}
          onDecline={() => onPerformanceChange?.(1)}
        />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.4}
          castShadow={mode === 'detail'}
        />
        <pointLight position={[-4, 1, -2]} intensity={1.2} color="#1e9bb8" />

        <Suspense fallback={<Loader />}>
          <Bounds fit clip observe margin={1.25}>
            {asset.modelUrl ? (
              <ModelAsset url={asset.modelUrl} />
            ) : (
              <ProceduralAsset
                asset={asset}
                reducedMotion={prefersReducedMotion}
              />
            )}
          </Bounds>
          {mode === 'detail' && <Environment preset="city" />}
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={2.3}
          maxDistance={9}
          autoRotate={!prefersReducedMotion && mode === 'card'}
          autoRotateSpeed={0.72}
        />
      </Canvas>
    </div>
  );
}
