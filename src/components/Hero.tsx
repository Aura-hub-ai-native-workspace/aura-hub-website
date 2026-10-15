import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Fluid, GridLines } from '../stage/Fluid';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <header id="top" ref={ref} className="relative overflow-clip">
      <Fluid />
      <GridLines />

      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col justify-end px-5 pb-16 sm:px-10 sm:pb-20"
      >
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
          className="font-display text-[13.5vw] font-extralight uppercase leading-[0.92] tracking-[-0.01em] text-white sm:text-[9.5vw] lg:text-[8.2vw]"
        >
          <span className="text-hollow block">Talk to AURA.</span>
          <span className="block font-semibold normal-case tracking-tight">Ship verified work.</span>
        </motion.h1>

        <div className="mt-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="font-mono2 max-w-xl text-[12.5px] uppercase leading-[1.9] tracking-[0.14em] text-white/60"
          >
            Agentic engineering. Prompt, approve, ship — real workers, verified results, governed execution.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#download"
              className="group flex items-center gap-2 bg-white px-7 py-4 font-mono2 text-[12px] font-medium uppercase tracking-[0.14em] text-black transition-colors hover:bg-white/85"
            >
              Try it now
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#demo"
              className="flex items-center gap-2 border border-white/25 px-7 py-4 font-mono2 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:border-white/60"
            >
              Watch demo
            </a>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}
