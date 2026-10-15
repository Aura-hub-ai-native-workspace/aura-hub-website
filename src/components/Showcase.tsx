import { motion } from 'motion/react';
import { Stagger, StaggerItem } from '../motion/scroll';
import { SectionLabel } from './SectionLabel';

/* Outcomes — the real product, framed in hairlines. Screenshots
 * carry mono captions; hover lifts the frame. */

const SHOTS = [
  { shot: '/screenshots/03-ai-chat.png', caption: 'AI Chat — grounded conversation' },
  { shot: '/screenshots/08-knowledge-graph.png', caption: 'Knowledge Graph — computed, then queried' },
  { shot: '/screenshots/09-architecture-blueprint.png', caption: 'Architecture Explorer' },
  { shot: '/screenshots/10-engineering-memory.png', caption: 'Engineering Memory' },
  { shot: '/screenshots/07-automation-studio.png', caption: 'Automation Studio' },
  { shot: '/screenshots/04-mission-control.png', caption: 'Mission Control — live execution' },
  { shot: '/screenshots/11-engineering-governance.png', caption: 'Engineering Governance' },
  { shot: '/screenshots/13-command-palette.png', caption: 'Universal Search' },
  { shot: '/screenshots/12-provider-settings.png', caption: 'Provider System — bring your own key' },
];

export function Showcase() {
  return (
    <section id="showcase" aria-label="Outcomes" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
        <SectionLabel index="05" name="Outcomes" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display max-w-[14ch] text-5xl font-medium uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
            The real product, <span className="text-hollow">not a mockup.</span>
          </h2>
          <p className="max-w-sm font-mono2 text-[11.5px] uppercase leading-[2] tracking-[0.14em] text-white/50">
            Nine surfaces, one workspace. Every frame below is the shipped application.
          </p>
        </div>
        <Stagger className="mt-14 grid grid-cols-1 gap-px bg-white/12 sm:grid-cols-2 lg:grid-cols-3" gap={0.06}>
          {SHOTS.map((s) => (
            <StaggerItem key={s.shot} className="h-full">
              <figure className="group relative h-full overflow-hidden bg-black">
                <div className="overflow-hidden">
                  <img
                    src={s.shot}
                    alt={s.caption}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
                  <span className="font-mono2 text-[11px] uppercase tracking-[0.14em] text-white/60">{s.caption}</span>
                  <motion.span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/25 transition-colors duration-300 group-hover:bg-[var(--signal)]"
                  />
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
