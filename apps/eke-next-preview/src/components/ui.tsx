import type { ReactNode } from "react";
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
  return (
    <a
      className={`button ${light ? "button-light" : ""} ${outline ? "button-outline" : ""}`}
      href={href}
    >
      {children}
      <Arrow file={file} down={download} />
    </a>
  );
}
export function Stripe() {
  return (
    <div className="stripe" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}
export function Label({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function Divider({ file = "line21.svg" }: { file?: string }) {
  return (
    <img
      className="original-divider"
      src={"/assets/" + file}
      alt=""
      aria-hidden="true"
    />
  );
}
