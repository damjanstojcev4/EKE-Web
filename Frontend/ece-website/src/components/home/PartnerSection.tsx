import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import { Button, Stripe } from "../ui";
export default function PartnerSection() {
  return (
    <section className="partner" id="contact">
      <Stripe />
      <div className="partner-content">
        <div className="partner-heading">
          <ContentBlock block={siteContent.partnerLabel} />
          <ContentBlock block={siteContent.partnerHeading} as="h2" />
        </div>
        <ContentBlock block={siteContent.partnerIntro} />
        <div className="partner-button" style={{ position: "relative", zIndex: 1 }}>
          <Button light href="/contact">
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
