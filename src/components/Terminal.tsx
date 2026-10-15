import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/* Terminal cinema — a scripted agentic run, typed live in a loop.
 * Shaped from real product behavior. Pauses offscreen; instant text
 * under reduced-motion. */

interface Line {
  kind: 'cmd' | 'ok' | 'dim' | 'warn' | 'accent';
  text: string;
}

const SCRIPT: Line[] = [
  { kind: 'cmd', text: 'aura run "fix the login bug without touching payments"' },
  { kind: 'dim', text: 'intent compiled · research plan · 2 tasks' },
  { kind: 'ok', text: '✓ plan created — investigate → review' },
  { kind: 'warn', text: '◷ parked: approval apr-7f3a — delegate to coding worker' },
  { kind: 'accent', text: '✓ approved by you — resuming' },
  { kind: 'dim', text: 'worker opencode · role=research · scope=src/auth' },
  { kind: 'ok', text: '✓ worker exited 0 · 0 files outside scope' },
  { kind: 'dim', text: 'review worker (different machine) · findings: 1' },
  { kind: 'ok', text: '✓ verified — investigate, review · audit invm93few2' },
  { kind: 'accent', text: 'done in 3m 12s · nothing ran without your approval' },
];

const KIND_CLASS: Record<Line['kind'], string> = {
  cmd: 'text-white',
  ok: 'text-white/85',
  dim: 'text-white/40',
  warn: 'text-white/70',
  accent: 'text-white',
};

export function Terminal({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const [chars, setChars] = useState(0);
  const [visible, setVisible] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !visible) return;
    const line = SCRIPT[frame];
    if (!line) {
      const t = window.setTimeout(() => {
        setFrame(0);
        setChars(0);
      }, 4200);
      return () => window.clearTimeout(t);
    }
    if (chars < line.text.length) {
      const t = window.setTimeout(() => setChars((c) => c + 1), line.kind === 'cmd' ? 26 : 8);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setFrame((f) => f + 1);
      setChars(0);
    }, 650);
    return () => window.clearTimeout(t);
  }, [frame, chars, reduce, visible]);

  const doneLines = reduce ? SCRIPT : SCRIPT.slice(0, Math.min(frame, SCRIPT.length));
  const current = reduce || frame >= SCRIPT.length ? null : SCRIPT[frame];

  return (
    <div ref={boxRef} className="overflow-hidden border border-white/12 bg-black">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-white/50">Terminal</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/50">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--signal)]" />
          Live
        </span>
      </div>
      <div className={`font-mono2 space-y-1.5 px-4 py-4 leading-relaxed ${compact ? 'text-[11.5px]' : 'text-[12.5px]'}`}>
        {doneLines.map((line, i) => (
          <p key={`${i}-${line.text.slice(0, 12)}`} className={KIND_CLASS[line.kind]}>
            {line.kind === 'cmd' ? <span className="mr-2 text-[var(--signal)]">$</span> : null}
            {line.text}
          </p>
        ))}
        {current && (
          <p className={KIND_CLASS[current.kind]}>
            {current.kind === 'cmd' ? <span className="mr-2 text-[var(--signal)]">$</span> : null}
            {current.text.slice(0, chars)}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-[3px] bg-[var(--signal)]"
            />
          </p>
        )}
      </div>
    </div>
  );
}
