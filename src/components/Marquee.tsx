/* Capability marquee — the product surface in one breath. Infinite,
 * pause-on-hover, edge-masked, mono voice. */

const ITEMS = [
  'Knowledge Graph',
  'Agentic Workers',
  'Engineering Memory',
  'Mission Control',
  'Workflow Automation',
  'Governance',
  'Provider System',
  'Universal Search',
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section aria-label="Capabilities" className="relative overflow-hidden border-y border-white/10 bg-black py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-black to-transparent" />
      <div className="marquee-track flex w-max items-center gap-10 pr-10">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap font-mono2 text-[12px] uppercase tracking-[0.22em] text-white/50">
            {item}
            <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />
          </span>
        ))}
      </div>
    </section>
  );
}
