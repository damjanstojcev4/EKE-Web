import { pageMetadata } from "@/lib/seo";
import { BreadcrumbStructuredData } from "@/components/SeoStructuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PartnerSection from "@/components/home/PartnerSection";
import { Stripe } from "@/components/ui";
import ProjectsList from "@/components/projects/ProjectsList";
import EmphasizedText from "@/components/projects/EmphasizedText";
import { programs, outputs, projectAsset } from "@/components/projects/content";
import styles from "@/components/projects/projects.module.css";

export const metadata = pageMetadata("projects");

export default function ProjectsPage() {
  return (
    <div className={`${styles.page} bg-surface-muted overflow-clip`}>
      <Header />
      <BreadcrumbStructuredData page="projects" />
      <main id="main">
        <section
          className={`${styles.hero} h-[calc(1186*var(--u))] relative [padding:calc(278*var(--u))_calc(80*var(--u))_0] isolate [@media(max-width:1100px)]:h-auto [@media(max-width:1100px)]:pt-[125px] [@media(max-width:700px)]:h-auto [@media(max-width:700px)]:[padding:145px_24px_0]`}
          aria-labelledby="projects-heading"
        >
          <div className={styles.heroArtwork} aria-hidden="true">
            <img src={projectAsset("Group.svg")} alt="" />
          </div>
          <p className="text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase text-white [@media(max-width:1100px)]:text-[16px] [@media(max-width:1100px)]:leading-[24px] [@media(max-width:700px)]:text-[16px] [@media(max-width:700px)]:leading-[24px]">
            Projects
          </p>
          <h1
            className="mt-[calc(17*var(--u))]! text-brand-blue text-[length:calc(110*var(--u)_-_2px)] font-bold leading-[calc(120*var(--u))] [@media(max-width:1100px)]:text-[62px] [@media(max-width:1100px)]:leading-[1.05] [@media(max-width:700px)]:text-[46px] [@media(max-width:700px)]:leading-[1.06] [@media(max-width:700px)]:mt-[25px]!"
            id="projects-heading"
          >
            Lifelong Learning
            <br /> in Action
          </h1>
          <p
            className={[
              styles.heroCopy,
              "absolute left-[calc(594*var(--u))] top-[calc(477*var(--u))] w-[calc(1143*var(--u))] text-[length:calc(24*var(--u))] leading-[calc(32*var(--u))] text-white",
              "[@media(max-width:1100px)]:static [@media(max-width:1100px)]:w-auto [@media(max-width:1100px)]:text-[18px] [@media(max-width:1100px)]:leading-[1.5] [@media(max-width:1100px)]:mt-[25px]! [@media(max-width:1100px)]:max-w-[850px]",
              "[@media(max-width:700px)]:static [@media(max-width:700px)]:w-auto [@media(max-width:700px)]:text-[18px] [@media(max-width:700px)]:leading-[1.5] [@media(max-width:700px)]:mt-[28px]!",
            ].join(" ")}
          >
            EKE began with a simple desire to bring the life-changing
            experiences of international learning back home to Bitola. Today,
            that original spark has matured into a trusted network of educators,
            researchers, and community change-makers. We believe that learning
            is a continuous process that belongs to everyone, which is why we
            build inclusive projects where every participant is seen, heard, and
            supported.
          </p>
          <div
            className={`${styles.heroPhoto} absolute top-[calc(765*var(--u))] left-[calc(80*var(--u))] w-[calc(1760*var(--u))] [@media(max-width:1100px)]:static [@media(max-width:1100px)]:w-auto [@media(max-width:1100px)]:mt-[40px] [@media(max-width:700px)]:static [@media(max-width:700px)]:w-auto [@media(max-width:700px)]:mt-[40px]`}
          >
            <img
              className="w-full h-auto [@media(max-width:700px)]:h-[230px] [@media(max-width:700px)]:object-cover [@media(max-width:700px)]:[border-radius:16px_16px_0_0]"
              src={projectAsset("Rectangle 66.png")}
              alt="People collaborating in a bright shared workspace"
              width={1760}
              height={378}
            />
            <Stripe />
          </div>
        </section>
        <div className="[margin:0_calc(81*var(--u))] [padding:calc(138*var(--u))_calc(16*var(--u))_0] h-[calc(541*var(--u))] [border-bottom:1px_solid_#212c5d40] [@media(max-width:1100px)]:h-auto [@media(max-width:1100px)]:[padding:60px_0] [@media(max-width:700px)]:h-auto [@media(max-width:700px)]:[margin:0_24px] [@media(max-width:700px)]:[padding:50px_0]">
          <p className="text-[length:calc(40*var(--u))] leading-[calc(50*var(--u))] [text-indent:calc(140*var(--u))] [@media(max-width:1100px)]:text-[28px] [@media(max-width:1100px)]:leading-[1.4] [@media(max-width:1100px)]:[text-indent:0] [@media(max-width:700px)]:text-[24px] [@media(max-width:700px)]:leading-[1.4] [@media(max-width:700px)]:[text-indent:0]">
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
        <section aria-labelledby="programs-heading">
          <div className="h-[calc(737*var(--u))] bg-brand-blue [padding:calc(134*var(--u))_calc(80*var(--u))_0] [@media(max-width:1100px)]:h-auto [@media(max-width:1100px)]:pb-[60px] [@media(max-width:700px)]:[padding:50px_24px]">
            <p className="text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase text-white [@media(max-width:1100px)]:text-[16px] [@media(max-width:1100px)]:leading-[24px] [@media(max-width:700px)]:text-[16px] [@media(max-width:700px)]:leading-[24px]">
              Programs
            </p>
            <div className="grid [grid-template-columns:calc(1000*var(--u))_minmax(0,_1fr)] gap-[calc(77*var(--u))] mt-[calc(36*var(--u))] [@media(max-width:1100px)]:[grid-template-columns:1.2fr_1fr] [@media(max-width:1100px)]:gap-[30px] [@media(max-width:700px)]:block [@media(max-width:700px)]:mt-[25px]">
              <h2
                className="text-[length:calc(100*var(--u)_-_2px)] leading-[calc(100*var(--u))] font-bold [@media(max-width:1100px)]:text-[43px] [@media(max-width:1100px)]:leading-[1.05] [@media(max-width:700px)]:text-[38px] [@media(max-width:700px)]:[&_br]:hidden"
                id="programs-heading"
              >
                How International
                <br /> Exchange Builds
                <br /> The Foundation For
                <br /> Our Local Initiatives
              </h2>
              <div
                className={[
                  "pt-[calc(8*var(--u))] text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))] [&_p_+_p]:mt-[calc(34*var(--u))]!",
                  "[@media(min-width:1101px)]:pt-[calc(11*var(--u))] [@media(min-width:1101px)]:[&_p_+_p]:mt-[calc(32*var(--u))]!",
                  "[@media(max-width:1100px)]:text-[16px] [@media(max-width:1100px)]:leading-[1.5]",
                  "[@media(max-width:700px)]:pt-[30px] [@media(max-width:700px)]:text-[18px] [@media(max-width:700px)]:[&_p_+_p]:mt-[24px]!",
                ].join(" ")}
              >
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
          <div
            className={`${styles.programStripe} [margin:calc(17*var(--u))_calc(81*var(--u))_0] [@media(max-width:700px)]:[margin:12px_24px_0]`}
          >
            <Stripe />
          </div>
          <div className="mt-[calc(185*var(--u))] [@media(max-width:700px)]:mt-[50px]">
            {programs.map((program) => (
              <article
                className={[
                  styles.program,
                  "grid [grid-template-columns:calc(614*var(--u))_minmax(0,_1fr)] gap-[calc(48*var(--u))] pr-[calc(73*var(--u))]",
                  "[@media(width>1100px)]:min-h-[calc(435*var(--u))] [@media(width>1100px)]:[&:nth-child(2)]:min-h-[calc(458*var(--u))] [@media(width>1100px)]:[&:nth-child(3)]:min-h-[calc(406*var(--u))] [@media(width>1100px)]:[&:nth-child(4)]:min-h-[calc(429*var(--u))] [@media(width>1100px)]:[&:nth-child(5)]:min-h-[calc(509*var(--u))]",
                  "[@media(max-width:1100px)]:min-h-[0] [@media(max-width:1100px)]:pb-[65px] [@media(max-width:1100px)]:[grid-template-columns:30%_1fr]",
                  "[@media(max-width:700px)]:block [@media(max-width:700px)]:[padding:0_24px_45px]",
                ].join(" ")}
                key={program.title}
              >
                <div className="h-[calc(169*var(--u))] bg-surface flex items-center justify-end pr-[calc(40*var(--u))] [@media(max-width:700px)]:h-[125px] [@media(max-width:700px)]:[padding:20px] [@media(max-width:700px)]:justify-center [@media(max-width:700px)]:mb-[25px]">
                  <img
                    className="object-contain"
                    src={projectAsset(program.image)}
                    alt={`${program.title.replaceAll("\n", " ")} logo`}
                    width={program.width}
                    height={program.height}
                  />
                </div>
                <div
                  className={`${styles.programText} [&::after]:[content:''] [&::after]:block [&::after]:[border-bottom:1px_solid_#212c5d40] [&::after]:mt-[calc(42*var(--u))] [@media(max-width:700px)]:[&::after]:mt-[30px]`}
                >
                  <h3 className="text-[length:calc(44*var(--u)_-_2px)] leading-[calc(52*var(--u))] font-bold whitespace-pre-line [margin:calc(-6*var(--u))_0_calc(28*var(--u))]! [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.2] [@media(max-width:700px)]:text-[26px] [@media(max-width:700px)]:[margin:0_0_20px]! [@media(max-width:700px)]:whitespace-normal">
                    {program.title}
                  </h3>
                  <p className="text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))] pr-[calc(110*var(--u))] [@media(max-width:1100px)]:text-[16px] [@media(max-width:1100px)]:leading-[1.5] [@media(max-width:1100px)]:pr-[0] [@media(max-width:700px)]:text-[17px] [@media(max-width:700px)]:leading-[1.5]">
                    {program.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div
            className="h-[calc(23*var(--u))] bg-brand-blue [margin:0_calc(80*var(--u))_calc(15*var(--u))] [@media(max-width:700px)]:[margin:0_24px_12px] [@media(max-width:700px)]:h-[10px]"
            aria-hidden="true"
          />
        </section>
        <section aria-labelledby="outputs-heading">
          <div className="h-[calc(718*var(--u))] bg-brand-blue relative [padding:calc(127*var(--u))_calc(81*var(--u))_0] overflow-hidden [@media(max-width:700px)]:h-auto [@media(max-width:700px)]:[padding:50px_24px_30px]">
            <p className="text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase text-white [@media(max-width:1100px)]:text-[16px] [@media(max-width:1100px)]:leading-[24px] [@media(max-width:700px)]:text-[16px] [@media(max-width:700px)]:leading-[24px]">
              Project Outputs
            </p>
            <h2
              className="text-[length:calc(100*var(--u)_-_2px)] leading-[calc(100*var(--u))] font-bold mt-[calc(38*var(--u))]! [@media(max-width:700px)]:text-[41px] [@media(max-width:700px)]:leading-[1.05] [@media(max-width:700px)]:mt-[25px]! [@media(max-width:700px)]:[&_br]:hidden"
              id="outputs-heading"
            >
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
          <div className="relative isolate h-[calc(2504*var(--u))] [padding:calc(115*var(--u))_calc(81*var(--u))_0] [@media(max-width:1100px)]:h-auto [@media(max-width:1100px)]:pb-[80px] [@media(max-width:700px)]:[padding:50px_24px_25px]">
            <div className={styles.outputArtwork} aria-hidden="true">
              <img src={projectAsset("Group (1).svg")} alt="" />
              <img src={projectAsset("Group (2).svg")} alt="" />
            </div>
            <p className="text-[length:calc(40*var(--u))] leading-[calc(50*var(--u))] [text-indent:calc(130*var(--u))] [padding:0_calc(4*var(--u))_calc(46*var(--u))] [border-bottom:1px_solid_#212c5d60] [@media(max-width:700px)]:text-[24px] [@media(max-width:700px)]:leading-[1.4] [@media(max-width:700px)]:[text-indent:0] [@media(max-width:700px)]:[padding:0_0_30px]">
              Our initiatives produce practical resources that continue to
              support learning long after the project calendar wraps up. These
              outputs help{" "}
              <strong>
                educators, youth workers, organizations, and community members
              </strong>{" "}
              apply what they have learned in their own settings.
            </p>
            <div
              className={`${styles.outputRows} mt-[calc(137*var(--u))] [@media(max-width:700px)]:mt-[40px]`}
            >
              {outputs.map((output) => (
                <article
                  className={[
                    "ml-[calc(120*var(--u))] w-[calc(840*var(--u))] min-h-[calc(324*var(--u))] [&:nth-child(even)]:ml-[calc(781*var(--u))] [&:nth-child(even)]:w-[calc(865*var(--u))] [&:nth-child(2)]:min-h-[calc(354*var(--u))] [&:nth-child(3)]:min-h-[calc(304*var(--u))] [&:nth-child(4)]:min-h-[calc(326*var(--u))] [&:nth-child(5)]:min-h-[calc(312*var(--u))] [&:nth-child(-n_+_2)_p]:mt-[calc(28*var(--u))]!",
                    "[@media(min-width:1101px)]:[&:nth-child(1)]:min-h-[calc(313*var(--u))] [@media(min-width:1101px)]:[&:nth-child(2)]:min-h-[calc(360*var(--u))] [@media(min-width:1101px)]:[&:nth-child(4)]:min-h-[calc(327*var(--u))] [@media(min-width:1101px)]:[&:nth-child(5)]:min-h-[calc(315*var(--u))]",
                    "[@media(max-width:1100px)]:w-[75%] [@media(max-width:1100px)]:min-h-[0] [@media(max-width:1100px)]:[margin:0_0_40px] [@media(max-width:1100px)]:[&:nth-child(even)]:w-[75%] [@media(max-width:1100px)]:[&:nth-child(even)]:min-h-[0] [@media(max-width:1100px)]:[&:nth-child(even)]:[margin:0_0_40px] [@media(max-width:1100px)]:[&:nth-child(even)]:ml-[25%]",
                    "[@media(max-width:700px)]:w-auto [@media(max-width:700px)]:[margin:0_0_40px] [@media(max-width:700px)]:[&:nth-child(even)]:w-auto [@media(max-width:700px)]:[&:nth-child(even)]:[margin:0_0_40px] [@media(max-width:700px)]:[&:nth-child(n)_p]:mt-[18px]! [@media(max-width:700px)]:[&:nth-child(n)_p]:text-[18px]",
                  ].join(" ")}
                  key={output.title}
                >
                  <h3
                    className={[
                      "text-[length:calc(34*var(--u)_-_2px)] leading-[calc(42*var(--u))] font-medium text-brand-blue whitespace-nowrap [&::before]:[content:''] [&::before]:inline-block [&::before]:w-[calc(143*var(--u))] [&::before]:h-[calc(8*var(--u))] [&::before]:bg-brand-blue [&::before]:mr-[calc(15*var(--u))] [&::before]:[vertical-align:middle]",
                      "[@media(max-width:1100px)]:text-[22px] [@media(max-width:1100px)]:leading-[1.3] [@media(max-width:1100px)]:whitespace-normal",
                      "[@media(max-width:700px)]:text-[24px] [@media(max-width:700px)]:leading-[1.2] [@media(max-width:700px)]:[&::before]:w-[35px] [@media(max-width:700px)]:[&::before]:h-[4px] [@media(max-width:700px)]:[&::before]:mr-[10px]",
                    ].join(" ")}
                  >
                    {output.title}
                  </h3>
                  <p className="text-[length:calc(24*var(--u))] leading-[calc(32*var(--u))] [@media(max-width:1100px)]:text-[17px] [@media(max-width:1100px)]:leading-[1.5] [@media(max-width:1100px)]:mt-[15px]!">
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
