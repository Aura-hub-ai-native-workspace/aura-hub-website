import { ShieldCheck, KeyRound, FileLock2, Octagon } from 'lucide-react';
import { Stagger, StaggerItem } from '../motion/scroll';
import { SectionLabel } from './SectionLabel';

/* Trust — hairline cells on black. Guarantees enforced by the
 * execution path, not promised by copy. */

const ITEMS = [
  { icon: ShieldCheck, title: 'Approval-gated execution', body: 'High-impact operations park for a human decision. Decline, and nothing runs — provably.' },
  { icon: FileLock2, title: 'Audit everything', body: 'Every invocation, decision and verification lands in an append-only trail.' },
  { icon: KeyRound, title: 'Keys stay yours', body: 'Provider credentials live encrypted on your machine. Never in logs, prompts, or bundles.' },
  { icon: Octagon, title: 'No silent cloud', body: 'Self-hosted is primary. Cloud fallback activates only when you say so.' },
];

export function Security() {
  return (
    <section aria-label="Trust and safety" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
        <SectionLabel index="08" name="Trust" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display max-w-[14ch] text-5xl font-medium tracking-tight text-white sm:text-7xl">
            Stable, secure, compliant.
          </h2>
          <p className="max-w-sm font-mono2 text-[11.5px] uppercase leading-[2] tracking-[0.14em] text-white/50">
            Isolation per workload. Encrypted secrets. Full audit.
          </p>
        </div>
        <Stagger className="mt-12 grid grid-cols-1 gap-px bg-white/12 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
          {ITEMS.map((item) => (
            <StaggerItem key={item.title} className="h-full bg-black">
              <div className="h-full p-7 transition-colors duration-300 hover:bg-white/[0.03]">
                <item.icon className="h-5 w-5 text-white/80" />
                <h4 className="font-display mt-5 text-[18px] font-medium text-white">{item.title}</h4>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{item.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
