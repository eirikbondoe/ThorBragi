import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const styles = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,border-color,scale] duration-150 active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-fg text-ink",
        quiet: "border border-line bg-surface text-fg",
        ghost: "bg-transparent text-muted",
        signal: "bg-signal text-signal-ink",
        danger: "border border-line bg-transparent text-signal",
      },
      size: {
        md: "min-h-11 px-4 text-sm",
        lg: "min-h-14 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof styles>) {
  return <button type={type} className={cn(styles({ variant, size }), className)} {...props} />;
}
