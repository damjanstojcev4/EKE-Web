import { serviceCopy } from "@/content/service-copy";
import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import { Arrow, Divider } from "../ui";
const items = [
  ["600+ Learners", "learners", "vector8.svg", "line6.svg"],
  ["25+ Projects", "projects", "vector8.svg", "line7.svg"],
  ["14+ Years", "experience", "vector8.svg", "line7.svg"],
  ["ESC Accreditation", "accreditation", "vector7.svg", "line9.svg"],
  ["Erasmus+ Cooperation", "cooperation", "vector7.svg", "line10.svg"],
  ["Prison Education Expertise", "prisonEducation", "vector6.svg", null],
] as const;
export default function ImpactSection() {
  return (
    <section className="impact">
      <img
        className="impact-decoration"
        src="/assets/impact-figure.svg"
        alt=""
      />
      <ContentBlock block={siteContent.impactHeading} as="h2" />
      <div className="impact-rows">
        {items.map(([title, id, arrow, line]) => (
          <div className="impact-row" key={id}>
            <h3>
              <Arrow kind="impact" file={arrow} />
              {title}
            </h3>
            <p>{serviceCopy[id]}</p>
            {line && <Divider file={line} />}
          </div>
        ))}
      </div>
    </section>
  );
}
