/* "01 / NAME ———" section label with hairline rule. */

export function SectionLabel({ index, name, light = false }: { index: string; name: string; light?: boolean }) {
  const line = light ? 'bg-black/15' : 'bg-white/20';
  const text = light ? 'text-black/60' : 'text-white/60';
  return (
    <div className="flex items-center gap-5">
      <span className={`font-mono2 text-[11px] tracking-[0.24em] ${text}`}>
        {index} / {name}
      </span>
      <span aria-hidden className={`h-px w-40 sm:w-64 ${line}`} />
    </div>
  );
}
