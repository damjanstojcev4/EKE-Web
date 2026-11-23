import { pageMetadata } from "@/lib/seo";
import { BreadcrumbStructuredData } from "@/components/SeoStructuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Arrow } from "@/components/ui";
import ContactForm from "@/components/contact/ContactForm";
import PartnerFormNotice from "@/components/contact/PartnerFormNotice";
import styles from "./page.module.css";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Header />
      <BreadcrumbStructuredData page="contact" />
      <main id="main">
        <section className={styles.hero} aria-labelledby="contact-title">
          <p className={styles.label}>Contact</p>
          <h1 id="contact-title">Set Change In Motion</h1>
          <p className={styles.intro}>
            Ready to build a project, partner on a proposal, or join
            <br className={styles.desktopBreak} /> our network? Let’s move
            forward together.
          </p>
        </section>
        <section className={styles.partnership} aria-labelledby="partner-title">
          <div className={styles.partnerCopy}>
            <p className={styles.label}>Institutional Partnership</p>
            <h2 id="partner-title">Partner with EKE</h2>
            <ul className={styles.services}>
              <li>Joint Projects and Funding Applications</li>
              <li>Hosting or Sending Organizations</li>
              <li>Training and Tailor-Made Programs</li>
              <li>Erasmus+ Co-Development</li>
              <li>ESC Accredited Volunteering</li>
              <li>Specialized Curricula Design</li>
            </ul>
          </div>
          <div className={styles.partnerCard}>
            <img
              src="/assets/contact-page/Mask%20group.webp"
              alt=""
              width={507}
              height={231}
            />
            <div className={styles.partnerActions}>
              <a
                className={styles.download}
                href="/assets/eke-partner-information-2025.pdf"
                download
              >
                Download partner information <Arrow file="vector10.svg" down />
              </a>
              <PartnerFormNotice />
            </div>
          </div>
        </section>
        <section className={styles.enquiry} aria-label="Contact EKE">
          <div className={styles.enquiryPanel}>
            <div className={styles.information}>
              <div>
                <h2 className={styles.label}>Looking to take part?</h2>
                <p className={styles.invitation}>
                  Please tell us who you are and what
                  <br /> you want to build together.
                  <br /> We reply within 3 working days.
                </p>
              </div>
              <div className={styles.details}>
                <h2 className={styles.label}>Contact Details</h2>
                <ul>
                  <li>
                    <span>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:contact@ekebitola.org">
                        contact@ekebitola.org
                      </a>
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Phone:</strong>{" "}
                      <a href="tel:+38974605889">+389 74 605 889</a>
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Address:</strong> Belgradska 27,
                      <br />
                      7000, Bitola, N. Macedonia
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
