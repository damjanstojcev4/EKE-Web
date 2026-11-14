const origin =
  process.env.NEXT_PUBLIC_EXISTING_SITE_URL || "http://localhost:5173";
export const existing = (path: string) => new URL(path, origin).toString();
export const nav = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "News", href: "/news" },
  { label: "Training", href: "/training" },
  { label: "Contact", href: "/contact" },
];
