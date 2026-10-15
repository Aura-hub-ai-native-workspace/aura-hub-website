import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from '../data/content';

export function Navbar() {
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.1 }}
        className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ${scrolled ? 'bg-black/85 backdrop-blur-md' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-10">
          <a href="#top" className="flex items-center gap-3">
            <img src="/brand/aura-logo.png" alt="AURA" className="h-7 w-7" />
            <span className="font-mono2 text-[15px] font-medium uppercase tracking-[0.3em] text-white">AURA</span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            <div className="group relative">
              <button className="flex items-center gap-1.5 font-mono2 text-[12.5px] uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white" aria-haspopup="true">
                Engine
                <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <div className="w-64 border border-white/10 bg-[#0a0a0c]/95 p-2 backdrop-blur-xl">
                  {[
                    { href: '#engine', title: 'The Engine', desc: 'Prompt to verified result' },
                    { href: '#showcase', title: 'Outcomes', desc: 'Measured, never claimed' },
                    { href: '#download', title: 'Download', desc: 'Linux, Windows, macOS' },
                  ].map((item) => (
                    <a key={item.href} href={item.href} className="block px-4 py-3 transition-colors hover:bg-white/[0.06]">
                      <span className="block text-[13.5px] font-medium text-white">{item.title}</span>
                      <span className="block font-mono2 text-[11px] uppercase tracking-[0.1em] text-white/45">{item.desc}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            {NAV_LINKS.filter((l) => l.label !== 'Engine').map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono2 text-[12.5px] uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#download"
            className="group hidden items-center gap-2 bg-white px-6 py-3 font-mono2 text-[12px] font-medium uppercase tracking-[0.14em] text-black transition-colors hover:bg-white/85 lg:flex"
          >
            Start Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center text-white lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <Menu className={`absolute h-6 w-6 transition-all duration-300 ${menuOpen ? 'rotate-90 opacity-0' : 'opacity-100'}`} />
            <X className={`absolute h-6 w-6 transition-all duration-300 ${menuOpen ? 'opacity-100' : '-rotate-90 opacity-0'}`} />
          </button>
        </div>
        <div className={`h-px bg-white/10 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] flex flex-col justify-center bg-black px-8 lg:hidden"
            aria-label="Mobile"
          >
            {[...NAV_LINKS, { href: '#download', label: 'Start Project' }].map((link, i) => (
              <motion.a
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-white/10 py-5 font-display text-4xl font-medium uppercase tracking-tight text-white"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
