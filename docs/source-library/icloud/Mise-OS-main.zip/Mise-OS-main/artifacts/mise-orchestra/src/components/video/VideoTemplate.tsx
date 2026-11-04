import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1_Strike } from './video_scenes/Scene1_Strike';
import { Scene2_Portals } from './video_scenes/Scene2_Portals';
import { Scene3_Flow } from './video_scenes/Scene3_Flow';
import { Scene4_Pan } from './video_scenes/Scene4_Pan';
import { Scene5_Outro } from './video_scenes/Scene5_Outro';

export const SCENE_DURATIONS: Record<string, number> = {
  strike: 3500,
  portals: 5000,
  flow: 6500,
  pan: 10000,
  outro: 5000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  strike: Scene1_Strike,
  portals: Scene2_Portals,
  flow: Scene3_Flow,
  pan: Scene4_Pan,
  outro: Scene5_Outro,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0c10]">
      {/* Persistent Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, var(--color-pipeline), transparent)' }}
          animate={{
            x: ['-20%', '10%', '-10%', '-30%', '0%'][sceneIndex % 5],
            y: ['-20%', '-40%', '10%', '30%', '0%'][sceneIndex % 5],
            scale: [1, 1.2, 0.8, 1.1, 1][sceneIndex % 5],
            opacity: [0.1, 0.15, 0.1, 0.2, 0.05][sceneIndex % 5],
          }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, var(--color-data), transparent)' }}
          animate={{
            x: ['20%', '-10%', '30%', '10%', '0%'][sceneIndex % 5],
            y: ['20%', '40%', '-10%', '-30%', '0%'][sceneIndex % 5],
            scale: [1, 0.9, 1.3, 0.9, 1][sceneIndex % 5],
          }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />

        {/* Film grain noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
