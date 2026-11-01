import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import buildKun from '@assets/miseos_agents/02_kitchen_operations/Build-Kun.png';
import dispatcher from '@assets/miseos_agents/02_kitchen_operations/Dispatcher.png';
import mizu from '@assets/miseos_agents/02_kitchen_operations/Mizu.png';
import prepBot from '@assets/miseos_agents/02_kitchen_operations/PrepBot.png';

import cacheCat from '@assets/miseos_agents/03_service_layer/Cache-Cat.png';
import flashRiku from '@assets/miseos_agents/03_service_layer/Flash-Riku.png';
import patchPanda from '@assets/miseos_agents/03_service_layer/Patch-Panda.png';
import relayFox from '@assets/miseos_agents/03_service_layer/Relay-Fox.png';

const opsMascots = [
  { src: dispatcher, x: '-30vw', y: '5vh', scale: 0.8 },
  { src: mizu, x: '-15vw', y: '-5vh', scale: 0.9 },
  { src: prepBot, x: '0vw', y: '10vh', scale: 1 },
  { src: buildKun, x: '15vw', y: '-10vh', scale: 1.1 },
];

const serviceMascots = [
  { src: relayFox, x: '-15vw', y: '5vh', scale: 0.9 },
  { src: flashRiku, x: '0vw', y: '-5vh', scale: 1 },
  { src: cacheCat, x: '15vw', y: '10vh', scale: 0.8 },
  { src: patchPanda, x: '30vw', y: '-10vh', scale: 1.1 },
];

export function Scene2b_Ops() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 3500),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0, x: '20vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-20vw' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 w-full h-full">
        {/* Ops section */}
        <motion.div 
          className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {opsMascots.map((m, i) => (
            <motion.img 
              key={`ops-${i}`}
              src={m.src}
              className="absolute w-[18vw] object-contain drop-shadow-xl"
              initial={{ y: '50vh', opacity: 0, scale: 0.5 }}
              animate={phase >= 1 ? { y: m.y, x: m.x, opacity: 1, scale: m.scale } : {}}
              transition={{ type: 'spring', damping: 20, delay: i * 0.15 }}
            />
          ))}
          <motion.div 
            className="absolute bottom-[15vh] text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-4xl font-display font-black text-flame-orange tracking-tighter">KITCHEN OPS</h3>
            <p className="text-xl font-mono text-white/70 mt-2">Coordination & Dispatch</p>
          </motion.div>
        </motion.div>

        {/* Service Layer section */}
        <motion.div 
          className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {serviceMascots.map((m, i) => (
            <motion.img 
              key={`srv-${i}`}
              src={m.src}
              className="absolute w-[18vw] object-contain drop-shadow-xl"
              initial={{ y: '50vh', opacity: 0, scale: 0.5 }}
              animate={phase >= 3 ? { y: m.y, x: m.x, opacity: 1, scale: m.scale } : {}}
              transition={{ type: 'spring', damping: 20, delay: i * 0.15 }}
            />
          ))}
          <motion.div 
            className="absolute bottom-[15vh] text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-4xl font-display font-black text-broth-cream tracking-tighter">SERVICE LAYER</h3>
            <p className="text-xl font-mono text-white/70 mt-2">Delivery & Cache</p>
          </motion.div>
        </motion.div>

        {/* Vertical divider */}
        <motion.div 
          className="absolute left-1/2 top-[20vh] bottom-[20vh] w-[2px] bg-white/10"
          initial={{ scaleY: 0 }}
          animate={phase >= 2 ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}