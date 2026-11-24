import { pageMetadata } from "@/lib/seo";
import { BreadcrumbStructuredData } from "@/components/SeoStructuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Arrow } from "@/components/ui";
import ContactForm from "@/components/contact/ContactForm";
import PartnerFormNotice from "@/components/contact/PartnerFormNotice";
import styles from "@/components/contact/contact.module.css";

export const metadata = pageMetadata("contact");

// Both service and contact-detail lists use the same exact square markers.
const markedItemClasses =
  "flex items-baseline gap-[calc(19*var(--u))] before:content-[''] before:w-[calc(18*var(--u))] before:h-[calc(18*var(--u))] before:shrink-0 before:bg-brand-turquoise [@media(max-width:768px)]:before:w-[13px] [@media(max-width:768px)]:before:h-[13px] [@media(max-width:768px)]:gap-[14px]";

export default function ContactPage() {
  return (
    <div className={[styles.page, "bg-surface-muted overflow-clip"].join(" ")}>
      <Header />
      <BreadcrumbStructuredData page="contact" />
      <main id="main" className="text-surface">
        <section
          className="mt-[calc(77*var(--u))] bg-brand-navy h-[calc(560*var(--u))] [padding:calc(158*var(--u))_calc(80*var(--u))_0] [@media(max-width:768px)]:mt-[48px] [@media(max-width:768px)]:h-auto [@media(max-width:768px)]:[padding:112px_24px_55px]"
          aria-labelledby="contact-title"
        >
          <p className="text-[length:calc(22*var(--u))] leading-[1.3] font-bold uppercase ml-[calc(4*var(--u))]! [@media(max-width:1100px)]:text-[length:16px]">
            Contact
          </p>
          <h1
            id="contact-title"
            className="text-[length:calc(100*var(--u)_-_2px)] leading-[1.15] font-bold tracking-[calc(-1.5*var(--u))] mt-[calc(43*var(--u))]! [@media(max-width:768px)]:text-[length:calc(clamp(40px,_8vw,_60px)_-_2px)] [@media(max-width:768px)]:leading-[1.1] [@media(max-width:768px)]:mt-[28px]! [@media(max-width:768px)]:tracking-[-1px]"
          >
            Set Change In Motion
          </h1>
          <p className="text-brand-blue text-[length:calc(40*var(--u))] leading-[1.25] [margin:calc(9*var(--u))_0_0_calc(4*var(--u))]! [@media(max-width:768px)]:text-[length:24px] [@media(max-width:768px)]:[margin:18px_0_0]!">
            Ready to build a project, partner on a proposal, or join
            <br className="[@media(max-width:768px)]:[display:none]" /> our
            network? Let’s move forward together.
          </p>
        </section>
        <section
          className="grid grid-cols-[minmax(0,_1183fr)_minmax(0,_537fr)] gap-[calc(38*var(--u))] bg-brand-navy mt-[calc(21*var(--u))] [padding:calc(64*var(--u))_calc(82*var(--u))_calc(61*var(--u))_calc(80*var(--u))] [@media(max-width:1100px)]:grid-cols-[minmax(0,_1.5fr)_minmax(0,_1fr)] [@media(max-width:768px)]:grid-cols-[1fr] [@media(max-width:768px)]:[padding:32px_24px] [@media(max-width:768px)]:gap-[24px] [@media(max-width:768px)]:mt-[16px]"
          aria-labelledby="partner-title"
        >
          <div className="[border-top:1px_solid_#4da6ffb3] [border-left:1px_solid_#4da6ffb3] [border-bottom:1px_solid_#4da6ffb3] [border-right:0] rounded-[calc(25*var(--u))_0_0_calc(25*var(--u))] [padding:calc(46*var(--u))_calc(35*var(--u))] [@media(max-width:768px)]:[padding:24px] [@media(max-width:768px)]:[border-right:1px_solid_#4da6ffb3] [@media(max-width:768px)]:rounded-[20px]">
            <p className="text-[length:calc(22*var(--u))] leading-[1.3] font-bold uppercase [@media(max-width:1100px)]:text-[length:16px]">
              Institutional Partnership
            </p>
            <h2
              id="partner-title"
              className="text-brand-blue text-[length:calc(80*var(--u)_-_2px)] leading-[1.2] font-bold mt-[calc(18*var(--u))]! [@media(480px<width<=768px)]:text-[length:40px] [@media(max-width:768px)]:mt-[18px]! [@media(max-width:480px)]:text-[length:34px]"
            >
              Partner with EKE
            </h2>
            <ul className="grid grid-rows-[repeat(3,_auto)] grid-flow-col grid-cols-[1fr_1.3fr] gap-[calc(13*var(--u))_calc(25*var(--u))] p-0 [margin:calc(102*var(--u))_0_calc(26*var(--u))] [list-style:none] text-brand-blue text-[length:calc(22*var(--u))] leading-[1.35] [@media(max-width:1100px)]:grid-cols-[1fr] [@media(max-width:1100px)]:grid-flow-row [@media(max-width:1100px)]:grid-rows-[none] [@media(max-width:1100px)]:mt-[30px] [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:768px)]:gap-[14px] [@media(max-width:768px)]:mb-[0]">
              <li className={markedItemClasses}>
                Joint Projects and Funding Applications
              </li>
              <li className={markedItemClasses}>
                Hosting or Sending Organizations
              </li>
              <li className={markedItemClasses}>
                Training and Tailor-Made Programs
              </li>
              <li className={markedItemClasses}>Erasmus+ Co-Development</li>
              <li className={markedItemClasses}>ESC Accredited Volunteering</li>
              <li className={markedItemClasses}>
                Specialized Curricula Design
              </li>
            </ul>
          </div>
          <div className="[padding:calc(13*var(--u))] [border:1px_solid_#4da6ffb3] rounded-[calc(30*var(--u))] [@media(max-width:768px)]:[padding:12px] [@media(max-width:768px)]:rounded-[24px] [@media(max-width:768px)]:max-w-[540px] [@media(max-width:768px)]:w-full [@media(max-width:768px)]:justify-self-center">
            <img
              src="/assets/contact-page/Mask%20group.webp"
              alt=""
              width={507}
              height={231}
              className="w-full h-auto rounded-[calc(25*var(--u))_calc(25*var(--u))_0_0] [@media(max-width:768px)]:rounded-[18px_18px_0_0]"
            />
            <div className="grid gap-[calc(22*var(--u))] [margin:calc(42*var(--u))_calc(45*var(--u))_calc(26*var(--u))] [@media(max-width:1100px)]:[margin:24px_4px_12px] [@media(max-width:1100px)]:gap-[16px] [@media(max-width:768px)]:[margin:24px_12px_12px]">
              <a
                className="flex items-center justify-center gap-[calc(18*var(--u))] min-h-[calc(64*var(--u))] [padding:calc(10*var(--u))] rounded-[calc(7*var(--u))] uppercase font-bold whitespace-nowrap text-[length:calc(18*var(--u))] bg-surface text-brand-navy! [&:is(:hover,:active,:focus-visible)]:bg-brand-blue [&:is(:hover,:active,:focus-visible)]:text-brand-navy! [&:is(:hover,:active,:focus-visible)]:[border-color:var(--color-brand-blue)] [@media(max-width:1100px)]:whitespace-normal [@media(max-width:1100px)]:text-[length:12px] [@media(max-width:1100px)]:min-h-[44px] [@media(max-width:768px)]:text-[length:14px] [@media(max-width:768px)]:[padding:12px] [@media(max-width:768px)]:rounded-[6px]"
                href="/assets/eke-partner-information-2025.pdf"
                download
              >
                Download partner information <Arrow file="vector10.svg" down />
              </a>
              <PartnerFormNotice />
            </div>
          </div>
        </section>
        <section
          className="bg-brand-navy mt-[calc(19*var(--u))] [padding:calc(59*var(--u))_calc(80*var(--u))] [@media(max-width:768px)]:mt-[16px] [@media(max-width:768px)]:[padding:32px_24px]"
          aria-label="Contact EKE"
        >
          <div className="[border:1px_solid_#4da6ffb3] rounded-[calc(25*var(--u))] min-h-[calc(745*var(--u))] [padding:calc(50*var(--u))_calc(99*var(--u))_calc(60*var(--u))_calc(39*var(--u))] grid gap-x-[calc(80*var(--u))] grid-cols-[minmax(0,_590fr)_minmax(0,_948fr)] [@media(768px<width<=1100px)]:[padding:30px] [@media(max-width:1100px)]:grid-cols-[minmax(0,_0.85fr)_minmax(0,_1.5fr)] [@media(max-width:1100px)]:gap-[30px] [@media(max-width:768px)]:grid-cols-[1fr] [@media(max-width:768px)]:gap-[40px] [@media(max-width:768px)]:rounded-[20px] [@media(480px<width<=768px)]:[padding:24px] [@media(max-width:480px)]:[padding:22px_18px]">
            <div className="flex flex-col justify-between pb-[calc(26*var(--u))] [@media(max-width:768px)]:gap-[32px] [@media(max-width:768px)]:p-0">
              <div>
                <h2 className="text-[length:calc(22*var(--u)_-_2px)] leading-[1.3] font-bold uppercase [@media(max-width:1100px)]:text-[length:14px]">
                  Looking to take part?
                </h2>
                {/* Preserve the original text runs around hidden line breaks. */}
                {/* prettier-ignore */}
                <p className="text-[length:calc(20*var(--u))] leading-[1.4] mt-[calc(57*var(--u))]! [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:768px)]:mt-[24px]!">
                  Please tell us who you are and what
                  <br className="[@media(max-width:768px)]:[display:none]" /> you want to build together.
                  <br className="[@media(max-width:768px)]:[display:none]" /> We reply within 3 working days.
                </p>
              </div>
              <div>
                <h2 className="text-[length:calc(22*var(--u)_-_2px)] leading-[1.3] font-bold uppercase [@media(max-width:1100px)]:text-[length:14px]">
                  Contact Details
                </h2>
                <ul className="[list-style:none] [margin:calc(52*var(--u))_0_0] p-0 grid gap-[calc(13*var(--u))] text-brand-blue text-[length:calc(22*var(--u))] leading-[1.3] [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:1100px)]:[overflow-wrap:anywhere] [@media(max-width:768px)]:mt-[24px] [@media(max-width:768px)]:gap-[14px]">
                  <li className={markedItemClasses}>
                    <span>
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:contact@ekebitola.org"
                        className="[&:hover]:underline!"
                      >
                        contact@ekebitola.org
                      </a>
                    </span>
                  </li>
                  <li className={markedItemClasses}>
                    <span>
                      <strong>Phone:</strong>{" "}
                      <a
                        href="tel:+38974605889"
                        className="[&:hover]:underline!"
                      >
                        +389 74 605 889
                      </a>
                    </span>
                  </li>
                  <li className={markedItemClasses}>
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
