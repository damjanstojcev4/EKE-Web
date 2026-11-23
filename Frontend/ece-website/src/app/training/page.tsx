import { pageMetadata } from "@/lib/seo";
import { BreadcrumbStructuredData } from "@/components/SeoStructuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button, Stripe } from "@/components/ui";
import SessionListings from "@/components/SessionListings";
import { trainingThemes } from "@/data/training.mock";
import styles from "./page.module.css";

export const metadata = pageMetadata("training");
const asset = (file: string) =>
  `/assets/training-page/${encodeURIComponent(file)}`;

function ThemeBanner({
  illustration = "Group 96.png",
}: {
  illustration?: string;
}) {
  return (
    <div className={styles.themeBanner} aria-hidden="true">
      <img
        className={styles.themeIllustration}
        src={asset(illustration)}
        alt=""
        width={413}
        height={194}
      />
      <img
        className={styles.themePhoto}
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
    <div className={styles.page}>
      <Header />
      <BreadcrumbStructuredData page="training" />
      <main id="main">
        <section className={styles.hero} aria-labelledby="training-title">
          <div className={styles.heroArt} aria-hidden="true">
            <img src={asset("Group.svg")} alt="" />
          </div>
          <p className={styles.label}>Training</p>
          <h1 id="training-title">
            Building Skills for Lasting <br />
            Social Impact
          </h1>
          <p className={styles.heroCopy}>
            We believe local expertise lies at the heart of enduring systemic
            progress. To support it, EKE brings high-quality, flexible learning
            straight to the communities that need it most. We back every
            training module with a decade of field experience, giving citizens
            and institutional networks the immediate skills to disrupt
            stagnation and cultivate deep-seated social renewal.
          </p>
          <div className={styles.heroImage}>
            <img
              src={asset("Rectangle 66.png")}
              alt="A network connecting people across communities"
              width={1760}
              height={378}
            />
            <Stripe />
          </div>
        </section>
        <div className={styles.introduction}>
          <p>
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
        <section className={styles.methods} aria-label="Our training approach">
          <article className={styles.method}>
            <div className={styles.methodCard}>
              <img
                src={asset("Rectangle 190.png")}
                alt="Research and project planning at a desk"
                width={655}
                height={248}
              />
              <p className={styles.methodLabel}>Approach</p>
              <h2>
                Connecting Trusted Research <br />
                With Participatory Learning
              </h2>
            </div>
            <div className={styles.methodCopy}>
              <p>
                Our work brings together educational research, specialist
                knowledge and experience gained through years of project
                implementation.
              </p>
              <p>
                By replacing rigid instruction with horizontal, dialogue-based
                pedagogy, we connect our network’s academic research directly to
                the lived realities of our participants. This combination helps
                us develop learning programs that respond to the people taking
                part and the challenges they face.
              </p>
            </div>
          </article>
          <article className={styles.method}>
            <div className={styles.methodCard}>
              <img
                src={asset("Rectangle 190.png")}
                alt="Research and project planning at a desk (placeholder)"
                width={655}
                height={248}
              />
              <p className={styles.methodLabel}>Non-Formal Education</p>
              <h2>
                Integrating Active Methods Into <br />
                Everyday Educational Practice
              </h2>
            </div>
            <div className={styles.methodCopy}>
              <p>
                Non-formal education is the foundation of EKE’s training work.
                Our methods include group work, peer learning, reflection,
                experiential activities and facilitated dialogue.
              </p>
              <p>
                We help educators and youth workers apply these approaches in
                their own programs, fostering learning environments that are
                active, inclusive and responsive to the people taking part.
              </p>
            </div>
          </article>
        </section>
        <section className={styles.themes} aria-label="Training areas">
          {[0, 2, 4].map((start) => (
            <div className={styles.themeRow} key={start}>
              {trainingThemes.slice(start, start + 2).map((theme) => (
                <article className={styles.theme} key={theme.id}>
                  <ThemeBanner illustration={theme.illustration} />
                  <div className={styles.themeCopy}>
                    <p className={styles.label}>{theme.label}</p>
                    <h2>{theme.title}</h2>
                    <p>{theme.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ))}
          <article className={styles.tailored}>
            <ThemeBanner />
            <div className={styles.tailoredHeading}>
              <p className={styles.label}>Tailor-Made Training</p>
              <h2>
                Designing flexible training shaped <br />
                around your goals and needs
              </h2>
            </div>
            <p className={styles.tailoredCopy}>
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
        <section className={styles.sessions} aria-labelledby="sessions-title">
          <h2 id="sessions-title">All Training Sessions</h2>
          <SessionListings module="training" />
        </section>
        <section className={styles.closing} aria-label="Partner with EKE">
          <p>
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
          <div>
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
