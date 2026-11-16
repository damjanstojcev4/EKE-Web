import { nav } from "@/data/navigation";
import Link from "next/link";
import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import { Divider } from "../ui";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <nav aria-label="Footer navigation">
          {nav.map((n) => (
            <Link key={n.label} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="social">
          <Divider file="line14.svg" />
          <strong>Social</strong>
          <div className="social-icons">
            <a
              className="social-facebook"
              href="https://www.facebook.com/EKEBitola"
              aria-label="EKE on Facebook"
            >
              <img src="/assets/basil-facebook-solid.svg" alt="" />
            </a>
            <a
              href="https://www.instagram.com/eke.bitola/"
              aria-label="EKE on Instagram"
            >
              <img src="/assets/vector.svg" alt="" />
            </a>
            <span title="LinkedIn destination not supplied">
              <img src="/assets/group.svg" alt="LinkedIn" />
            </span>
            <span title="X destination not supplied">
              <img src="/assets/vector2.svg" alt="X" />
            </span>
            <span title="YouTube destination not supplied">
              <img src="/assets/vector1.svg" alt="YouTube" />
            </span>
            <img
              className="social-small-detail"
              src="/assets/group1.svg"
              alt=""
            />
          </div>
          <Divider file="line13.svg" />
        </div>
        <div className="address">
          <strong>Address</strong>
          <a href="https://www.google.com/maps/search/?api=1&query=Belgradska+27,+7000+Bitola,+North+Macedonia">
            Belgradska 27, 7000 Bitola, North Macedonia
          </a>
        </div>
        <ContentBlock block={siteContent.registration} className="registration" />
      </div>
      <div className="footer-right">
        <h2>ENGAGE. EMPOWER. TRANSFORM.</h2>
        <div className="footer-legal">
          <span>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </span>
          <p>© 2026 EKE Bitola. All Rights Reserved.</p>
        </div>
        <p className="credit">
          Created by <a href="https://damar.work/">Damar Digital Studio</a>
        </p>
      </div>
    </footer>
  );
}
