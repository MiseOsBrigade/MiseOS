import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import kurogami from '@assets/miseos_agents/01_executive_chefs/Kurogami.png';
import mizu from '@assets/miseos_agents/02_kitchen_operations/Mizu.png';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 900),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => setPhase(4), 6200),
    ];
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        className="absolute w-[120vw] h-[120vw] bg-ink-blue/30 rounded-full blur-[120px]"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 7, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute left-[6vw] top-[8vh] rounded-full border border-gold-ladle/40 bg-black/45 px-5 py-3 font-mono text-sm uppercase tracking-[0.25em] text-gold-ladle shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, x: -40 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
      >
        From the studio that read your README
      </motion.div>

      <motion.img
        src={kurogami}
        className="absolute w-[25vw] left-[4vw] top-[13vh] opacity-25 blur-[1px]"
        initial={{ y: 150, x: -80, rotate: -20 }}
        animate={{ y: -35, x: 0, rotate: -5 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />

      <motion.img
        src={mizu}
        className="absolute w-[20vw] right-[8vw] bottom-[10vh] opacity-25 blur-[1px]"
        initial={{ y: -150, x: 80, rotate: 25 }}
        animate={{ y: 25, x: 0, rotate: 10 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />

      <div className="relative z-10 text-center px-[9vw]">
        <motion.div
          className="text-gold-ladle tracking-[0.22em] uppercase text-lg mb-8 font-mono"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.35 }}
        >
          Trailer mode initialized
        </motion.div>

        <h1 className="text-[5.8vw] font-display font-bold leading-tight tracking-tight text-broth-cream">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 50 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', damping: 25, stiffness: 90 }}
          >
            In a world where repos
          </motion.span>

          <motion.span
            className="block text-flame-orange italic pr-4 mt-2"
            initial={{ opacity: 0, y: 50 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', damping: 25, stiffness: 90 }}
          >
            forget what folder does what...
          </motion.span>

          <motion.span
            className="block text-matcha-green mt-2"
            initial={{ opacity: 0, y: 50 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', damping: 25, stiffness: 90 }}
          >
            one brigade labels the leftovers.
          </motion.span>
        </h1>

        <motion.p
          className="mx-auto mt-8 max-w-4xl text-2xl font-mono text-white/65"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        >
          MiseOS turns tool sprawl into a repo anyone can tour, run, and actually explain.
        </motion.p>
      </div>
    </motion.div>
  );
}
