import { motion, useReducedMotion } from 'motion/react';
import { Reveal } from '../motion/scroll';
import { SectionLabel } from './SectionLabel';

/* Proof bars — the anatomy of one measured run. Every width is a
 * real timing from a verified session. No competitor comparison:
 * those numbers would be invented. */

const RUN_BARS = [
  { label: 'Understand & plan', time: '4s', width: 6, detail: 'Research plan, 1 task, approval required up front.' },
  { label: 'Park & approve', time: 'human-paced', width: 10, detail: 'Nothing ran. The gate named the exact request; a human granted it.' },
  { label: 'Worker executes', time: '~3m', width: 100, detail: 'Real coding worker, scoped to the project, watched throughout.' },
  { label: 'Verify & accept', time: '8s', width: 8, detail: 'Exit 0, in-scope, evidence attached. Objective met.' },
];

const SUITES = [
  { n: '226', label: 'frontend tests green' },
  { n: '440', label: 'agent behavior tests green' },
  { n: '105', label: 'registry + provider tests green' },
  { n: '97', label: 'real downloads served' },
];

export function Proof() {
  const reduce = useReducedMotion();
  return (
    <section aria-label="Measured proof" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-14 px-5 sm:px-10 lg:grid-cols-2">
        <div>
          <SectionLabel index="03" name="Measured, not claimed" />
          <h2 className="font-display mt-8 max-w-[16ch] text-5xl font-medium tracking-tight text-white sm:text-6xl">
            One verified run, timed to the second.
          </h2>
          <div className="mt-10 space-y-5">
            {RUN_BARS.map((s, i) => (
              <div key={s.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-display text-[15px] font-medium text-white">{s.label}</h4>
                  <span className="font-mono2 shrink-0 text-[12px] text-white/70">{s.time}</span>
                </div>
                <div className="mt-2 h-9 overflow-hidden border border-white/12 bg-white/[0.03]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.width}%` }}
                    viewport={{ once: true, margin: '-15% 0px' }}
                    transition={{ duration: 1.3, delay: reduce ? 0 : i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full ${s.width === 100 ? 'bg-[var(--signal)]' : 'bg-white/25'}`}
                  />
                </div>
                <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-white/50">{s.detail}</p>
              </div>
            ))}
            <p className="pt-1 font-mono2 text-[11px] uppercase leading-relaxed tracking-[0.14em] text-white/35">
              One measured session · the worker phase dominates because the work is real
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-px bg-white/12">
            {SUITES.map((s) => (
              <div key={s.label} className="bg-black p-8">
                <div className="font-display text-5xl font-medium tracking-tight text-white">{s.n}</div>
                <p className="mt-2 font-mono2 text-[11px] uppercase leading-snug tracking-[0.14em] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md font-mono2 text-[11.5px] uppercase leading-[2] tracking-[0.12em] text-white/40">
              Counts from validation runs against this product. If a number can&apos;t be measured, it isn&apos;t shown.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
