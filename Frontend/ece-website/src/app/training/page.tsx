import { pageMetadata } from "@/lib/seo";
import { BreadcrumbStructuredData } from "@/components/SeoStructuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button, Stripe } from "@/components/ui";
import SessionListings from "@/components/SessionListings";
import { trainingThemes } from "@/data/training.mock";
import styles from "@/components/training/training.module.css";

export const metadata = pageMetadata("training");
const asset = (file: string) =>
  `/assets/training-page/${encodeURIComponent(file)}`;

function ThemeBanner({
  illustration = "Group 96.png",
}: {
  illustration?: string;
}) {
  return (
    <div
      className={[
        "flex items-center w-[calc(628*var(--u))] h-[calc(194*var(--u))]",
        "[@media(max-width:1100px)]:w-[100%] [@media(max-width:1100px)]:h-[auto]",
      ].join(" ")}
      aria-hidden="true"
    >
      <img
        className={[
          "w-[calc(413*var(--u))] h-[calc(194*var(--u))] shrink-0",
          "[@media(max-width:1100px)]:w-[65.76%] [@media(max-width:1100px)]:h-[auto]",
        ].join(" ")}
        src={asset(illustration)}
        alt=""
        width={413}
        height={194}
      />
      <img
        className={[
          "w-[calc(215*var(--u))] h-[calc(149*var(--u))] object-cover rounded-[0_calc(24*var(--u))_calc(24*var(--u))_0]",
          "[@media(max-width:1100px)]:w-[34.24%] [@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:aspect-[215/149] [@media(max-width:1100px)]:rounded-[0_18px_18px_0]",
        ].join(" ")}
        src={asset("Rectangle 156.png")}
        alt=""
        width={237}
        height={149}
      />
    </div>
  );
}

export default function TrainingPage() {
  return (
    <div className={`${styles.page} bg-surface-muted overflow-clip`}>
      <Header />
      <BreadcrumbStructuredData page="training" />
      <main id="main">
        <section
          className={[
            "relative isolate h-[calc(1186*var(--u))] [padding:calc(278*var(--u))_calc(80*var(--u))_0] text-white [background:linear-gradient(_var(--dark-blue)_0_calc(865*var(--u)),_transparent_calc(865*var(--u))_)]",
            "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:[padding:145px_40px_0] [@media(max-width:1100px)]:[background:linear-gradient(var(--dark-blue)_0_85%,_transparent_85%)]",
            "[@media(max-width:700px)]:[padding:145px_24px_0]",
          ].join(" ")}
          aria-labelledby="training-title"
        >
          <div
            className={[
              "absolute [inset:0_0_auto] h-[calc(865*var(--u))] overflow-hidden z-[-1]",
              "[@media(max-width:1100px)]:h-[85%]",
            ].join(" ")}
            aria-hidden="true"
          >
            <img
              className={[
                "w-[calc(1204*var(--u))] h-[calc(863*var(--u))] ml-[calc(142*var(--u))]!",
                "[@media(max-width:1100px)]:w-[900px] [@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:ml-[0]!",
                "[@media(max-width:700px)]:ml-[-180px]!",
              ].join(" ")}
              src={asset("Group.svg")}
              alt=""
            />
          </div>
          <p
            className={[
              "text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase",
              "[@media(max-width:1100px)]:text-[length:17px] [@media(max-width:1100px)]:leading-[24px]",
            ].join(" ")}
          >Training</p>
          <h1
            className={[
              "mt-[calc(18*var(--u))]! text-[length:calc(110*var(--u)_-_2px)] leading-[calc(120*var(--u))] font-bold text-brand-blue",
              "[@media(max-width:1100px)]:text-[length:62px] [@media(max-width:1100px)]:leading-[1.08] [@media(max-width:1100px)]:mt-[20px]!",
              "[@media(max-width:700px)]:text-[length:44px]",
            ].join(" ")}
            id="training-title"
          >
            Building Skills for Lasting <br className={"[@media(max-width:700px)]:hidden"} />
            Social Impact
          </h1>
          <p
            className={[
              "absolute top-[calc(500*var(--u))] left-[calc(870*var(--u))] w-[calc(900*var(--u))] text-[length:calc(24*var(--u))] leading-[calc(32*var(--u))]",
              "[@media(max-width:1100px)]:static [@media(max-width:1100px)]:w-[auto] [@media(max-width:1100px)]:text-[length:18px] [@media(max-width:1100px)]:leading-[1.5] [@media(max-width:1100px)]:mt-[30px]!",
            ].join(" ")}
          >
            We believe local expertise lies at the heart of enduring systemic
            progress. To support it, EKE brings high-quality, flexible learning
            straight to the communities that need it most. We back every
            training module with a decade of field experience, giving citizens
            and institutional networks the immediate skills to disrupt
            stagnation and cultivate deep-seated social renewal.
          </p>
          <div
            className={`${styles.heroImage} ${[
              "absolute top-[calc(765*var(--u))] left-[calc(80*var(--u))] w-[calc(1760*var(--u))]",
              "[@media(max-width:1100px)]:static [@media(max-width:1100px)]:w-[100%] [@media(max-width:1100px)]:mt-[40px]!",
              "",
            ].join(" ")}`}
          >
            <img
              className={[
                "w-[100%] h-[calc(378*var(--u))] object-cover rounded-[calc(24*var(--u))_calc(24*var(--u))_0_0]",
                "[@media(max-width:1100px)]:h-[230px] [@media(max-width:1100px)]:rounded-[20px_20px_0_0]",
                "[@media(max-width:700px)]:h-[180px]",
              ].join(" ")}
              src={asset("Rectangle 66.png")}
              alt="A network connecting people across communities"
              width={1760}
              height={378}
            />
            <Stripe />
          </div>
        </section>
        <div
          className={[
            "h-[calc(566*var(--u))] [padding:calc(174*var(--u))_calc(80*var(--u))_0] text-[length:calc(40*var(--u))] leading-[calc(50*var(--u))]",
            "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:[padding:65px_40px] [@media(max-width:1100px)]:text-[length:28px] [@media(max-width:1100px)]:leading-[1.4]",
            "[@media(max-width:700px)]:[padding:50px_24px] [@media(max-width:700px)]:text-[length:24px]",
          ].join(" ")}
        >
          <p
            className={[
              "indent-[calc(140*var(--u))] max-w-[calc(1645*var(--u))]",
              "[@media(max-width:1100px)]:indent-[0] [@media(max-width:1100px)]:max-w-[none]",
            ].join(" ")}
          >
            Because learning by doing works best in an environment centered on
            trust, EKE’s training programs are deliberately built around{" "}
            <strong>
              non-formal education, dialogue, participation, and practical
              exploration.
            </strong>{" "}
            This creates a welcoming space where diverse groups can exchange
            collective wisdom and tackle shared challenges as a team.
          </p>
        </div>
        <section
          className={[
            "h-[calc(1150*var(--u))] [background:#f1f1f1] [padding:calc(64*var(--u))_calc(80*var(--u))] grid gap-[calc(60*var(--u))]",
            "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:[padding:40px] [@media(max-width:1100px)]:gap-[30px]",
            "[@media(max-width:700px)]:[padding:30px_24px] [@media(max-width:700px)]:gap-[35px]",
          ].join(" ")}
          aria-label="Our training approach"
        >
          <article
            className={[
              "grid grid-cols-[calc(710*var(--u))_1fr] gap-[calc(30*var(--u))]",
              "[@media(max-width:1100px)]:grid-cols-[1fr_1.15fr] [@media(max-width:1100px)]:gap-[24px]",
              "[@media(max-width:700px)]:grid-cols-[1fr] [@media(max-width:700px)]:gap-[0]",
            ].join(" ")}
          >
            <div
              className={[
                "relative h-[calc(480*var(--u))] [padding:calc(24*var(--u))] [border:1px_solid_#bfc4d2] rounded-[calc(26*var(--u))]",
                "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:[padding:16px] [@media(max-width:1100px)]:rounded-[20px]",
                "[@media(max-width:700px)]:rounded-[20px_20px_0_0]",
              ].join(" ")}
            >
              <img
                className={[
                  "w-[100%] h-[calc(248*var(--u))] object-cover rounded-[calc(16*var(--u))_calc(16*var(--u))_0_0]",
                  "[@media(max-width:1100px)]:h-[180px] [@media(max-width:1100px)]:rounded-[12px_12px_0_0]",
                ].join(" ")}
                src={asset("Rectangle 190.png")}
                alt="Research and project planning at a desk"
                width={655}
                height={248}
              />
              <p
                className={[
                  "relative [margin:calc(-36*var(--u))_0_0_calc(-24*var(--u))]! w-[calc(460*var(--u))] [padding:calc(22*var(--u))_calc(50*var(--u))] [background:linear-gradient(#d0d6d6ee,_#f1f1f1ee)] text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase",
                  "[@media(max-width:1100px)]:[margin:-30px_0_0_-16px]! [@media(max-width:1100px)]:w-[fit-content] [@media(max-width:1100px)]:max-w-[100%] [@media(max-width:1100px)]:text-[length:15px] [@media(max-width:1100px)]:leading-[22px] [@media(max-width:1100px)]:[padding:16px_25px]",
                ].join(" ")}
              >Approach</p>
              <h2
                className={[
                  "[margin:calc(34*var(--u))_calc(24*var(--u))_0]! text-[length:calc(40*var(--u)_-_2px)] leading-[calc(46*var(--u))] font-bold",
                  "[@media(max-width:1100px)]:[margin:20px_8px]! [@media(max-width:1100px)]:text-[length:23px] [@media(max-width:1100px)]:leading-[1.2]",
                ].join(" ")}
              >
                Connecting Trusted Research <br className={"[@media(max-width:1100px)]:hidden"} />
                With Participatory Learning
              </h2>
            </div>
            <div
              className={[
                "[border-width:1px_1px_1px_0] border-solid border-[#bfc4d2] [border-left-style:none] [border-left-color:currentColor] rounded-[0_calc(26*var(--u))_calc(26*var(--u))_0] [padding:calc(84*var(--u))_calc(84*var(--u))]",
                "[@media(max-width:1100px)]:[padding:30px] [@media(max-width:1100px)]:rounded-[0_20px_20px_0]",
                "[@media(max-width:700px)]:[padding:30px_20px] [@media(max-width:700px)]:[border-left:1px_solid_#bfc4d2] [@media(max-width:700px)]:[border-top:0] [@media(max-width:700px)]:rounded-[0_0_20px_20px]",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[length:calc(34*var(--u))] leading-[calc(42*var(--u))]",
                  "[@media(max-width:1100px)]:text-[length:23px] [@media(max-width:1100px)]:leading-[1.3]",
                ].join(" ")}
              >
                Our work brings together educational research, specialist
                knowledge and experience gained through years of project
                implementation.
              </p>
              <p
                className={[
                  "mt-[calc(50*var(--u))]! text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))]",
                  "[@media(max-width:1100px)]:mt-[26px]! [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:1100px)]:leading-[1.6]",
                ].join(" ")}
              >
                By replacing rigid instruction with horizontal, dialogue-based
                pedagogy, we connect our network’s academic research directly to
                the lived realities of our participants. This combination helps
                us develop learning programs that respond to the people taking
                part and the challenges they face.
              </p>
            </div>
          </article>
          <article
            className={[
              "grid grid-cols-[calc(710*var(--u))_1fr] gap-[calc(30*var(--u))]",
              "[@media(max-width:1100px)]:grid-cols-[1fr_1.15fr] [@media(max-width:1100px)]:gap-[24px]",
              "[@media(max-width:700px)]:grid-cols-[1fr] [@media(max-width:700px)]:gap-[0]",
            ].join(" ")}
          >
            <div
              className={[
                "relative h-[calc(480*var(--u))] [padding:calc(24*var(--u))] [border:1px_solid_#bfc4d2] rounded-[calc(26*var(--u))]",
                "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:[padding:16px] [@media(max-width:1100px)]:rounded-[20px]",
                "[@media(max-width:700px)]:rounded-[20px_20px_0_0]",
              ].join(" ")}
            >
              <img
                className={[
                  "w-[100%] h-[calc(248*var(--u))] object-cover rounded-[calc(16*var(--u))_calc(16*var(--u))_0_0]",
                  "[@media(max-width:1100px)]:h-[180px] [@media(max-width:1100px)]:rounded-[12px_12px_0_0]",
                ].join(" ")}
                src={asset("Rectangle 190.png")}
                alt="Research and project planning at a desk (placeholder)"
                width={655}
                height={248}
              />
              <p
                className={[
                  "relative [margin:calc(-36*var(--u))_0_0_calc(-24*var(--u))]! w-[calc(460*var(--u))] [padding:calc(22*var(--u))_calc(50*var(--u))] [background:linear-gradient(#d0d6d6ee,_#f1f1f1ee)] text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase",
                  "[@media(max-width:1100px)]:[margin:-30px_0_0_-16px]! [@media(max-width:1100px)]:w-[fit-content] [@media(max-width:1100px)]:max-w-[100%] [@media(max-width:1100px)]:text-[length:15px] [@media(max-width:1100px)]:leading-[22px] [@media(max-width:1100px)]:[padding:16px_25px]",
                ].join(" ")}
              >Non-Formal Education</p>
              <h2
                className={[
                  "[margin:calc(34*var(--u))_calc(24*var(--u))_0]! text-[length:calc(40*var(--u)_-_2px)] leading-[calc(46*var(--u))] font-bold",
                  "[@media(max-width:1100px)]:[margin:20px_8px]! [@media(max-width:1100px)]:text-[length:23px] [@media(max-width:1100px)]:leading-[1.2]",
                ].join(" ")}
              >
                Integrating Active Methods Into <br className={"[@media(max-width:1100px)]:hidden"} />
                Everyday Educational Practice
              </h2>
            </div>
            <div
              className={[
                "[border-width:1px_1px_1px_0] border-solid border-[#bfc4d2] [border-left-style:none] [border-left-color:currentColor] rounded-[0_calc(26*var(--u))_calc(26*var(--u))_0] [padding:calc(84*var(--u))_calc(84*var(--u))]",
                "[@media(max-width:1100px)]:[padding:30px] [@media(max-width:1100px)]:rounded-[0_20px_20px_0]",
                "[@media(max-width:700px)]:[padding:30px_20px] [@media(max-width:700px)]:[border-left:1px_solid_#bfc4d2] [@media(max-width:700px)]:[border-top:0] [@media(max-width:700px)]:rounded-[0_0_20px_20px]",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[length:calc(34*var(--u))] leading-[calc(42*var(--u))]",
                  "[@media(max-width:1100px)]:text-[length:23px] [@media(max-width:1100px)]:leading-[1.3]",
                ].join(" ")}
              >
                Non-formal education is the foundation of EKE’s training work.
                Our methods include group work, peer learning, reflection,
                experiential activities and facilitated dialogue.
              </p>
              <p
                className={[
                  "mt-[calc(50*var(--u))]! text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))]",
                  "[@media(max-width:1100px)]:mt-[26px]! [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:1100px)]:leading-[1.6]",
                ].join(" ")}
              >
                We help educators and youth workers apply these approaches in
                their own programs, fostering learning environments that are
                active, inclusive and responsive to the people taking part.
              </p>
            </div>
          </article>
        </section>
        <section
          className={[
            "[padding:0_calc(80*var(--u))]",
            "[@media(max-width:1100px)]:[padding:0_40px]",
            "[@media(max-width:700px)]:[padding:0_24px]",
          ].join(" ")}
          aria-label="Training areas"
        >
          {[0, 2, 4].map((start) => (
            <div
              className={[
                "relative grid grid-cols-[1fr_1fr] gap-[calc(100*var(--u))]",
                start === 0
                  ? "min-h-[calc(1014*var(--u))] [padding:calc(160*var(--u))_calc(70*var(--u))_calc(80*var(--u))]"
                  : start === 2
                    ? "min-h-[calc(934*var(--u))] [padding:calc(80*var(--u))_calc(70*var(--u))_calc(80*var(--u))]"
                    : "min-h-[calc(1134*var(--u))] [padding:calc(100*var(--u))_calc(70*var(--u))_calc(80*var(--u))_calc(115*var(--u))]",
                "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[calc(48*var(--u))] after:[border-top:1px_solid_var(--tirkiz)] after:[border-left:1px_solid_var(--tirkiz)] after:rounded-tl-[calc(24*var(--u))] after:pointer-events-none",
                "[@media(max-width:1100px)]:min-h-0 [@media(max-width:1100px)]:[padding:65px_0] [@media(max-width:1100px)]:gap-[40px] [@media(max-width:1100px)]:after:h-[20px] [@media(max-width:1100px)]:after:rounded-tl-[15px]",
                "[@media(max-width:700px)]:grid-cols-[1fr] [@media(max-width:700px)]:gap-[55px] [@media(max-width:700px)]:[padding:50px_0]",
              ].join(" ")}
              key={start}
            >
              {trainingThemes.slice(start, start + 2).map((theme) => (
                <article key={theme.id}>
                  <ThemeBanner illustration={theme.illustration} />
                  <div
                    className={[
                      "[margin:calc(70*var(--u))_0_0_calc(85*var(--u))]!",
                      start === 4
                        ? "w-[calc(550*var(--u))]"
                        : "w-[calc(640*var(--u))]",
                      trainingThemes.indexOf(theme) % 2 === 1
                        ? start === 4
                          ? "[@media(min-width:1101px)]:ml-[calc(100*var(--u))]!"
                          : "[@media(min-width:1101px)]:ml-[calc(55*var(--u))]!"
                        : "",
                      "[@media(max-width:1100px)]:w-auto [@media(max-width:1100px)]:[margin:35px_10px_0]!",
                      "[@media(max-width:700px)]:[margin:25px_12px_0]!",
                    ].join(" ")}
                  >
                    <p
                      className={[
                        "text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase",
                        "[@media(max-width:1100px)]:text-[length:17px] [@media(max-width:1100px)]:leading-[24px]",
                      ].join(" ")}
                    >{theme.label}</p>
                    <h2
                      className={[
                        "text-[length:calc(44*var(--u)_-_2px)] leading-[calc(50*var(--u))] font-bold mt-[calc(34*var(--u))]!",
                        start === 4 ||
                        (start === 2 && trainingThemes.indexOf(theme) % 2 === 1)
                          ? "[@media(width>1100px)]:max-w-[calc(480*var(--u))]"
                          : "",
                        "[@media(max-width:1100px)]:text-[28px] [@media(max-width:1100px)]:leading-[1.1] [@media(max-width:1100px)]:mt-[22px]!",
                      ].join(" ")}
                    >{theme.title}</h2>
                    <p
                      className={[
                        "max-w-[calc(620*var(--u))] text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))] mt-[calc(40*var(--u))]!",
                        "[@media(max-width:1100px)]:max-w-[none] [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:1100px)]:leading-[1.6] [@media(max-width:1100px)]:mt-[26px]!",
                      ].join(" ")}
                    >{theme.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ))}
          <article
            className={[
              "h-[calc(710*var(--u))] [padding:calc(110*var(--u))_calc(70*var(--u))_0] grid grid-cols-[calc(628*var(--u))_1fr] gap-x-[calc(52*var(--u))] content-start",
              "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:[padding:55px_0_70px] [@media(max-width:1100px)]:grid-cols-[1fr_1.2fr] [@media(max-width:1100px)]:gap-[30px]",
              "[@media(max-width:700px)]:grid-cols-[1fr] [@media(max-width:700px)]:gap-[26px] [@media(max-width:700px)]:[padding:40px_0_55px]",
            ].join(" ")}
          >
            <ThemeBanner />
            <div
              className={[
                "pt-[calc(22*var(--u))]",
                "[@media(max-width:1100px)]:pt-[0]",
                "[@media(max-width:700px)]:[margin:0_12px]!",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase",
                  "[@media(max-width:1100px)]:text-[length:17px] [@media(max-width:1100px)]:leading-[24px]",
                ].join(" ")}
              >Tailor-Made Training</p>
              <h2
                className={[
                  "text-[length:calc(44*var(--u)_-_2px)] font-bold mt-[calc(28*var(--u))]! leading-[calc(44*var(--u))]",
                  "[@media(max-width:1100px)]:text-[length:28px] [@media(max-width:1100px)]:leading-[1.1] [@media(max-width:1100px)]:mt-[22px]!",
                  "[@media(max-width:700px)]:text-[length:28px]",
                ].join(" ")}
              >
                Designing flexible training shaped <br className={"[@media(max-width:1100px)]:hidden"} />
                around your goals and needs
              </h2>
            </div>
            <p
              className={[
                "[grid-column:1_/_-1] w-[calc(850*var(--u))] [margin:calc(80*var(--u))_0_0_calc(413*var(--u))]! text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))]",
                "[@media(max-width:1100px)]:w-[auto] [@media(max-width:1100px)]:[margin:10px_40px_0]! [@media(max-width:1100px)]:text-[length:17px] [@media(max-width:1100px)]:leading-[1.6]",
                "[@media(max-width:700px)]:[margin:0_12px]! [@media(max-width:700px)]:text-[length:16px]",
              ].join(" ")}
            >
              Every organization works with different people, priorities and
              challenges. EKE can work with your team to identify learning
              needs, define objectives and develop a training program suited to
              your context. Spanning from individual workshops to longer
              capacity-building activities, we bring together relevant
              expertise, participatory methods and practical exercises to help
              turn learning objectives into a program your people can use.
            </p>
          </article>
        </section>
        <section className={"bg-brand-navy"} aria-labelledby="sessions-title">
          <h2
            className={[
              "h-[calc(78*var(--u))] pl-[calc(130*var(--u))] bg-brand-blue text-[length:calc(64*var(--u)_-_2px)] leading-[calc(78*var(--u))] font-bold uppercase",
              "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:[padding:14px_40px] [@media(max-width:1100px)]:text-[length:38px] [@media(max-width:1100px)]:leading-[1.2]",
              "[@media(max-width:700px)]:[padding:16px_24px] [@media(max-width:700px)]:text-[length:28px]",
            ].join(" ")}
            id="sessions-title"
          >All Training Sessions</h2>
          <SessionListings module="training" />
        </section>
        <section
          className={[
            "h-[calc(548*var(--u))] [padding:calc(200*var(--u))_calc(90*var(--u))_0]",
            "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:[padding:70px_40px_0]",
            "[@media(max-width:700px)]:[padding:55px_24px_0]",
          ].join(" ")}
          aria-label="Partner with EKE"
        >
          <p
            className={[
              "indent-[calc(215*var(--u))] text-[length:calc(40*var(--u))] leading-[calc(50*var(--u))]",
              "[@media(max-width:1100px)]:indent-[0] [@media(max-width:1100px)]:text-[length:28px] [@media(max-width:1100px)]:leading-[1.4]",
              "[@media(max-width:700px)]:text-[length:24px]",
            ].join(" ")}
          >
            Organizational growth comes from solving everyday operational
            challenges side by side. Here, international networks and local
            practitioners directly swap field lessons to build proven skills. We
            invite municipalities, schools, universities, and European
            non-profits to partner with us to{" "}
            <strong>
              co-create custom modules, manage cross-border Erasmus+ projects,
              or launch joint research initiatives.
            </strong>
          </p>
          <div
            className={[
              "text-right mr-[calc(70*var(--u))]!",
              "[@media(max-width:1100px)]:[margin:30px_0_0]!",
            ].join(" ")}
          >
            <Button light href="/contact">
              Contact us
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
