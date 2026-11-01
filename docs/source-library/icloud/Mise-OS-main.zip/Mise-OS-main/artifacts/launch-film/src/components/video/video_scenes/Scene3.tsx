import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import orchestraCore from '@assets/miseos_agents/01_executive_chefs/Orchestra-Core.png';
import buildKun from '@assets/miseos_agents/02_kitchen_operations/Build-Kun.png';
import patchPanda from '@assets/miseos_agents/03_service_layer/Patch-Panda.png';
import coder from '@assets/miseos_agents/04_engineering/Coder.png';
import firewall from '@assets/miseos_agents/05_security/Firewall.png';
import cloudChef from '@assets/miseos_agents/06_platform_infra/Cloud-Chef.png';
import githubChef from '@assets/miseos_agents/07_ecosystem/GitHub-Chef.png';

const groups = [
  { name: "Executive Chefs", role: "Leadership", color: "text-gold-ladle", image: orchestraCore },
  { name: "Kitchen Ops", role: "Coordination", color: "text-flame-orange", image: buildKun },
  { name: "Service Layer", role: "Delivery", color: "text-broth-cream", image: patchPanda },
  { name: "Engineering", role: "Creation", color: "text-matcha-green", image: coder },
  { name: "Security", role: "Protection", color: "text-ink-blue", image: firewall },
  { name: "Platform", role: "Infrastructure", color: "text-white", image: cloudChef },
  { name: "Ecosystem", role: "Integrations", color: "text-gold-ladle", image: githubChef },
];

export function Scene3() {
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    // Stagger through each group with slightly longer delays for the 10s scene
    const timers = groups.map((_, i) => 
      setTimeout(() => setPhase(i), i * 800 + 800)
    );
    
    // Final reveal connecting them all
    timers.push(setTimeout(() => setPhase(99), groups.length * 800 + 1500));
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-wrap justify-center items-center gap-[3vw] px-[5vw] w-full h-[75vh]">
        {groups.map((group, i) => {
          const isActive = phase >= i;
          
          return (
            <motion.div
              key={i}
              className="relative flex flex-col items-center justify-end h-full w-[11vw]"
              initial={{ opacity: 0, y: 150 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 150 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              <motion.img
                src={group.image}
                className="w-[14vw] object-contain drop-shadow-2xl absolute bottom-[12vh]"
                initial={{ scale: 0, rotate: -30 }}
                animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
                transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.15 }}
              />
              
              <motion.div 
                className="text-center absolute bottom-0 w-[16vw] bg-umami-black/50 p-4 rounded-xl backdrop-blur-sm border border-white/5"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className={`text-sm font-mono font-bold uppercase tracking-widest mb-2 ${group.color}`}>
                  {group.role}
                </div>
                <div className="text-lg font-display font-bold text-white whitespace-nowrap">
                  {group.name}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Connecting grid line */}
      <motion.div 
        className="absolute bottom-[22vh] left-0 right-0 h-[2px] bg-white/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: phase >= 99 ? 1 : 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
}