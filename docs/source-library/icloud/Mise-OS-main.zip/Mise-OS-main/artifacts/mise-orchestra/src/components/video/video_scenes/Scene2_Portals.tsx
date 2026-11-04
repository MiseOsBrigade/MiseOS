import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import mythologyImg from '@assets/Mise_Orchestra_DevOps_Mythology_1782043151361.png';

const PORTALS = [
  { name: 'PIPELINE',    sub: 'Delivery',     color: 'var(--color-pipeline)',    col: 'col-start-1' },
  { name: 'PLATFORM',    sub: 'Foundations',  color: 'var(--color-platform)',    col: 'col-start-2' },
  { name: 'RELIABILITY', sub: 'Uptime',       color: 'var(--color-reliability)', col: 'col-start-3' },
  { name: 'SECURITY',    sub: 'Protection',   color: 'var(--color-security)',    col: 'col-start-4' },
  { name: 'DATA',        sub: 'Insight',      color: 'var(--color-data)',        col: 'col-start-5' },
];

export function Scene2_Portals() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c10] overflow-hidden"
      initial={{ opacity: 0, scale: 1.15, filter: 'blur(18px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: '-8vw' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background: mythology infographic faded */}
      <motion.img
        src={mythologyImg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.07] mix-blend-lighten pointer-events-none select-none"
        style={{ objectPosition: 'center top' }}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: 'easeOut' }}
      />

      {/* Top label */}
      <motion.div
        className="relative z-10 text-[0.85vw] font-mono text-white/40 uppercase tracking-[0.5em] mb-[4vh]"
        initial={{ opacity: 0, y: -16 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.6 }}
      >
        5 DEVOPS DEPARTMENTS
      </motion.div>

      {/* Portal grid */}
      <div className="relative z-10 flex items-end gap-[2.5vw] px-[6vw]">
        {PORTALS.map((portal, i) => (
          <motion.div
            key={portal.name}
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 50, scale: 0.7 }}
            animate={
              phase >= 1
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 50, scale: 0.7 }
            }
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 22,
              delay: phase >= 1 ? i * 0.12 : 0,
            }}
          >
            {/* Portal circle */}
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: '13vw',
                height: '13vw',
                border: `1.5px solid ${portal.color}66`,
                boxShadow: `0 0 40px 6px ${portal.color}22, inset 0 0 30px ${portal.color}11`,
              }}
            >
              {/* Animated inner glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: `radial-gradient(circle, ${portal.color}33 0%, transparent 70%)` }}
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.85, 1.05, 0.85] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Spinning dashed ring */}
              <motion.svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ duration: 14 + i * 2, repeat: Infinity, ease: 'linear' }}
              >
                <circle
                  cx="50" cy="50" r="47"
                  fill="none"
                  stroke={portal.color}
                  strokeWidth="0.6"
                  strokeDasharray="8 4 2 4"
                  opacity="0.5"
                />
              </motion.svg>

              {/* Counter-spin ring */}
              <motion.svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                animate={{ rotate: -360 }}
                transition={{ duration: 20 + i * 3, repeat: Infinity, ease: 'linear' }}
              >
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke={portal.color}
                  strokeWidth="0.3"
                  strokeDasharray="3 8"
                  opacity="0.3"
                />
              </motion.svg>

              <div
                className="relative z-10 text-center px-2 font-display font-black uppercase leading-tight"
                style={{ color: portal.color, fontSize: '1.1vw' }}
              >
                {portal.name}
              </div>
            </div>

            {/* Sub-label */}
            <motion.div
              className="text-[0.8vw] font-mono text-white/50 uppercase tracking-[0.3em] text-center"
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {portal.sub}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Bottom caption */}
      {phase >= 3 && (
        <motion.div
          className="relative z-10 mt-[4vh] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[2vw] font-display font-black text-white uppercase tracking-tight">
            RAPID-FIRE ASSEMBLY
          </div>
          <div className="text-[0.9vw] font-mono text-white/40 tracking-[0.4em] mt-2 uppercase">
            TECH-GOURMET VARIANTS
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
