import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const beats = [
  {
    title: 'Cook',
    subtitle: 'Prep the repo before the commit rush begins.',
    command: 'pnpm install',
    color: '#E97B22',
  },
  {
    title: 'Typecheck',
    subtitle: 'Let TypeScript catch problems before reviewers do.',
    command: 'pnpm run typecheck',
    color: '#D4AF37',
  },
  {
    title: 'Build',
    subtitle: 'Plate every artifact before the merge window opens.',
    command: 'pnpm run build',
    color: '#2E8B4E',
  },
  {
    title: 'Roam',
    subtitle: 'Let the tiny repo chef inspect the pantry like it owns a clipboard.',
    command: 'pnpm run roam:repo',
    color: '#F6F1E7',
  },
];

export function Scene4() {
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    const timers = beats.map((_, i) => setTimeout(() => setPhase(i), i * 1450 + 600));
    timers.push(setTimeout(() => setPhase(99), 7600));
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-umami-black px-[5vw]"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-x-0 top-[8vh] text-center font-mono text-xl uppercase tracking-[0.4em] text-white/45"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 0 ? { opacity: 1, y: 0 } : {}}
      >
        Convenient commands · cinematic repo tour
      </motion.div>

      <div className="grid w-full grid-cols-4 gap-[1.3vw]">
        {beats.map((beat, i) => {
          const active = phase >= i;
          return (
            <motion.div
              key={beat.title}
              className="relative min-h-[58vh] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-sm"
              initial={{ opacity: 0, y: 90, rotate: -4 }}
              animate={
                active
                  ? {
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      scale: phase === i ? 1.04 : 1,
                    }
                  : {}
              }
              transition={{ type: 'spring', damping: 18, stiffness: 95 }}
            >
              <motion.div
                className="absolute -right-14 -top-14 h-48 w-48 rounded-full blur-3xl"
                style={{ backgroundColor: beat.color }}
                animate={{ opacity: active ? [0.12, 0.28, 0.12] : 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="font-mono text-sm uppercase tracking-[0.25em] text-white/45">
                    Station {String(i + 1).padStart(2, '0')}
                  </div>
                  <h2
                    className="mt-5 text-[4.8vw] font-display font-black uppercase leading-none tracking-tighter"
                    style={{ color: beat.color }}
                  >
                    {beat.title}
                  </h2>
                  <p className="mt-5 text-2xl leading-snug text-broth-cream/80">{beat.subtitle}</p>
                </div>

                <motion.div
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4 font-mono text-lg text-matcha-green"
                  initial={{ opacity: 0, y: 20 }}
                  animate={active ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 }}
                >
                  $ {beat.command}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="absolute bottom-[6vh] rounded-full border border-gold-ladle/40 bg-gold-ladle px-8 py-3 font-display text-2xl font-black text-umami-black shadow-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={phase >= 99 ? { y: 0, opacity: 1 } : {}}
        transition={{ type: 'spring', damping: 16 }}
      >
        No more “where does this live?” energy.
      </motion.div>
    </motion.div>
  );
}
