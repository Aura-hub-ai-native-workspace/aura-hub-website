import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { SectionLabel } from './SectionLabel';

/* Manifesto — giant mixed outline/solid type that fills as you scroll.
 * Each word ignites from hollow stroke to solid white across its own
 * scroll slot; key words carry the signal color. The center of the
 * piece: reading IS the animation. Static mixed type when reduced. */

interface Word {
  text: string;
  hot?: boolean;
}

const LINES: Word[][] = [
  [{ text: 'Guesses' }, { text: 'are' }, { text: 'cheap.' }],
  [{ text: 'AURA' }, { text: 'turns' }, { text: 'plain' }, { text: 'language', hot: true }],
  [{ text: 'into' }, { text: 'governed,', hot: true }, { text: 'verified', hot: true }],
  [{ text: 'engineering' }, { text: 'work', hot: true }, { text: '—' }],
  [{ text: 'planned,' }, { text: 'approved,', hot: true }, { text: 'executed,', hot: true }],
  [{ text: 'proven.', hot: true }],
];

const FLAT: Word[] = LINES.flat();
const TOTAL = FLAT.length;

function FillWord({ word, index, progress }: { word: Word; index: number; progress: MotionValue<number> }) {
  const start = index / TOTAL;
  const end = start + 1 / TOTAL;
  const fill = useTransform(progress, [start, end], [0, 1]);
  const color = useTransform(fill, [0, 1], ['rgba(255,255,255,0)', word.hot ? '#f43f7e' : '#ffffff']);
  return (
    <motion.span
      style={{
        color,
        WebkitTextStroke: '1.5px rgba(255,255,255,0.55)',
      }}
      className="mr-[0.28em] inline-block"
    >
      {word.text}
    </motion.span>
  );
}

export function Manifesto() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section aria-label="Manifesto" ref={ref} className="relative h-[320vh] bg-black">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
          <div className="mb-8 flex items-center gap-6">
            <SectionLabel index="00" name="Manifesto" />
            <div className="hidden flex-wrap gap-x-6 gap-y-1 md:flex" aria-hidden>
              {['Prompt', 'Approve', 'Ship', 'Verify'].map((k, i) => (
                <span key={k} className="flex items-center gap-6 font-mono2 text-[11px] uppercase tracking-[0.2em] text-white/40">
                  {i > 0 && <span className="inline-block h-px w-8 bg-white/25" />}
                  {k}
                </span>
              ))}
            </div>
          </div>
          <p className="font-display max-w-[20ch] text-[11vw] font-medium uppercase leading-[0.95] tracking-tight sm:text-[7.5vw] lg:text-[6vw]">
            {reduce
              ? FLAT.map((w, i) => (
                  <span key={i} className={`mr-[0.28em] ${w.hot ? 'text-[var(--signal)]' : 'text-white'}`}>
                    {w.text}
                  </span>
                ))
              : FLAT.map((w, i) => <FillWord key={i} word={w} index={i} progress={scrollYProgress} />)}
          </p>
        </div>
      </div>
    </section>
  );
}
