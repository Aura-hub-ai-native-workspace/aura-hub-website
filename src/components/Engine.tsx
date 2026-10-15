import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SectionLabel } from './SectionLabel';

/* The engine — left stage list, right inspectable diagram. Hovering
 * (or tapping) a stage lights its nodes and swaps the readout.
 * Content is the real agent loop: prompt → plan → approve → execute. */

interface Stage {
  n: string;
  title: string;
  body: string;
  nodes: string[];
  readout: string;
}

const STAGES: Stage[] = [
  {
    n: '01', title: 'Prompt', body: 'Describe the outcome in plain language. No worker names, no file paths, no model flags.',
    nodes: ['Objective', 'Project context', 'Capability map'], readout: 'INPUT — one objective, zero orchestration burden.',
  },
  {
    n: '02', title: 'Plan', body: 'The objective becomes a dependency-aware plan with roles, scopes, and acceptance criteria.',
    nodes: ['Research task', 'Review task', 'Acceptance gates'], readout: 'PLAN — validated structure, never a leap of faith.',
  },
  {
    n: '03', title: 'Approve', body: 'High-impact operations park for your explicit grant. Decline, and provably nothing runs.',
    nodes: ['Approval gate', 'Audit record', 'Scope contract'], readout: 'GATE — single-use grants, recorded forever.',
  },
  {
    n: '04', title: 'Execute', body: 'Real workers run through the governed Fabric — watched, verified, then reported with evidence.',
    nodes: ['Coding worker', 'Verification', 'Evidence bundle'], readout: 'OUTPUT — exit code, scope proofs, audit id.',
  },
];

export function Engine() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <section id="engine" aria-label="The engine" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
        <SectionLabel index="01" name="The agentic engine" />
        <h2 className="font-display mt-8 max-w-[12ch] text-5xl font-medium tracking-tight text-white sm:text-7xl">
          The Verified Core.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-l border-white/15">
            {STAGES.map((s, i) => (
              <button
                key={s.n}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="block w-full py-5 pl-6 text-left"
                aria-pressed={i === active}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono2 text-[11px] text-white/40">{s.n}</span>
                  <span className={`font-display text-2xl transition-colors duration-300 ${i === active ? 'text-white' : 'text-white/35 hover:text-white/70'}`}>
                    {s.title}
                  </span>
                </span>
                <AnimatePresence initial={false}>
                  {i === active && (
                    <motion.p
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden pl-10 pr-4 text-[14px] leading-relaxed text-white/60"
                    >
                      {s.body}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          <div className="border border-white/12 bg-white/[0.015] p-6 sm:p-10">
            <div className="flex items-center justify-between">
              <span className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-white/45">Run inspector</span>
              <span className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-white/45">Hover a stage</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.n}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-wrap gap-2.5"
                >
                  {stage.nodes.map((node) => (
                    <span key={node} className="border border-white/15 bg-white/[0.04] px-5 py-3 font-mono2 text-[12px] uppercase tracking-[0.12em] text-white/85">
                      {node}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={stage.n + '-r'}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono2 text-[12.5px] uppercase leading-[2] tracking-[0.14em] text-white/60"
                >
                  {stage.readout}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-8 flex gap-1.5" aria-hidden>
              {STAGES.map((s, i) => (
                <span key={s.n} className={`h-px flex-1 transition-colors duration-300 ${i <= active ? 'bg-white' : 'bg-white/15'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
