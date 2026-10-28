import Image from "next/image";
import copy from "@/data/copy.json";
import FigmaText from "../FigmaText";
import { Button, Stripe, Arrow, Divider } from "../ui";
import { existing } from "@/data/navigation";
const services = [
  ["Project Development", "2180:440", "line8.svg"],
  ["Training & Facilitation", "2180:441", "line11.svg"],
  ["Volunteering & Mobility", "2180:442", "line12.svg"],
  ["Institutional Cooperation", "2180:443", "line12.svg"],
  ["Research & Education", "2180:444", null],
] as const;
export default function PartnershipsSection() {
  return (
    <section className="partnerships" id="partnerships">
      <Stripe />
      <div className="partnership-photo">
        <Image
          src="/assets/partnership-international-flags.png"
          alt="International flags"
          fill
          sizes="100vw"
        />
        <div className="partnership-title">
          <FigmaText id="2180:340" />
          <FigmaText id="2180:345" as="h2" />
        </div>
      </div>
      <div className="partnership-intro">
        <FigmaText id="2180:320" />
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
        <Button href={existing("/contact")}>Partner with us</Button>
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
            <p data-figma-id={id}>{copy[id]}</p>
            {line && <Divider file={line} />}
          </div>
        ))}
      </div>
      <Stripe />
    </section>
  );
}
