import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../motion/scroll';
import { SectionLabel } from './SectionLabel';
import {
  RELEASE,
  assetUrl,
  detectOS,
  fetchDownloadStats,
  releaseUrl,
  type DownloadStats,
} from '../data/content';

/* Download matrix — every href, filename and version flows from the
 * RELEASE object. OS detection HIGHLIGHTS one card; nothing is ever
 * hidden, disabled or reordered. Stats render only from live figures,
 * with animated counters. */

function useOsHighlight() {
  const [os, setOs] = useState<ReturnType<typeof detectOS>>(null);
  useEffect(() => {
    setOs(detectOS());
  }, []);
  return os;
}

function Counter({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1400);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shown.toLocaleString()}</>;
}

export function Download() {
  const os = useOsHighlight();
  const [stats, setStats] = useState<DownloadStats | null>(null);
  useEffect(() => {
    let alive = true;
    fetchDownloadStats().then((s) => {
      if (alive && s) setStats(s);
    });
    return () => {
      alive = false;
    };
  }, []);

  const osName =
    os === 'windows' ? 'Windows x64' : os === 'macos' ? 'macOS — choose Apple Silicon or Intel' : os === 'linux' ? 'Linux x64' : null;

  const card = (id: 'linux' | 'windows' | 'macos', title: string, arch: string) => (
    <div className={`flex h-full flex-col border bg-black p-7 transition-colors duration-300 sm:p-8 ${os === id ? 'border-white' : 'border-white/12'}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl font-medium text-white">{title}</h3>
        {os === id && (
          <span className="bg-white px-2.5 py-1 font-mono2 text-[10px] uppercase tracking-[0.14em] text-black">Recommended</span>
        )}
      </div>
      <p className="font-mono2 mt-1 text-[11.5px] uppercase tracking-[0.14em] text-white/40">{arch}</p>
      <div className="mt-6 flex flex-1 flex-col gap-2.5">{childrenFor(id)}</div>
    </div>
  );

  const childrenFor = (id: 'linux' | 'windows' | 'macos') => {
    if (id === 'linux')
      return (
        <>
          <Btn href={assetUrl('linuxTarball')} primary label="Download for Linux" meta={`Tarball ${RELEASE.sizes.linuxTarball} · AppImage ${RELEASE.sizes.linuxAppImage} · .deb ${RELEASE.sizes.linuxDeb}`} />
          <div className="grid grid-cols-2 gap-2.5">
            <Btn href={assetUrl('linuxDeb')} label=".deb" />
            <Btn href={assetUrl('linuxAppImage')} label="AppImage" />
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-white/45">Extract and open — ready to run, no admin password.</p>
        </>
      );
    if (id === 'windows')
      return (
        <>
          <Btn href={assetUrl('windows')} primary label="Download for Windows" meta={`Installer · ${RELEASE.sizes.windows}`} />
          <p className="mt-2 text-[12.5px] leading-relaxed text-white/45">Unsigned — SmartScreen will warn before it runs.</p>
        </>
      );
    return (
      <>
        <Btn href={assetUrl('macosArm64')} primary label="Apple Silicon (.dmg)" meta={`${RELEASE.sizes.macosArm64} / ${RELEASE.sizes.macosX64}`} />
        <Btn href={assetUrl('macosX64')} label="Intel (.dmg)" />
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/45">Unsigned — Gatekeeper quarantines; allow explicitly.</p>
      </>
    );
  };

  return (
    <section id="download" aria-label="Download" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
        <SectionLabel index="07" name="Download" />
        <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-3">
          <h2 className="font-display text-5xl font-medium tracking-tight text-white sm:text-7xl">Download AURA Hub</h2>
          <span className="mb-2 border border-white/25 px-3.5 py-1.5 font-mono2 text-[12px] text-white/80">v{RELEASE.version}</span>
        </div>
        <p className="mt-5 max-w-xl font-mono2 text-[12px] uppercase leading-[2] tracking-[0.14em] text-white/55">
          Desktop builds for Linux, Windows and macOS. Every build below was compiled and then run on the operating system it targets.
        </p>
        {osName && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 inline-flex items-center gap-2.5 border border-white/20 px-4 py-2.5 font-mono2 text-[11.5px] uppercase tracking-[0.14em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Recommended for your system: <b className="text-white">{osName}</b>
          </motion.p>
        )}

        <Stagger className="mt-12 grid grid-cols-1 gap-px bg-white/12 md:grid-cols-3" gap={0.1}>
          {(['linux', 'windows', 'macos'] as const).map((id) => (
            <StaggerItem key={id} className="h-full bg-black">
              {card(id, id === 'linux' ? 'Linux' : id === 'windows' ? 'Windows' : 'macOS', id === 'linux' ? 'x64 · tarball leads' : id === 'windows' ? 'x64 · NSIS installer' : 'Apple Silicon & Intel')}
            </StaggerItem>
          ))}
        </Stagger>

        {stats && (
          <Reveal className="mx-auto mt-14 max-w-3xl">
            <div className="flex items-end justify-between gap-6 sm:gap-10">
              <div>
                <div className="font-display text-6xl font-medium tracking-tight text-white"><Counter value={stats.total} /></div>
                <div className="font-mono2 mt-2 text-[11px] uppercase tracking-[0.2em] text-white/45">Downloads</div>
              </div>
              {([['Windows', stats.windows], ['Linux', stats.linux], ['macOS', stats.macos]] as const).map(([k, v]) => (
                <div key={k}>
                  <div className="font-display text-3xl font-medium text-white/90"><Counter value={v} /></div>
                  <div className="font-mono2 mt-2 text-[11px] uppercase tracking-[0.2em] text-white/45">{k}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 font-mono2 text-[11px] uppercase tracking-[0.14em] text-white/40">
              Live from GitHub Releases · <a href={releaseUrl} target="_blank" rel="noopener" className="underline decoration-white/30 underline-offset-4 hover:text-white/70">notes & SHA-256 checksums</a>
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Btn({ href, label, primary = false, meta }: { href: string; label: string; primary?: boolean; meta?: string }) {
  return (
    <div>
      <a
        href={href}
        className={`group flex items-center justify-center gap-2 px-4 py-3.5 font-mono2 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors ${
          primary ? 'bg-white text-black hover:bg-white/85' : 'border border-white/20 text-white hover:border-white/60'
        }`}
      >
        {label}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
      {meta && <p className="mt-2 font-mono2 text-[10.5px] uppercase tracking-[0.1em] text-white/35">{meta}</p>}
    </div>
  );
}
