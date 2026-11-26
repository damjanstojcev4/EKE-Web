"use client";
import Link from "next/link";
import { Arrow } from "@/components/ui";
import { useRef } from "react";
import { nav, existing } from "@/data/navigation";
export default function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => {
    dialog.current?.close();
    document.body.style.overflow = "";
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
          <Link href={"/about"}>About</Link>
          <Link href={"/projects"}>Projects</Link>
          <Link className="nav-cta" href="/#news">
            Opportunities <Arrow file="vector13.svg" kind="nav" />
          </Link>
        </nav>
        <button
          className="menu-toggle"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          onClick={() => {
            dialog.current?.showModal();
            document.body.style.overflow = "hidden";
          }}
        >
          <span />
          <span />
        </button>
      </header>
      <dialog
        ref={dialog}
        className="menu-dialog"
        aria-label="Navigation menu"
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="menu-inner">
          <button className="menu-close" onClick={close}>
            Close{" "}
            <img src="/assets/menu-close.svg" alt="" width={28} height={28} />
          </button>
          <div className="menu-features">
            <Link href="/#news" className="menu-feature" onClick={close}>
              <img src="/assets/menu-news-mask.svg" alt="" />
              <div>
                <h2>News</h2>
                <p>
                  Stay up to date with EKE’s latest projects, stories, open
                  calls, and resources. Explore the ideas, experiences, and
                  practical knowledge shaping our work across communities.
                </p>
              </div>
            </Link>
            <Link href="/#expertise" className="menu-feature" onClick={close}>
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
            <Link
              className="menu-contact"
              href={existing("/contact")}
              onClick={close}
            >
              Contact
            </Link>
          </div>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link key={item.label} href={item.href} onClick={close}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="menu-social">
            <strong>Social</strong>
            <Link href="https://www.facebook.com/EKEBitola">Facebook</Link>
            <Link href="https://www.instagram.com/eke.bitola/">Instagram</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
