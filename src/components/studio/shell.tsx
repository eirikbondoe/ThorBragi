import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Logo, Swoosh } from "./mark";

export function Shell({
  children,
  back,
}: {
  children: ReactNode;
  back?: { to: string; label: string };
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col">
      <header className="sticky top-0 z-20 bg-bg/95 px-5 pt-2 backdrop-blur-sm">
        <div className="crystal-rule -mx-5 mb-3" />
        <div className="flex items-center justify-between gap-3 pb-3">
          {back ? (
            <Link to={back.to} className="inline-flex min-h-11 items-center gap-1 text-sm text-muted">
              <ChevronLeft className="size-4" aria-hidden />
              {back.label}
            </Link>
          ) : (
            <Logo />
          )}
          {back ? <Logo /> : (
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
              <Swoosh />
              Bondova
            </span>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
