import { useEffect, useRef } from 'react';

/* Magenta ribbon field over black — flowing bands, parallax drift
 * with scroll. Code-drawn, zero assets, paused offscreen, still
 * frame under reduced-motion. */

export function Ribbons({ className = '', density = 5 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let running = true;
    let scroll = window.scrollY;

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    };
    resize();
    window.addEventListener('resize', resize);
    const onScroll = () => {
      scroll = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) loop(performance.now());
    });
    io.observe(canvas);

    const loop = (now: number) => {
      if (!running) return;
      const t = now / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);
      const drift = reduce ? 0 : (scroll * dpr * 0.06) % (h * 2);
      for (let i = 0; i < density; i++) {
        const p = i / density;
        const yBase = h * (0.15 + p * 0.85) - drift * (0.3 + p * 0.5);
        const amp = h * 0.09 * (1 + 0.3 * Math.sin(t * 0.2 + i * 1.7));
        const thick = (10 + 26 * (1 - p)) * dpr;
        const alpha = 0.1 + 0.16 * (1 - p);
        ctx.beginPath();
        for (let x = -50; x <= w + 50; x += 14) {
          const y =
            yBase +
            Math.sin(x / (w * 0.28) + t * (0.24 + p * 0.12) + i * 2.1) * amp +
            Math.sin(x / (w * 0.09) - t * 0.15 + i) * amp * 0.3;
          if (x === -50) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(244, 63, 126, ${alpha.toFixed(3)})`;
        ctx.lineWidth = thick;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.strokeStyle = `rgba(255, 150, 190, ${(alpha * 0.55).toFixed(3)})`;
        ctx.lineWidth = Math.max(1, thick * 0.12);
        ctx.stroke();
      }
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    loop(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}

export function DotGrid({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1.4px)',
        backgroundSize: '34px 34px',
      }}
    />
  );
}
