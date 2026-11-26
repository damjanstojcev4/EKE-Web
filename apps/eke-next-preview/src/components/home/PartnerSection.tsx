import FigmaText from "../FigmaText";
import { Button, Stripe } from "../ui";
import { existing } from "@/data/navigation";
export default function PartnerSection() {
  return (
    <section className="partner" id="contact">
      <Stripe />
      <div className="partner-content">
        <div className="partner-heading">
          <FigmaText id="2180:337" />
          <FigmaText id="2180:344" as="h2" />
        </div>
        <FigmaText id="2180:305" />
        <div className="partner-button">
          <Button light href={existing("/contact")}>
            Contact us
          </Button>
        </div>
        <div className="partner-decoration" aria-hidden="true">
          <img src="/assets/group2.svg" alt="" />
          <img src="/assets/group3.svg" alt="" />
          <img src="/assets/group4.svg" alt="" />
          <img src="/assets/group5.svg" alt="" />
        </div>
      </div>
    </section>
  );
}
