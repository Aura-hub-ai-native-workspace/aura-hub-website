import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SectionLabel } from './SectionLabel';

/* Capabilities — horizontal cards on a scroll-driven track, with a
 * bottom index rail. Touch devices get native sideways scroll. */

const CARDS = [
  { n: '01', tags: 'Research · Plan · Verify', title: 'Agentic Workspace', body: 'Objectives become dependency-aware plans. Workers are picked automatically, results verified before anything is called done.', ghost: '01' },
  { n: '02', tags: 'Chat · Citations · Memory', title: 'Grounded Answers', body: 'Conversation over a real knowledge graph — every answer cites retrieved context, never a guess dressed as confidence.', ghost: '02' },
  { n: '03', tags: 'Approvals · Audit · Stop', title: 'Governance Built In', body: 'High-impact operations park for approval. Decline and provably nothing runs. Stop kills real workers mid-flight.', ghost: '03' },
  { n: '04', tags: 'Ollama · Cloud keys', title: 'Model Freedom', body: 'Self-hosted servers are primary; cloud keys are explicit fallback. Your prompts never leave your machines uninvited.', ghost: '04' },
  { n: '05', tags: 'Graph · Health · Drift', title: 'Engineering Memory', body: 'Decisions, patterns and learnings persist across sessions. Architecture stays honest as code changes.', ghost: '05' },
];

export function Capabilities() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['3%', '-62%']);
  const rail = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const card = (c: (typeof CARDS)[number]) => (
    <article key={c.n} className="relative flex w-[82vw] shrink-0 flex-col justify-between overflow-hidden border border-white/12 bg-[#050505] p-8 sm:w-[560px] sm:p-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono2 text-[11px] text-white/45">{c.n}</span>
          <span className="text-right font-mono2 text-[11px] uppercase leading-relaxed tracking-[0.14em] text-white/45">{c.tags}</span>
        </div>
        <h3 className="font-display mt-14 text-4xl font-medium tracking-tight text-white sm:mt-20 sm:text-5xl">{c.title}</h3>
        <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-white/60">{c.body}</p>
      </div>
      <div className="mt-12 flex items-end justify-between">
        <span className="font-mono2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
          Explore <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
        <span aria-hidden className="font-display text-[110px] font-light leading-none text-white/[0.13] sm:text-[150px]">
          {c.ghost}
        </span>
      </div>
    </article>
  );

  return (
    <section aria-label="Capabilities" className="relative bg-black">
      <div className="mx-auto w-full max-w-[1500px] px-5 pt-28 sm:px-10 sm:pt-36">
        <SectionLabel index="02" name="What it does" />
        <h2 className="font-display mt-8 max-w-[14ch] text-5xl font-medium uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
          Engineered for <span className="font-semibold">autonomy.</span>
        </h2>
      </div>

      {reduce ? (
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-4 px-5 py-14 sm:px-10 md:grid-cols-2">
          {CARDS.map(card)}
        </div>
      ) : (
        <div ref={trackRef} className="relative hidden h-[340vh] md:block">
          <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
            <motion.div style={{ x }} className="flex w-max gap-4 pl-[max(1.25rem,calc((100vw-1500px)/2+2.5rem))]">
              {CARDS.map(card)}
              <div className="w-[8vw] shrink-0" />
            </motion.div>
            <div className="mx-auto mt-10 w-full max-w-[1500px] px-10">
              <div className="h-px w-full bg-white/12">
                <motion.div style={{ scaleX: rail }} className="h-px origin-left bg-white" />
              </div>
              <div className="mt-4 flex justify-between font-mono2 text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                <span>01 Research</span>
                <span>02 Answers</span>
                <span>03 Governance</span>
                <span>04 Models</span>
                <span>05 Memory</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-4 px-5 py-14 sm:px-10 md:hidden">
        {CARDS.map(card)}
      </div>
    </section>
  );
}
