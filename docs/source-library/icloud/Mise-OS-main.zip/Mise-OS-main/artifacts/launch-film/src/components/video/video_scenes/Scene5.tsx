import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import orchestraCore from '@assets/miseos_agents/01_executive_chefs/Orchestra-Core.png';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => setPhase(4), 6500),
    ];
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-umami-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(46, 139, 78, 0.2) 0%, transparent 65%)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3 }}
      />

      <motion.div
        className="absolute left-[6vw] top-[8vh] rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-mono text-white/55 backdrop-blur-sm"
        initial={{ opacity: 0, x: -40 }}
        animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
      >
        Runtime status: dramatic.<br />
        Folder clarity: improved.<br />
        Tiny chef morale: dangerously high.
      </motion.div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.img
          src={orchestraCore}
          className="w-[18vw] mb-10"
          initial={{ y: 80, opacity: 0, filter: 'blur(30px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div className="overflow-hidden" initial={{ opacity: 1 }}>
          <motion.h1
            className="text-[9vw] font-display font-black text-broth-cream tracking-tight leading-none"
            initial={{ y: '100%' }}
            animate={phase >= 1 ? { y: '0%' } : {}}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
          >
            MiseOS
          </motion.h1>
        </motion.div>

        <motion.div className="mt-8 overflow-hidden text-center">
          <motion.p
            className="text-3xl font-mono text-gold-ladle uppercase tracking-[0.4em]"
            initial={{ y: -60, opacity: 0 }}
            animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            The brigade is ready
          </motion.p>

          <motion.div
            className="mt-6 w-full h-[1px] bg-gradient-to-r from-transparent via-matcha-green to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase >= 3 ? { scaleX: 1, opacity: 0.5 } : {}}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          <motion.p
            className="mx-auto mt-8 max-w-4xl text-2xl leading-relaxed text-broth-cream/75"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
          >
            Cook. Orchestrate. Deploy. Then send the roamer to make sure nobody hid snacks in `node_modules`.
          </motion.p>
        </motion.div>
      </div>

      {/* Cinematic particle effect */}
      <motion.div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-ladle"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100 - 30}vh`],
              opacity: [0, Math.random() * 0.8 + 0.2, 0],
              scale: [0, Math.random() * 2 + 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
