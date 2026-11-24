import type { ReactNode } from "react";
import Link from "next/link";
export function Arrow({
  file = "vector11.svg",
  kind = "button",
  down = false,
}: {
  file?: string;
  kind?: "button" | "impact" | "service" | "nav";
  down?: boolean;
}) {
  return (
    <span
      className={"original-arrow arrow-" + kind + (down ? " arrow-down" : "")}
      aria-hidden="true"
    >
      <img src={"/assets/" + file} alt="" />
    </span>
  );
}
export function Button({
  children,
  href,
  light = false,
  outline = false,
  download = false,
}: {
  children: ReactNode;
  href: string;
  light?: boolean;
  outline?: boolean;
  download?: boolean;
}) {
  const file = download
    ? "vector10.svg"
    : light
      ? outline
        ? "vector4.svg"
        : "vector5.svg"
      : outline
        ? "vector12.svg"
        : "vector11.svg";
  const variant = outline
    ? light
      ? "button-outline button-light bg-transparent border-surface text-surface!"
      : "button-outline bg-transparent border-brand-navy text-brand-navy!"
    : light
      ? "button-light bg-surface border-surface text-brand-navy!"
      : "bg-brand-navy border-brand-navy text-surface!";
  return (
    <Link
      className={[
        "button inline-flex items-center gap-[calc(16*var(--u))] py-[calc(10*var(--u))] px-[calc(24*var(--u))] min-h-[calc(76*var(--u))] whitespace-nowrap border-[length:calc(1*var(--u))] border-solid rounded-[calc(8*var(--u))] text-[length:calc(22*var(--u))] font-bold leading-[calc(53.859*var(--u))] uppercase",
        variant,
        // Important text utilities preserve the unlayered global anchor reset.
        "[&:not(:disabled):not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:bg-brand-blue [&:not(:disabled):not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:border-brand-blue [&:not(:disabled):not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:text-brand-navy!",
        "[@media(max-width:700px)]:text-[16px] [@media(max-width:700px)]:min-h-[56px] [@media(max-width:700px)]:leading-[30px] [@media(max-width:700px)]:py-[10px] [@media(max-width:700px)]:px-[18px] [@media(max-width:700px)]:gap-[12px] [@media(max-width:700px)]:max-w-full [@media(max-width:700px)]:whitespace-normal [@media(max-width:700px)]:text-left",
      ].join(" ")}
      href={href}
    >
      {children}
      <Arrow file={file} down={download} />
    </Link>
  );
}
export function Stripe() {
  return (
    <div
      className="stripe relative z-[2] flex h-[calc(23*var(--u))]"
      aria-hidden="true"
    >
      <span className="w-[calc(311*var(--u))] bg-brand-turquoise [@media(max-width:700px)]:w-1/4" />
      <span className="flex-1 bg-brand-blue" />
    </div>
  );
}
export function Divider({ file = "line21.svg" }: { file?: string }) {
  return (
    <img
      className="original-divider absolute h-auto max-w-none pointer-events-none [transform:translateY(calc(-1*var(--u)))] opacity-50"
      src={"/assets/" + file}
      alt=""
      aria-hidden="true"
    />
  );
}
