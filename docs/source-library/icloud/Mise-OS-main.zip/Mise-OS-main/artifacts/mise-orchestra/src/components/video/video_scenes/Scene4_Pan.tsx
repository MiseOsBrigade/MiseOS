import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import rolesGrid from '@assets/IMG_4549_1782043151361.png';
import pipelineDept from '@assets/IMG_4563_1782043151361.png';
const genesis15 = `${import.meta.env.BASE_URL}images/genesis15-nobg.png`;

const HUD_CORNERS = [
  'top-0 left-0 border-t-2 border-l-2',
  'top-0 right-0 border-t-2 border-r-2',
  'bottom-0 left-0 border-b-2 border-l-2',
  'bottom-0 right-0 border-b-2 border-r-2',
];
const HUD_COLORS = [
  'var(--color-pipeline)',
  'var(--color-platform)',
  'var(--color-security)',
  'var(--color-data)',
];

const STATS = [
  { label: 'PIPELINE',    status: 'SYNCED',   color: 'var(--color-pipeline)' },
  { label: 'PLATFORM',   status: 'STABLE',   color: 'var(--color-platform)' },
  { label: 'RELIABILITY',status: 'OPTIMAL',  color: 'var(--color-reliability)' },
  { label: 'SECURITY',   status: 'LOCKED',   color: 'var(--color-security)' },
  { label: 'DATA',       status: 'FLOWING',  color: 'var(--color-data)' },
];

export function Scene4_Pan() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => setPhase(4), 7000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#0a0c10] overflow-hidden"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '-8vh' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background layer 1: roles grid — slow upward pan */}
      <motion.img
        src={rolesGrid}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full object-cover pointer-events-none select-none"
        style={{ height: '160%', top: '0%', opacity: 0.35, mixBlendMode: 'luminosity' }}
        initial={{ y: '0%' }}
        animate={{ y: '-25%' }}
        transition={{ duration: 10, ease: 'linear' }}
      />

      {/* Background layer 2: pipeline dept — top right */}
      <motion.img
        src={pipelineDept}
        alt=""
        aria-hidden
        className="absolute top-0 right-0 w-[45%] object-cover pointer-events-none select-none"
        style={{ opacity: 0.18, mixBlendMode: 'lighten' }}
        initial={{ x: '10%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />

      {/* Background layer 3: genesis 15 — bottom left */}
      <motion.img
        src={genesis15}
        alt=""
        aria-hidden
        className="absolute bottom-0 left-0 w-[40%] object-cover pointer-events-none select-none"
        style={{ opacity: 0.2, mixBlendMode: 'lighten' }}
        initial={{ x: '-10%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 8, ease: 'easeOut', delay: 0.5 }}
      />

      {/* Dark gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-[#0a0c1088]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10aa] via-transparent to-[#0a0c10aa]" />

      {/* HUD corners */}
      <div className="absolute inset-[4vw] pointer-events-none">
        {HUD_CORNERS.map((cls, i) => (
          <motion.div
            key={i}
            className={`absolute w-[4vw] h-[4vw] ${cls}`}
            style={{ borderColor: HUD_COLORS[i] }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          />
        ))}

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
      </div>

      {/* Target reticle */}
      <motion.div
        className="absolute w-[18vw] h-[18vw] rounded-full border border-white/15 flex items-center justify-center"
        initial={{ scale: 2.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
      >
        <motion.div
          className="w-[0.8vw] h-[0.8vw] bg-white/40 rounded-full"
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      </motion.div>

      {/* Top title block */}
      <div className="absolute top-[8vh] w-full text-center flex flex-col items-center gap-3">
        <motion.div
          className="text-[3.2vw] font-display font-black text-white uppercase tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6 }}
        >
          75 SPECIALIZED AVATARS
        </motion.div>
        <motion.div
          className="text-[1.2vw] font-mono uppercase tracking-[0.5em]"
          style={{ color: 'var(--color-platform)' }}
          initial={{ opacity: 0, letterSpacing: '0em' }}
          animate={phase >= 2 ? { opacity: 1, letterSpacing: '0.5em' } : { opacity: 0, letterSpacing: '0em' }}
          transition={{ duration: 0.9 }}
        >
          WORKING IN PERFECT HARMONY
        </motion.div>

        {/* 5×15=75 equation */}
        <motion.div
          className="flex items-center gap-4 mt-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          {['5 STYLES', '×', '15 ROLES', '=', '75 SPIRITS'].map((t, i) => (
            <motion.span
              key={t}
              className={
                t === '×' || t === '='
                  ? 'text-[1.2vw] font-mono text-white/30'
                  : 'text-[1vw] font-mono uppercase tracking-widest text-white/60 border border-white/10 px-3 py-1 rounded'
              }
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom status bar */}
      {phase >= 3 && (
        <motion.div
          className="absolute bottom-[8vh] left-0 w-full px-[8vw] flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col gap-1 border-t border-white/15 pt-3 w-[15%]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div
                className="text-[0.75vw] font-mono uppercase tracking-widest"
                style={{ color: stat.color }}
              >
                {stat.label}
              </div>
              <div className="text-[0.7vw] font-mono text-white/50 uppercase tracking-widest">
                {stat.status}
              </div>
              {/* Active dot */}
              <motion.div
                className="w-1.5 h-1.5 rounded-full mt-1"
                style={{ background: stat.color }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
