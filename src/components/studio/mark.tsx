export function Mark({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 88" className={className} aria-hidden>
      <defs>
        <clipPath id="lydvenn-stone">
          <path d="M32 4 L60 32 L32 84 L4 32 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#lydvenn-stone)">
        <rect width="64" height="36" fill="var(--color-crystal)" />
        <rect y="36" width="64" height="16" fill="var(--color-gold)" />
        <rect y="52" width="64" height="36" fill="var(--color-violet)" />
      </g>
      <path d="M18 30 H46 V38 H36 V58 H28 V38 H18 Z" fill="var(--color-ink)" />
    </svg>
  );
}

export function Logo({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? "flex items-center gap-4" : "inline-flex items-center gap-2"}>
      <Mark className={large ? "h-16 w-auto shrink-0" : "h-7 w-auto shrink-0"} />
      <span className="min-w-0">
        {large ? (
          <h1 className="font-display text-3xl leading-none sm:text-4xl">
            <span className="block">Thorøisjen</span>
            <span className="block">Jakkobbsen</span>
          </h1>
        ) : (
          <h1 className="block font-display text-xs leading-tight">
            Thorøisjen
            <span className="block">Jakkobbsen</span>
          </h1>
        )}
        {large ? (
          <p className="mt-2 text-xs font-medium tracking-widest text-muted uppercase">Bondova · Bondø Human AI</p>
        ) : null}
      </span>
    </span>
  );
}
