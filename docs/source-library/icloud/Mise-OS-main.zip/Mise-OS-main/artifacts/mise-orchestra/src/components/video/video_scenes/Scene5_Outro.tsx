import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const logoArt = `${import.meta.env.BASE_URL}images/logo-art-nobg.png`;

export function Scene5_Outro() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c10] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Slow-zoom grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4.8, ease: 'easeOut' }}
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      {/* Radial gold glow */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, #D4AF3718 0%, transparent 70%)',
        }}
      />

      {/* Logo artwork — faded background */}
      <motion.img
        src={logoArt}
        alt=""
        aria-hidden
        className="absolute w-[60vw] pointer-events-none select-none"
        style={{ opacity: 0, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        animate={phase >= 1 ? { opacity: 0.12 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Main title */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ scale: 1.15, opacity: 0, y: 40 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1, y: 0 } : { scale: 1.15, opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 110, damping: 22 }}
      >
        {/* Gold rule */}
        <motion.div
          className="h-px bg-[#D4AF37] mb-8"
          initial={{ width: 0 }}
          animate={phase >= 1 ? { width: '30vw' } : { width: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        <h1 className="text-[5.5vw] font-display font-black text-white tracking-tight uppercase leading-none drop-shadow-2xl">
          MISEOS
        </h1>
        <h2
          className="text-[5.5vw] font-display font-black uppercase tracking-tight leading-none drop-shadow-2xl mt-[-0.5vw]"
          style={{ color: 'var(--color-pipeline)' }}
        >
          75 VARIANTS.
        </h2>

        <motion.div
          className="h-px bg-[#D4AF37] mt-8"
          initial={{ width: 0 }}
          animate={phase >= 1 ? { width: '30vw' } : { width: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </motion.div>

      {/* Tagline */}
      <motion.div
        className="relative z-10 mt-[7vh] text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="text-[1.4vw] font-mono text-white/55 tracking-widest uppercase">
          The Genesis 15 are live.
        </p>
        <p
          className="text-[1.4vw] font-mono tracking-widest uppercase mt-2"
          style={{ color: 'var(--color-platform)' }}
        >
          60 expansions follow.
        </p>
      </motion.div>

      {/* Bottom signature */}
      {phase >= 3 && (
        <motion.div
          className="absolute bottom-[6vh] w-full flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {['COOK', '·', 'ORCHESTRATE', '·', 'DEPLOY'].map((word, i) => (
            <motion.span
              key={word + i}
              className={
                word === '·'
                  ? 'text-[1vw] font-mono text-white/20'
                  : 'text-[1vw] font-mono text-white/40 uppercase tracking-[0.3em]'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.12 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
