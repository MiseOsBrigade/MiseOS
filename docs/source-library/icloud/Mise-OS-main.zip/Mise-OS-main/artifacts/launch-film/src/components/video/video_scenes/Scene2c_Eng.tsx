import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import architect from '@assets/miseos_agents/04_engineering/Architect.png';
import coder from '@assets/miseos_agents/04_engineering/Coder.png';
import debuggerAgent from '@assets/miseos_agents/04_engineering/Debugger.png';

import firewall from '@assets/miseos_agents/05_security/Firewall.png';
import penTester from '@assets/miseos_agents/05_security/Pen-Tester.png';
import scanner from '@assets/miseos_agents/05_security/Scanner.png';

import cloudChef from '@assets/miseos_agents/06_platform_infra/Cloud-Chef.png';
import automator from '@assets/miseos_agents/06_platform_infra/Automator.png';
import networker from '@assets/miseos_agents/06_platform_infra/Networker.png';

const sections = [
  {
    title: "ENGINEERING",
    color: "text-matcha-green",
    desc: "Creation & Logic",
    x: '-30vw',
    mascots: [
      { src: architect, x: '-6vw', y: '-5vh', scale: 0.9 },
      { src: coder, x: '6vw', y: '5vh', scale: 1.1 },
      { src: debuggerAgent, x: '0vw', y: '-12vh', scale: 0.8 },
    ]
  },
  {
    title: "SECURITY",
    color: "text-ink-blue",
    desc: "Protection & Audits",
    x: '0vw',
    mascots: [
      { src: firewall, x: '0vw', y: '5vh', scale: 1.1 },
      { src: penTester, x: '-6vw', y: '-10vh', scale: 0.9 },
      { src: scanner, x: '6vw', y: '-5vh', scale: 0.8 },
    ]
  },
  {
    title: "PLATFORM",
    color: "text-white",
    desc: "Infra & Scale",
    x: '30vw',
    mascots: [
      { src: automator, x: '-6vw', y: '5vh', scale: 0.9 },
      { src: cloudChef, x: '0vw', y: '-10vh', scale: 1.2 },
      { src: networker, x: '6vw', y: '-5vh', scale: 0.8 },
    ]
  }
];

export function Scene2c_Eng() {
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    const timers = sections.map((_, i) => 
      setTimeout(() => setPhase(i), i * 1500 + 500)
    );
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, x: '20vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {sections.map((sec, i) => (
          <motion.div
            key={`sec-${i}`}
            className="absolute h-full flex flex-col items-center justify-center"
            style={{ x: sec.x }}
            initial={{ opacity: 0 }}
            animate={phase >= i ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-[25vw] h-[50vh] flex items-center justify-center mb-8">
              {sec.mascots.map((m, mi) => (
                <motion.img
                  key={`m-${i}-${mi}`}
                  src={m.src}
                  className="absolute w-[16vw] object-contain drop-shadow-xl"
                  initial={{ y: '20vh', opacity: 0, scale: 0.5 }}
                  animate={phase >= i ? { y: m.y, x: m.x, opacity: 1, scale: m.scale } : {}}
                  transition={{ type: 'spring', damping: 15, delay: mi * 0.2 + 0.2 }}
                />
              ))}
            </div>
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={phase >= i ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <h3 className={`text-4xl font-display font-black tracking-tighter ${sec.color}`}>{sec.title}</h3>
              <p className="text-xl font-mono text-white/70 mt-2">{sec.desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}