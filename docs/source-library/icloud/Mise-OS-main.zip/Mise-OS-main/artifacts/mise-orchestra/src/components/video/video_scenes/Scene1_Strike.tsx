import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const kurogami = `${import.meta.env.BASE_URL}images/kurogami-nobg.png`;

export function Scene1_Strike() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#0a0c10] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(16px)' }}
      transition={{ duration: 0.7 }}
    >
      {/* Radial burst behind character */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={phase >= 2
          ? { opacity: 1, scale: 1.4 }
          : { opacity: 0, scale: 0.6 }
        }
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 62% 55%, #D4AF3755 0%, #3B82F611 55%, transparent 80%)',
        }}
      />

      {/* Kinetic grid lines */}
      <motion.div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Kurogami Senpai — positioned right-center */}
      <motion.div
        className="absolute right-[8vw] bottom-0 h-[92%] flex items-end justify-center"
        initial={{ opacity: 0, x: 60, scale: 1.08 }}
        animate={phase >= 1 ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 60, scale: 1.08 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={kurogami}
          alt="Kurogami Senpai — Agent Director"
          className="h-full w-auto object-contain drop-shadow-[0_0_60px_#D4AF3766]"
          animate={phase >= 2 ? { filter: 'drop-shadow(0 0 80px #D4AF37aa) brightness(1.15)' } : {}}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Baton energy strike flash */}
      <motion.div
        className="absolute inset-0 bg-[#D4AF37]"
        initial={{ opacity: 0 }}
        animate={
          phase === 2
            ? { opacity: 0.18 }
            : phase >= 3
            ? { opacity: 0 }
            : { opacity: 0 }
        }
        transition={{ duration: phase >= 3 ? 0.5 : 0.08 }}
      />

      {/* Left text block */}
      <div className="absolute left-[8vw] top-[50%] -translate-y-1/2 flex flex-col gap-6">
        <motion.div
          className="text-[0.85vw] font-mono text-[#D4AF37] uppercase tracking-[0.4em]"
          initial={{ opacity: 0, y: -12 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.6 }}
        >
          AGENT DIRECTOR
        </motion.div>

        <motion.h1
          className="text-[7vw] font-display font-black text-white uppercase leading-none"
          initial={{ opacity: 0, x: -40 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          KURO-<br />GAMI
        </motion.h1>

        <motion.div
          className="text-[1vw] font-mono text-white/40 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          COOK · ORCHESTRATE · DEPLOY
        </motion.div>

        {/* Gold accent rule */}
        <motion.div
          className="h-px bg-[#D4AF37]"
          initial={{ width: 0 }}
          animate={phase >= 2 ? { width: '18vw' } : { width: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Strike kinetic word */}
      {phase >= 3 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ scale: 3, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-[22vw] font-display font-black text-white uppercase leading-none">
            MISE
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
