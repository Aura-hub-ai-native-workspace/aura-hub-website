import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SectionLabel } from './SectionLabel';

/* Metrics deck — tabbed readouts, every figure measured. */

interface Panel {
  id: string;
  label: string;
  stats: { value: string; caption: string }[];
  note: string;
}

const PANELS: Panel[] = [
  {
    id: 'validation',
    label: 'Validation',
    stats: [
      { value: '226', caption: 'frontend tests green' },
      { value: '440', caption: 'agent behavior tests green' },
      { value: '105', caption: 'registry + provider tests green' },
      { value: '0', caption: 'fabricated metrics shipped' },
    ],
    note: 'Counts from validation runs against this product. If a number cannot be measured, it is not shown.',
  },
  {
    id: 'adoption',
    label: 'Adoption',
    stats: [
      { value: '97', caption: 'downloads, counted live' },
      { value: '3', caption: 'desktop platforms' },
      { value: '6', caption: 'release artifacts per version' },
      { value: '100%', caption: 'of builds run on their target OS' },
    ],
    note: 'Download figures stream from the public GitHub Release API and hide when unreachable.',
  },
  {
    id: 'execution',
    label: 'Execution',
    stats: [
      { value: '4s', caption: 'objective to parked plan' },
      { value: '1', caption: 'human approval per run' },
      { value: '~3m', caption: 'measured worker execution' },
      { value: '0', caption: 'files changed without approval' },
    ],
    note: 'Timings from verified sessions. Approval is the price of admission — and the whole point.',
  },
];

export function Metrics() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const panel = PANELS[active];

  const pick = (i: number) => {
    if (i === active) return;
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };

  return (
    <section aria-label="Measured metrics" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
        <SectionLabel index="04" name="Numbers with receipts" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display max-w-[14ch] text-5xl font-medium tracking-tight text-white sm:text-7xl">
            Proof, tabulated.
          </h2>
          <div role="tablist" aria-label="Metric groups" className="flex gap-2 border border-white/12 p-1.5">
            {PANELS.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => pick(i)}
                className={`px-5 py-2.5 font-mono2 text-[11.5px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  i === active ? 'bg-white text-black' : 'text-white/50 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 overflow-hidden border border-white/12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={panel.id}
              initial={reduce ? false : { opacity: 0, x: 28 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -28 * direction }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {panel.stats.map((s, i) => (
                  <div key={s.caption} className={`p-8 sm:p-10 ${i % 2 === 1 ? 'border-l border-white/12' : ''} ${i >= 2 ? 'border-t border-white/12' : ''} lg:border-l lg:border-t-0 lg:first:border-l-0 ${i >= 2 ? 'lg:border-t-0' : ''}`}>
                    <div className="font-display text-5xl font-medium tracking-tight text-white sm:text-6xl">{s.value}</div>
                    <p className="mt-3 font-mono2 text-[11px] uppercase leading-snug tracking-[0.14em] text-white/50">{s.caption}</p>
                  </div>
                ))}
              </div>
              <p className="border-t border-white/12 px-8 py-5 font-mono2 text-[11px] uppercase leading-[2] tracking-[0.12em] text-white/40 sm:px-10">
                {panel.note}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
