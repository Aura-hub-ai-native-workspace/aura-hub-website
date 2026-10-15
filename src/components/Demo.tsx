import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '../motion/scroll';
import { SectionLabel } from './SectionLabel';

const FRAMES = [
  { shot: '/screenshots/01-app-shell-home.png', alt: 'Home', caption: 'Open a project — indexed and ready in seconds.' },
  { shot: '/screenshots/03-ai-chat.png', alt: 'AI Chat', caption: 'Ask in plain language — answers carry real citations.' },
  { shot: '/screenshots/07-automation-studio.png', alt: 'Workflow Automation', caption: 'Automations compile to runnable graphs.' },
  { shot: '/screenshots/04-mission-control.png', alt: 'Mission Control', caption: 'Multi-step work runs under your approval.' },
  { shot: '/screenshots/09-architecture-blueprint.png', alt: 'Architecture', caption: 'The system map stays honest as code changes.' },
];

const DWELL_MS = 4200;

export function Demo() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    setIndex(((i % FRAMES.length) + FRAMES.length) % FRAMES.length);
  }, []);

  useEffect(() => {
    if (reduce) return;
    timer.current = window.setTimeout(() => go(index + 1), DWELL_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, reduce, go]);

  const frame = FRAMES[index];

  return (
    <section id="demo" aria-label="Demo" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
        <SectionLabel index="06" name="Demo" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display max-w-[12ch] text-5xl font-medium uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
            See it work.
          </h2>
          <div className="flex gap-2.5">
            <button onClick={() => go(index - 1)} aria-label="Previous frame" className="grid h-12 w-12 place-items-center border border-white/20 text-white transition-colors hover:border-white/60">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(index + 1)} aria-label="Next frame" className="grid h-12 w-12 place-items-center border border-white/20 text-white transition-colors hover:border-white/60">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <div className="border border-white/12">
            <div className="relative aspect-[16/8] w-full overflow-hidden bg-black">
              <AnimatePresence mode={reduce ? 'sync' : 'popLayout'}>
                <motion.img
                  key={frame.shot}
                  src={frame.shot}
                  alt={frame.alt}
                  initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/12 px-5 py-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="flex min-w-0 flex-1 items-center gap-3 font-mono2 text-[12px] uppercase tracking-[0.14em] text-white/70"
                >
                  <span className="shrink-0 text-white/40">{String(index + 1).padStart(2, '0')}</span>
                  <span className="truncate">{frame.caption}</span>
                </motion.p>
              </AnimatePresence>
              <div className="flex shrink-0 items-center gap-2" role="tablist" aria-label="Demo frames">
                {FRAMES.map((f, i) => (
                  <button
                    key={f.shot}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Frame ${i + 1}: ${f.alt}`}
                    onClick={() => go(i)}
                    className={`h-1 transition-all duration-400 ${i === index ? 'w-7 bg-white' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
