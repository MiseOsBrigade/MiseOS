import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import orchestraCore from '@assets/miseos_agents/01_executive_chefs/Orchestra-Core.png';
import kurogami from '@assets/miseos_agents/01_executive_chefs/Kurogami.png';
import kuroGuard from '@assets/miseos_agents/01_executive_chefs/Kuro-Guard.png';
import seira from '@assets/miseos_agents/01_executive_chefs/Seira.png';
import conductor from '@assets/miseos_agents/01_executive_chefs/Conductor.png';
import stewardPrime from '@assets/miseos_agents/01_executive_chefs/Steward-Prime.png';
import rootChef from '@assets/miseos_agents/01_executive_chefs/Root-Chef.png';
import policyMonk from '@assets/miseos_agents/01_executive_chefs/Policy-Monk.png';
import auditSensei from '@assets/miseos_agents/01_executive_chefs/Audit-Sensei.png';
import humanLiaison from '@assets/miseos_agents/01_executive_chefs/Human-Liaison.png';

const mascots = [
  { src: humanLiaison, x: '-45%', y: '20%', scale: 0.7, delay: 0.1 },
  { src: rootChef, x: '45%', y: '25%', scale: 0.7, delay: 0.15 },
  { src: policyMonk, x: '-38%', y: '-10%', scale: 0.75, delay: 0.2 },
  { src: auditSensei, x: '38%', y: '-15%', scale: 0.75, delay: 0.25 },
  { src: kurogami, x: '-28%', y: '10%', scale: 0.85, delay: 0.3 },
  { src: seira, x: '28%', y: '15%', scale: 0.8, delay: 0.4 },
  { src: kuroGuard, x: '-15%', y: '-5%', scale: 0.9, delay: 0.5 },
  { src: stewardPrime, x: '15%', y: '0%', scale: 0.9, delay: 0.6 },
  { src: conductor, x: '0%', y: '-18%', scale: 0.95, delay: 0.7 },
  { src: orchestraCore, x: '0%', y: '18%', scale: 1.3, delay: 1.0 }, 
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 5500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, var(--color-bg-muted) 0%, transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5 }}
      />

      <div className="relative w-full h-[65vh] flex items-center justify-center mt-[5vh]">
        {mascots.map((mascot, i) => (
          <motion.img
            key={i}
            src={mascot.src}
            className="absolute h-[55vh] object-contain drop-shadow-2xl"
            initial={{ 
              opacity: 0, 
              x: 0, 
              y: '60%',
              scale: 0.5
            }}
            animate={{ 
              opacity: 1, 
              x: mascot.x, 
              y: mascot.y,
              scale: mascot.scale
            }}
            transition={{ 
              duration: 1.8, 
              delay: mascot.delay,
              type: "spring",
              stiffness: 70,
              damping: 15
            }}
            style={{ zIndex: i === mascots.length - 1 ? 30 : 10 + i }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
        <motion.div 
          className="text-center w-full"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
        >
          <motion.div 
            className="text-[14vw] font-display font-black text-white/10 mix-blend-overlay tracking-tighter uppercase leading-none absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            75 AGENTS
          </motion.div>
          
          <div className="mt-[65vh] flex flex-col items-center gap-6">
            <motion.div 
              className="bg-gold-ladle text-umami-black font-mono font-bold px-8 py-3 rounded-full text-2xl tracking-widest"
              initial={{ opacity: 0, y: 30 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", damping: 18 }}
            >
              7 GROUPS
            </motion.div>
            
            <motion.h2 
              className="text-6xl font-display font-bold text-broth-cream tracking-tight"
              initial={{ opacity: 0, filter: 'blur(15px)', y: 20 }}
              animate={phase >= 3 ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
              transition={{ duration: 1.2 }}
            >
              One Orchestra.
            </motion.h2>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}