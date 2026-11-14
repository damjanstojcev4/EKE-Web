import copy from "@/data/copy.json";
import FigmaText from "../FigmaText";
import { Arrow, Divider } from "../ui";
const items = [
  ["600+ Learners", "2180:401", "vector8.svg", "line6.svg"],
  ["25+ Projects", "2180:402", "vector8.svg", "line7.svg"],
  ["14+ Years", "2180:403", "vector8.svg", "line7.svg"],
  ["ESC Accreditation", "2180:404", "vector7.svg", "line9.svg"],
  ["Erasmus+ Cooperation", "2180:405", "vector7.svg", "line10.svg"],
  ["Prison Education Expertise", "2180:406", "vector6.svg", null],
] as const;
export default function ImpactSection() {
  return (
    <section className="impact">
      <img
        className="impact-decoration"
        src="/assets/impact-figure.svg"
        alt=""
      />
      <FigmaText id="2180:346" as="h2" />
      <div className="impact-rows">
        {items.map(([title, id, arrow, line]) => (
          <div className="impact-row" key={id}>
            <h3>
              <Arrow kind="impact" file={arrow} />
              {title}
            </h3>
            <p data-figma-id={id}>{copy[id]}</p>
            {line && <Divider file={line} />}
          </div>
        ))}
      </div>
    </section>
  );
}
