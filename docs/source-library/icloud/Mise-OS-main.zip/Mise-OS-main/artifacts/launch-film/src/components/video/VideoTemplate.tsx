import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene2b_Ops } from './video_scenes/Scene2b_Ops';
import { Scene2c_Eng } from './video_scenes/Scene2c_Eng';
import { Scene3 } from './video_scenes/Scene3';
import { SceneAllAgents } from './video_scenes/SceneAllAgents';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS = {
  intro: 8000,
  brigade: 8000,
  showcase_ops: 8000,
  showcase_eng: 8000,
  groups: 10000,
  all_agents: 12000,
  rhythm: 10000,
  outro: 8000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  brigade: Scene2,
  showcase_ops: Scene2b_Ops,
  showcase_eng: Scene2c_Eng,
  groups: Scene3,
  all_agents: SceneAllAgents,
  rhythm: Scene4,
  outro: Scene5,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />

        {/* Animated gradients */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-bg-muted), transparent 70%)' }}
          animate={{
            x: ['-20%', '20%', '-10%'],
            y: ['-20%', '10%', '30%'],
            scale: [1, 1.2, 0.9]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full blur-[80px] opacity-10"
          style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
          animate={{
            x: ['40%', '-10%', '60%'],
            y: ['60%', '20%', '-10%'],
            scale: [0.8, 1.3, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}
