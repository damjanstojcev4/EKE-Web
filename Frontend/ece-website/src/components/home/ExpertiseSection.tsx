import Image from "next/image";
import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import { Button } from "../ui";
const areas = [
  [
    "youthHeading",
    "youthBody",
    "sport-PE.webp",
    "Sport and physical activity in community settings",
  ],
  [
    "digitalHeading",
    "digitalBody",
    "youth-education.webp",
    "Youth education and workshops",
  ],
  [
    "womenHeading",
    "womenBody",
    "vocation-training.webp",
    "Vocational education and training",
  ],
  [
    "prisonHeading",
    "prisonBody",
    "adult-education.webp",
    "Adult education and lifelong learning",
  ],
] as const;
export default function ExpertiseSection() {
  return (
    <section className="expertise" id="expertise">
      <div className="expertise-intro">
        <ContentBlock block={siteContent.expertiseLabel} />
        <ContentBlock block={siteContent.expertiseHeading} as="h2" />
        <ContentBlock block={siteContent.expertiseIntro} />
      </div>
      <div className="expertise-grid">
        {areas.map(([title, body, img, alt]) => (
          <article className="expertise-card" key={title}>
            <div className="expertise-image">
              <Image
                src={"/assets/" + img}
                alt={alt}
                fill
                sizes="(max-width:640px) 100vw,(max-width:1100px) 50vw,25vw"
              />
            </div>
            <div className="expertise-copy">
              <ContentBlock block={siteContent[title]} as="h3" />
              <ContentBlock block={siteContent[body]} />
            </div>
          </article>
        ))}
      </div>
      <div className="actions expertise-actions">
        <Button light outline href={"/projects"}>
          See related projects
        </Button>
        <Button light href="/training">
          Discover training opportunities
        </Button>
      </div>
    </section>
  );
}
