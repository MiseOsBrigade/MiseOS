import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import deptsImg from '@assets/450291C9-FD96-4D89-8F93-BA0CE2EAE8BF_1782043151361.png';

const INGREDIENTS = [
  { label: 'INGREDIENT 01', name: 'STREAMING\nPACKETS',  color: 'var(--color-pipeline)',    delay: 0 },
  { label: 'INGREDIENT 02', name: 'SLICED\nSILICON',     color: 'var(--color-reliability)', delay: 1 },
  { label: 'CORE SYNTHESIS', name: 'DATA\nREDUCTION',    color: 'var(--color-data)',        delay: 2 },
];

const DEPT_STATS = [
  { key: 'PIPELINE',    value: '15', color: 'var(--color-pipeline)' },
  { key: 'PLATFORM',   value: '15', color: 'var(--color-platform)' },
  { key: 'RELIABILITY',value: '15', color: 'var(--color-reliability)' },
  { key: 'SECURITY',   value: '15', color: 'var(--color-security)' },
  { key: 'DATA',       value: '15', color: 'var(--color-data)' },
];

export function Scene3_Flow() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 4200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#0a0c10] overflow-hidden"
      initial={{ opacity: 0, x: '8vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 1.4, filter: 'blur(18px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background: departments overview image */}
      <motion.img
        src={deptsImg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ opacity: 0.18, objectPosition: 'center center', mixBlendMode: 'luminosity' }}
        initial={{ scale: 1.15, x: '-4vw' }}
        animate={{ scale: 1.25, x: '4vw' }}
        transition={{ duration: 6.5, ease: 'linear' }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#0a0c1088] to-[#0a0c10aa]" />

      {/* Flowing data stream lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px"
            style={{
              top: `${12 + i * 11}%`,
              background: `linear-gradient(90deg, transparent, ${
                ['var(--color-pipeline)', 'var(--color-platform)', 'var(--color-reliability)', 'var(--color-security)', 'var(--color-data)'][i % 5]
              }88, transparent)`,
              width: '40%',
            }}
            initial={{ x: '-50%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2.5 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Left ingredient text stack */}
      <div className="absolute left-[8vw] top-[20vh] z-10 flex flex-col gap-[7vh]">
        {INGREDIENTS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -50 }}
            animate={phase >= i + 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="text-[0.75vw] font-mono uppercase tracking-[0.4em] mb-1"
              style={{ color: item.color }}
            >
              {item.label}
            </div>
            <div className="text-[2.8vw] font-display font-black text-white uppercase leading-none drop-shadow-xl whitespace-pre-line">
              {item.name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right: animated dept ring */}
      <motion.div
        className="absolute right-[10vw] w-[28vw] h-[28vw] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-[1.5px] border-white/10"
          style={{ boxShadow: '0 0 60px 10px #8B5CF622' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Conic sweep */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, transparent, var(--color-data)44, transparent)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner dark fill */}
        <div className="absolute inset-2 bg-[#0a0c10]/85 rounded-full flex flex-col items-center justify-center gap-3">
          <motion.div
            className="text-[3.5vw] font-display font-black text-white uppercase leading-none text-center"
            animate={{
              filter: ['brightness(1)', 'brightness(1.6)', 'brightness(1)'],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            5 × 15
          </motion.div>
          <div className="text-[0.8vw] font-mono text-white/40 uppercase tracking-widest text-center">
            DEPARTMENTS
          </div>

          {/* Dept color dots */}
          <div className="flex gap-2 mt-1">
            {DEPT_STATS.map(d => (
              <motion.div
                key={d.key}
                className="w-2 h-2 rounded-full"
                style={{ background: d.color }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: DEPT_STATS.indexOf(d) * 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom stat row */}
      {phase >= 3 && (
        <motion.div
          className="absolute bottom-[8vh] left-0 w-full px-[8vw] flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {DEPT_STATS.map((d, i) => (
            <motion.div
              key={d.key}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="text-[1.6vw] font-display font-black"
                style={{ color: d.color }}
              >
                {d.value}
              </div>
              <div className="text-[0.65vw] font-mono text-white/40 uppercase tracking-widest">
                {d.key}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
