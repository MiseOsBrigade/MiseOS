import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { ALL_AGENTS, BRIGADES } from '@/lib/agent-roster';

const FEATURE_BEATS = [
  '75 agents reporting for kitchen duty.',
  '7 brigades, zero lonely folders.',
  'Every station has a specialist.',
  'The repo tour now has a cast.',
  'Chaos applied for PTO. Denied.',
  'Everything in its place before deploy.',
  'Open the repo. Meet the whole crew.',
];

export function SceneAllAgents() {
  const [activeBrigade, setActiveBrigade] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveBrigade((current) => (current + 1) % BRIGADES.length);
    }, 1350);

    return () => window.clearInterval(id);
  }, []);

  const active = BRIGADES[activeBrigade];
  const featuredAgents = useMemo(
    () => active.agents.slice(0, 4).map((agent) => agent.name).join(' · '),
    [active],
  );

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-umami-black px-[3vw] py-[5vh]"
      initial={{ opacity: 0, filter: 'blur(18px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-x-0 top-[4vh] text-center text-[9vw] font-display font-black uppercase leading-none text-white/[0.035] tracking-tighter pointer-events-none"
        animate={{ x: ['-2vw', '2vw', '-2vw'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        All Characters
      </motion.div>

      <div className="relative z-10 flex items-start justify-between gap-6">
        <div>
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 font-mono text-sm uppercase tracking-[0.25em] text-white/70"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: active.accent }} />
            Full cast roll call
          </motion.div>

          <motion.h2
            className="mt-5 max-w-[55vw] text-[4.8vw] font-display font-black leading-[0.9] tracking-tight text-broth-cream"
            key={active.key}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {FEATURE_BEATS[activeBrigade]}
          </motion.h2>

          <motion.p
            className="mt-5 max-w-[50vw] text-2xl font-mono leading-relaxed text-white/65"
            key={`${active.key}-copy`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Now featuring <span style={{ color: active.accent }}>{active.name}</span>: {featuredAgents}
          </motion.p>
        </div>

        <motion.div
          className="min-w-[24vw] rounded-3xl border border-white/10 bg-black/35 p-5 text-right shadow-2xl backdrop-blur-sm"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="font-mono text-sm uppercase tracking-[0.25em] text-white/50">Repo convenience</div>
          <div className="mt-3 space-y-2 text-xl font-display font-bold text-broth-cream">
            <div>Dashboard → see the system</div>
            <div>Launch film → explain the vibe</div>
            <div>Roamer → tour the folders</div>
            <div>Docs → onboard faster</div>
          </div>
        </motion.div>
      </div>

      <div
        className="relative z-10 mt-[4vh] grid gap-[0.55vw]"
        style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
      >
        {ALL_AGENTS.map((agent, index) => {
          const isActive = agent.brigade === active.name;
          return (
            <motion.div
              key={`${agent.brigade}-${agent.name}`}
              className="relative flex h-[12vh] min-h-[94px] flex-col items-center justify-end overflow-hidden rounded-2xl border bg-white/[0.045] p-1.5 shadow-lg backdrop-blur-sm"
              style={{
                borderColor: isActive ? agent.accent : 'rgba(255,255,255,0.08)',
              }}
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              animate={{
                opacity: isActive ? 1 : 0.48,
                y: 0,
                rotate: isActive ? 0 : Math.sin(index) * 1.2,
                scale: isActive ? 1.05 : 1,
              }}
              transition={{
                delay: Math.min(index * 0.012, 0.8),
                type: 'spring',
                damping: 18,
                stiffness: 120,
              }}
            >
              <motion.img
                src={agent.image}
                alt={`${agent.name} — ${agent.role}`}
                className="absolute top-1 h-[7.4vh] object-contain drop-shadow-xl"
                animate={{
                  y: isActive ? [0, -4, 0] : 0,
                }}
                transition={{
                  duration: 1.6,
                  repeat: isActive ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: (index % 5) * 0.08,
                }}
              />
              <div className="relative z-10 w-full rounded-xl bg-black/45 px-1.5 py-1 text-center backdrop-blur-sm">
                <div className="truncate text-[0.58vw] font-display font-black leading-tight text-white">
                  {agent.name}
                </div>
                <div className="truncate text-[0.42vw] font-mono leading-tight text-white/55">
                  {agent.role}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="absolute bottom-[3vh] left-1/2 z-20 -translate-x-1/2 rounded-full bg-gold-ladle px-7 py-3 font-mono text-lg font-black uppercase tracking-[0.22em] text-umami-black shadow-2xl"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        The MiseOS Brigade is open for service.
      </motion.div>
    </motion.div>
  );
}
