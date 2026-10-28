import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PartnerSection from "@/components/home/PartnerSection";
import { Stripe } from "@/components/ui";
import ProjectsList from "@/components/projects/ProjectsList";
import EmphasizedText from "@/components/projects/EmphasizedText";
import { programs, outputs, projectAsset } from "@/components/projects/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects — EKE Bitola",
  description:
    "Explore EKE’s projects, international learning programs, and practical community resources.",
};

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main id="main">
        <section className={styles.hero} aria-labelledby="projects-heading">
          <div className={styles.heroArtwork} aria-hidden="true">
            <img src={projectAsset("Group.svg")} alt="" />
          </div>
          <p className={styles.label}>Projects</p>
          <h1 id="projects-heading">
            Lifelong Learning
            <br /> in Action
          </h1>
          <p className={styles.heroCopy}>
            EKE began with a simple desire to bring the life-changing
            experiences of international learning back home to Bitola. Today,
            that original spark has matured into a trusted network of educators,
            researchers, and community change-makers. We believe that learning
            is a continuous process that belongs to everyone, which is why we
            build inclusive projects where every participant is seen, heard, and
            supported.
          </p>
          <div className={styles.heroPhoto}>
            <img
              src={projectAsset("Rectangle 66.png")}
              alt="People collaborating in a bright shared workspace"
              width={1760}
              height={378}
            />
            <Stripe />
          </div>
        </section>
        <div className={styles.introduction}>
          <p>
            The value of our work lies in the practical footprints we leave
            behind in our communities. Through{" "}
            <strong>
              creative workshops, street sports, and international mobility
            </strong>
            , we provide local leaders with the resources they need to run
            purposeful activities independently. Exploring our project history
            and specialized outputs shows exactly how these sustainable, local
            roots help us build a more resilient society.
          </p>
        </div>
        <ProjectsList />
        <section className={styles.programs} aria-labelledby="programs-heading">
          <div className={styles.programBanner}>
            <p className={styles.label}>Programs</p>
            <div className={styles.programIntro}>
              <h2 id="programs-heading">
                How International
                <br /> Exchange Builds
                <br /> The Foundation For
                <br /> Our Local Initiatives
              </h2>
              <div>
                <p>
                  Founded in Bitola by alumni of the Erasmus+ program, EKE grew
                  out of a desire to share the horizon-expanding experiences we
                  gained abroad with our own community. Since 2012, our team has
                  grown that early vision into a reliable network of European
                  partnerships, welcoming community spaces, and hands-on
                  international learning programs.
                </p>
                <p>
                  We design projects that meet people exactly where they are.
                  Rather than keeping European ideals confined to policy papers,
                  we bring them to life in workshops, creative training, and
                  community initiatives. Each program listed below represents a
                  distinct chapter of that ongoing effort.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.programStripe}>
            <Stripe />
          </div>
          <div className={styles.programRows}>
            {programs.map((program) => (
              <article className={styles.program} key={program.title}>
                <div className={styles.programLogo}>
                  <img
                    src={projectAsset(program.image)}
                    alt={`${program.title.replaceAll("\n", " ")} logo`}
                    width={program.width}
                    height={program.height}
                  />
                </div>
                <div className={styles.programText}>
                  <h3>{program.title}</h3>
                  <p>{program.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.programEnd} aria-hidden="true" />
        </section>
        <section className={styles.outputs} aria-labelledby="outputs-heading">
          <div className={styles.outputBanner}>
            <p className={styles.label}>Project Outputs</p>
            <h2 id="outputs-heading">
              The Practical Results
              <br /> And Community
              <br /> Footprints Of
              <br /> Our Work
            </h2>
            <div className={styles.outputArt} aria-hidden="true">
              <img
                src={projectAsset("Group 648.png")}
                alt=""
                width={711}
                height={378}
              />
              <img
                src={projectAsset("Group 674.png")}
                alt=""
                width={335}
                height={335}
              />
            </div>
          </div>
          <div className={styles.outputBody}>
            <div className={styles.outputArtwork} aria-hidden="true">
              <img src={projectAsset("Group (1).svg")} alt="" />
              <img src={projectAsset("Group (2).svg")} alt="" />
            </div>
            <p className={styles.outputIntro}>
              Our initiatives produce practical resources that continue to
              support learning long after the project calendar wraps up. These
              outputs help{" "}
              <strong>
                educators, youth workers, organizations, and community members
              </strong>{" "}
              apply what they have learned in their own settings.
            </p>
            <div className={styles.outputRows}>
              {outputs.map((output) => (
                <article key={output.title}>
                  <h3>{output.title}</h3>
                  <p>
                    <EmphasizedText
                      text={output.text}
                      phrases={output.emphasis}
                    />
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <PartnerSection />
      </main>
      <Footer />
    </div>
  );
}
