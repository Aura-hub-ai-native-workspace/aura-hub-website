import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../motion/scroll';
import { SectionLabel } from './SectionLabel';
import { RELEASE, fetchReleases, type ReleaseNote } from '../data/content';

/* Latest releases — streamed from the public GitHub Releases API.
 * Renders nothing at all unless real release data arrives. */

export function Releases() {
  const [releases, setReleases] = useState<ReleaseNote[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetchReleases().then((r) => {
      if (alive && r) setReleases(r);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!releases) return null;

  return (
    <section aria-label="Latest releases" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
        <SectionLabel index="09" name="Changelog" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display max-w-[14ch] text-5xl font-medium tracking-tight text-white sm:text-7xl">
            Shipping in the open.
          </h2>
          <a
            href={`${RELEASE.repo}/releases`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 font-mono2 text-[12px] uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-white"
          >
            All releases <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-px bg-white/12 md:grid-cols-3">
          {releases.map((r) => (
            <Reveal key={r.tag} delay={0.05} className="h-full bg-black">
              <a href={r.url} target="_blank" rel="noopener" className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-white/[0.03]">
                <div className="flex items-center justify-between">
                  <span className="font-mono2 text-[13px] text-white">{r.tag}</span>
                  <span className="font-mono2 text-[11px] uppercase tracking-[0.14em] text-white/40">{r.date}</span>
                </div>
                <h3 className="font-display mt-4 text-xl font-medium text-white">{r.name}</h3>
                {r.notes && <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-white/55">{r.notes}</p>}
                <span className="mt-5 flex items-center gap-1.5 font-mono2 text-[11px] uppercase tracking-[0.14em] text-white/60 transition-colors group-hover:text-white">
                  Notes & assets <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
