import Image from "next/image";
import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import { Button } from "../ui";
export default function TeamSection() {
  return (
    <section className="team" id="team">
      <ContentBlock block={siteContent.teamLabel} />
      <div className="team-title">
        <div className="team-highlights" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <ContentBlock block={siteContent.teamHeading} as="h2" />
      </div>
      <div className="team-photo">
        <Image
          src="/assets/inside-eke-team.webp"
          alt="The EKE team gathered around a table"
          fill
          sizes="100vw"
        />
      </div>
      <div className="team-bottom">
        <ContentBlock block={siteContent.teamIntro} />
        <Button href="/about#team">Meet the team</Button>
      </div>
    </section>
  );
}
