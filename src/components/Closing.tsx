import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../motion/scroll';
import { Ribbons } from './Ribbons';

export function FinalCta({ onDownload }: { onDownload: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <Ribbons density={4} />
      <div className="relative mx-auto w-full max-w-[1500px] px-5 py-32 sm:px-10 sm:py-44">
        <Reveal>
          <h2 className="font-display max-w-[16ch] text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-8xl">
            Bring the objective. Let&apos;s ship.
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={onDownload}
              className="group flex items-center gap-3 bg-white px-8 py-4 font-mono2 text-[12px] font-medium uppercase tracking-[0.14em] text-black transition-colors hover:bg-white/85"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a
              href="#demo"
              className="border border-white/25 px-8 py-4 font-mono2 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:border-white/60"
            >
              Watch demo
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const COLS: { head: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    head: '01 / Product',
    links: [
      { label: 'Engine', href: '#engine' },
      { label: 'Outcomes', href: '#showcase' },
      { label: 'Download', href: '#download' },
    ],
  },
  {
    head: '02 / AURA Hub',
    links: [
      { label: 'GitHub', href: 'https://github.com/Aura-hub-ai-native-workspace/aura-hub', external: true },
      { label: 'Releases', href: 'https://github.com/Aura-hub-ai-native-workspace/aura-hub/releases', external: true },
      { label: 'Contact', href: 'mailto:hello@aurahub.dev' },
    ],
  },
  {
    head: '03 / Record',
    links: [
      { label: 'Apache-2.0 License', href: 'https://github.com/Aura-hub-ai-native-workspace/aura-hub/blob/main/LICENSE', external: true },
      { label: 'aurahub.website', href: 'https://aurahub.website', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black">
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-2 gap-10 px-5 py-16 sm:px-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/brand/aura-logo.png" alt="AURA" className="h-7 w-7" />
            <span className="font-mono2 text-[15px] font-medium uppercase tracking-[0.3em] text-white">AURA</span>
          </div>
          <p className="font-display mt-5 max-w-[18ch] text-2xl font-medium text-white">Intelligence, verified.</p>
        </div>
        {COLS.map((col) => (
          <div key={col.head}>
            <h5 className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-white/40">{col.head}</h5>
            <div className="mt-5 flex flex-col gap-3">
              {col.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
                  className="group flex w-fit items-center gap-1.5 font-mono2 text-[12.5px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-6 sm:px-10">
        <span className="font-mono2 text-[11px] uppercase tracking-[0.18em] text-white/40">© 2026 AURA Hub</span>
        <span className="font-mono2 text-[11px] uppercase tracking-[0.18em] text-white/40">v0.1.20 · Apache-2.0</span>
      </div>
    </footer>
  );
}
