"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow } from "@/components/ui";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/data/navigation";
export default function Header() {
  const pathname = usePathname();
  const isCurrentPage = (href: string) => {
    const path = href.split("#")[0];
    return path === "/"
      ? pathname === "/"
      : pathname === path || Boolean(pathname?.startsWith(`${path}/`));
  };
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const previousOverflow = useRef("");
  useEffect(() => () => {
    document.body.style.overflow = previousOverflow.current;
  }, []);
  const close = () => {
    dialog.current?.close();
    setIsOpen(false);
    document.body.style.overflow = previousOverflow.current;
  };
  return (
    <>
      <Link href="#main" className="skip-link">
        Skip to content
      </Link>
      <header className="header">
        <Link href="/#home" className="logo" aria-label="EKE home">
          <img src="/assets/eke-logo-symbol.svg" alt="" />
          <span>
            <img src="/assets/eke-logo-wordmark.svg" alt="EKE" />
            <img src="/assets/eke-logo-bitola.svg" alt="Bitola" />
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href={"/about"} aria-current={isCurrentPage("/about") ? "page" : undefined}>
            <span className="nav-label">About</span>
          </Link>
          <Link href={"/projects"} aria-current={isCurrentPage("/projects") ? "page" : undefined}>
            <span className="nav-label">Projects</span>
          </Link>
          <Link className="nav-cta" href="/opportunities" aria-current={isCurrentPage("/opportunities") ? "page" : undefined}>
            <span className="nav-label">Opportunities</span> <Arrow file="vector13.svg" kind="nav" />
          </Link>
        </nav>
        <button
          className="menu-toggle"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="navigation-menu"
          onClick={() => {
            previousOverflow.current = document.body.style.overflow;
            dialog.current?.showModal();
            setIsOpen(true);
            document.body.style.overflow = "hidden";
          }}
        >
          <span />
          <span />
        </button>
      </header>
      <dialog
        ref={dialog}
        id="navigation-menu"
        className="menu-dialog"
        aria-label="Navigation menu"
        onClose={() => {
          setIsOpen(false);
          document.body.style.overflow = previousOverflow.current;
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="menu-inner">
          <Link href="/#home" className="logo menu-logo" aria-label="EKE home" onClick={close}>
            <img src="/assets/eke-logo-symbol.svg" alt="" />
            <span>
              <img src="/assets/eke-logo-wordmark.svg" alt="EKE" />
              <img src="/assets/eke-logo-bitola.svg" alt="Bitola" />
            </span>
          </Link>
          <button className="menu-close" onClick={close} aria-label="Close navigation menu">
            <span>Close</span>{" "}
            <img src="/assets/menu-close.svg" alt="" width={28} height={28} />
          </button>
          <div className="menu-features">
            <Link href="/news" className="menu-feature" onClick={close}>
              <img src="/assets/menu-news.png" alt="" />
              <div>
                <h2>News</h2>
                <p>
                  Stay up to date with EKE’s latest projects, stories, open
                  calls, and resources. Explore the ideas, experiences, and
                  practical knowledge shaping our work across communities.
                </p>
              </div>
            </Link>
            <Link href="/training" className="menu-feature" onClick={close}>
              <img src="/assets/menu-training.png" alt="" />
              <div>
                <h2>Training</h2>
                <p>
                  Discover learning experiences designed to turn knowledge into
                  practice and respond to real-world needs, from digital
                  literacy and inclusion to environmental education and
                  wellbeing.
                </p>
              </div>
            </Link>
          </div>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {nav.filter((item) => item.label !== "Home").map((item) => (
              <Link key={item.label} href={item.href} onClick={close} aria-current={isCurrentPage(item.href) ? "page" : undefined}>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="menu-aside">
            <Link className="menu-contact" href="/contact" onClick={close}>
              Contact
            </Link>
            <div className="menu-social">
              <strong>Social</strong>
              <div className="menu-social-icons">
                <a className="menu-facebook" href="https://www.facebook.com/EKEBitola" aria-label="EKE on Facebook">
                  <img src="/assets/basil-facebook-solid.svg" alt="" />
                </a>
                <a href="https://www.instagram.com/eke.bitola/" aria-label="EKE on Instagram">
                  <img src="/assets/vector.svg" alt="" />
                </a>
                <span title="LinkedIn destination not supplied"><img src="/assets/group.svg" alt="LinkedIn" /></span>
                <span title="X destination not supplied"><img src="/assets/vector2.svg" alt="X" /></span>
                <span title="YouTube destination not supplied"><img src="/assets/vector1.svg" alt="YouTube" /></span>
              </div>
            </div>
          </div>
          <p className="menu-tagline">Engage.Empower.<br />Transform.</p>
        </div>
      </dialog>
    </>
  );
}
