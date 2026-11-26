import Image from "next/image";
import FigmaText from "../FigmaText";
import { Button } from "../ui";
import { existing } from "@/data/navigation";
const areas = [
  [
    "2180:373",
    "2180:353",
    "expertise-youth-development.png",
    "Young people together outdoors",
  ],
  [
    "2180:377",
    "2180:360",
    "expertise-digital-literacy.png",
    "Learning with digital technology",
  ],
  [
    "2180:378",
    "2180:361",
    "expertise-women-community.png",
    "Women supporting one another",
  ],
  [
    "2180:379",
    "2180:362",
    "expertise-prison-education.png",
    "A conversation about social reintegration",
  ],
] as const;
export default function ExpertiseSection() {
  return (
    <section className="expertise" id="expertise">
      <div className="expertise-intro">
        <FigmaText id="2180:333" />
        <FigmaText id="2180:341" as="h2" />
        <FigmaText id="2180:410" />
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
              <FigmaText id={title} as="h3" />
              <FigmaText id={body} />
            </div>
          </article>
        ))}
      </div>
      <div className="actions expertise-actions">
        <Button light outline href={"/projects"}>
          See related projects
        </Button>
        <Button light href={existing("/contact")}>
          Discover training opportunities
        </Button>
      </div>
    </section>
  );
}
