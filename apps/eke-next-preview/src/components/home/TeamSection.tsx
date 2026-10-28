import Image from "next/image";
import FigmaText from "../FigmaText";
import { Button } from "../ui";
export default function TeamSection() {
  return (
    <section className="team" id="team">
      <FigmaText id="2180:336" />
      <div className="team-title">
        <div className="team-highlights" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <FigmaText id="2180:343" as="h2" />
      </div>
      <div className="team-photo">
        <Image
          src="/assets/inside-eke-team.png"
          alt="The EKE team gathered around a table"
          fill
          sizes="100vw"
        />
      </div>
      <div className="team-bottom">
        <FigmaText id="2180:304" />
        <Button href="/about#team">Meet the team</Button>
      </div>
    </section>
  );
}
