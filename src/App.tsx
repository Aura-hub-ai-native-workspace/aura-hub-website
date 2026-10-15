import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Manifesto } from './components/Manifesto';
import { Engine } from './components/Engine';
import { Capabilities } from './components/Capabilities';
import { Proof } from './components/Proof';
import { Terminal } from './components/Terminal';
import { Metrics } from './components/Metrics';
import { Showcase } from './components/Showcase';
import { Demo } from './components/Demo';
import { Download } from './components/Download';
import { Security } from './components/Security';
import { Releases } from './components/Releases';
import { FinalCta, Footer } from './components/Closing';
import { ScrollProgress } from './motion/scroll';
import { SmoothScroll, useScrollToId } from './motion/SmoothScroll';

/* AURA Hub marketing site — DAQ rhythm, AURA substance.
 *
 * Every control navigates, downloads a real release asset, or plays a
 * real frame. No fake forms, no dead buttons, no mock content. */

function Shell() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      <ScrollProgress />
      <SmoothScroll>
        <Page />
      </SmoothScroll>
    </div>
  );
}

function Page() {
  const scrollToId = useScrollToId();
  const scrollToDownload = () => scrollToId('download');

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Engine />
        <Capabilities />
        <Proof />
        <TerminalSection />
        <Metrics />
        <Showcase />
        <Demo />
        <Download />
        <Security />
        <Releases />
        <FinalCta onDownload={scrollToDownload} />
      </main>
      <Footer />
    </>
  );
}

function TerminalSection() {
  return (
    <section aria-label="Watch it work" className="relative bg-black py-28 sm:py-36">
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-12 px-5 sm:px-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display max-w-[14ch] text-5xl font-medium tracking-tight text-white sm:text-6xl">
            Watch it work, line by line.
          </h2>
          <p className="mt-5 max-w-md font-mono2 text-[11.5px] uppercase leading-[2] tracking-[0.14em] text-white/50">
            A scripted agentic run, typed live. Timings and audit id from a real verified session.
          </p>
        </div>
        <Terminal />
      </div>
    </section>
  );
}

function App() {
  return <Shell />;
}

export default App;
