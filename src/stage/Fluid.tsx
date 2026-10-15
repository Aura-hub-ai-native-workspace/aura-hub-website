import { useEffect, useRef } from 'react';

/* Fluid smoke — layered desaturated navy currents drifting over
 * black, like slow ink in water. One DPR-capped canvas, transform-
 * free painting, paused offscreen, still frame under
 * reduced-motion. No assets. */

const BLOBS = [
  { hue: [26, 38, 62], a: 0.5, sx: 0.42, sy: 0.34, r: 0.52, f1: 0.11, f2: 0.07 },
  { hue: [34, 50, 80], a: 0.42, sx: 0.72, sy: 0.62, r: 0.46, f1: 0.09, f2: 0.13 },
  { hue: [18, 28, 48], a: 0.55, sx: 0.55, sy: 0.85, r: 0.6, f1: 0.07, f2: 0.1 },
  { hue: [48, 66, 100], a: 0.3, sx: 0.15, sy: 0.7, r: 0.4, f1: 0.13, f2: 0.08 },
];

export function Fluid({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    let raf = 0;
    let running = true;

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    };
    resize();
    window.addEventListener('resize', resize);
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
      BLOBS.forEach((b, i) => {
        const [r, g, bl] = b.hue;
        const x = (b.sx + 0.09 * Math.sin(t * b.f1 + i * 2.4)) * w;
        const y = (b.sy + 0.08 * Math.cos(t * b.f2 + i * 1.3)) * h;
        const rad = b.r * Math.max(w, h);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
        grad.addColorStop(0, `rgba(${r},${g},${bl},${b.a})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
      // vignette to pure black edges
      const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    loop(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}

/* Hairline column grid overlay. */
export function GridLines({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-4 px-5 sm:px-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${i === 0 ? 'border-l' : ''} border-r border-white/[0.07]`} />
        ))}
      </div>
    </div>
  );
}
