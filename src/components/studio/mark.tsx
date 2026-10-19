export function Mark({ className = "h-12 w-12" }: { className?: string }) {
  return <img src="/mark.jpg" alt="" className={`${className} rounded-md object-cover`} />;
}

export function BondovaMark() {
  return (
    <span className="inline-flex max-w-[11rem] flex-col items-end gap-1 text-right">
      <span className="font-display text-xs font-medium tracking-[0.22em] uppercase">Bondova</span>
      <span className="crystal-rule block h-px w-full" aria-hidden />
      <span className="text-[11px] leading-tight text-muted">Mennesker og muligheter.</span>
    </span>
  );
}

export function Logo({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? "flex items-center gap-4" : "inline-flex items-center gap-2"}>
      <Mark className={large ? "h-20 w-20 shrink-0" : "h-12 w-12 shrink-0"} />
      <span className="min-w-0">
        <h1 className={large ? "font-display text-4xl leading-none" : "font-display text-base leading-none"}>ThorBragi</h1>
        {large ? (
          <p className="mt-2 text-xs font-medium tracking-widest text-muted uppercase">Bondova · Bondø Human AI</p>
        ) : null}
      </span>
    </span>
  );
}
