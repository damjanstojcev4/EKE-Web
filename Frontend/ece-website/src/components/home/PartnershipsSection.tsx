import Image from "next/image";
import { serviceCopy } from "@/content/service-copy";
import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import { Button, Stripe, Arrow, Divider } from "../ui";
const services = [
  ["Project Development", "projectDevelopment", "line8.svg"],
  ["Training & Facilitation", "training", "line11.svg"],
  ["Volunteering & Mobility", "volunteering", "line12.svg"],
  ["Institutional Cooperation", "institutionalCooperation", "line12.svg"],
  ["Research & Education", "research", null],
] as const;
export default function PartnershipsSection() {
  return (
    <section className="partnerships" id="partnerships">
      <Stripe />
      <div className="partnership-photo">
        <Image
          src="/assets/partnership-international-flags.webp"
          alt="International flags"
          fill
          sizes="100vw"
        />
        <div className="partnership-title">
          <ContentBlock block={siteContent.partnershipLabel} />
          <ContentBlock block={siteContent.partnershipHeading} as="h2" />
        </div>
      </div>
      <div className="partnership-intro">
        <ContentBlock block={siteContent.partnershipIntro} />
        <Divider file="line20.svg" />
      </div>
      <div className="actions partnership-actions">
        <Button
          outline
          download
          href="/assets/eke-partner-information-2025.pdf"
        >
          Download our PIF
        </Button>
        <Button href="/contact">Partner with us</Button>
      </div>
      <div className="services">
        <img
          className="services-decoration"
          src="/assets/partnership-services-figure.svg"
          alt=""
        />
        {services.map(([title, id, line]) => (
          <div className="service" key={id}>
            <h3>
              <Arrow kind="service" file="vector9.svg" />
              {title}
            </h3>
            <p>{serviceCopy[id]}</p>
            {line && <Divider file={line} />}
          </div>
        ))}
      </div>
      <Stripe />
    </section>
  );
}
