export function Mark({ className = "h-12 w-12" }: { className?: string }) {
  return <img src="/mark.jpg" alt="" className={`${className} rounded-md object-cover`} />;
}

export function Swoosh({ className = "h-6 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 36" aria-hidden>
      <path d="M4 28 C28 28 40 8 78 10 C96 11 108 16 116 8" fill="none" stroke="#2ec8e6" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 30 C34 26 48 14 86 16 C100 17 110 20 116 14" fill="none" stroke="#f4efea" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function Logo({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? "flex items-center gap-4" : "inline-flex items-center gap-2"}>
      <Mark className={large ? "h-20 w-20 shrink-0" : "h-12 w-12 shrink-0"} />
      <span className="min-w-0">
        <h1 className={large ? "font-display text-4xl leading-none" : "font-display text-base leading-none"}>ThorSound</h1>
        {large ? (
          <p className="mt-2 text-xs font-medium tracking-widest text-muted uppercase">Bondova · Bondø Human AI</p>
        ) : null}
      </span>
    </span>
  );
}
