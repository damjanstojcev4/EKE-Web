import { pageMetadata } from "@/lib/seo";
import { BreadcrumbStructuredData } from "@/components/SeoStructuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PartnerSection from "@/components/home/PartnerSection";
import SessionListings from "@/components/SessionListings";
import { opportunityPaths } from "@/data/opportunities.mock";
import styles from "./page.module.css";

export const metadata = pageMetadata("opportunities");
const asset = (name: string) =>
  `/assets/opportunities-page/${encodeURIComponent(name)}`;

export default function OpportunitiesPage() {
  return (
    <div className={styles.page}>
      <Header />
      <BreadcrumbStructuredData page="opportunities" />
      <main id="main">
        <section className={styles.hero} aria-labelledby="opportunities-title">
          <div className={styles.heroArtwork} aria-hidden="true">
            <img src={asset("hero-svg.svg")} alt="" width={1196} height={805} />
          </div>
          <p className={styles.label}>Grow as you go</p>
          <h1 id="opportunities-title">
            Opportunities Worth <br />
            Saying Yes to
          </h1>
          <p className={styles.heroCopy}>
            Every meaningful experience starts with a decision to show up. At
            EKE, we make sure that the door to learning and solidarity is always
            open. Our initiatives let you step out of your comfort zone and
            build real-world skills, with openings active at home, abroad,
            individually, or as part of a group.
          </p>
          <img
            className={styles.heroPhoto}
            src={asset("img.webp")}
            alt="A group of young people standing together with arms around each other"
          />
        </section>
        <div className={styles.introduction}>
          <p>
            Explore upcoming opportunities to travel, volunteer, learn, lead,
            and contribute through{" "}
            <strong>
              European Solidarity Corps, Erasmus+, specialized training, and
              local initiatives.
            </strong>{" "}
            Find a call that feels right for you, discover what it offers, and
            take the next step.
          </p>
        </div>
        <section className={styles.calls} aria-labelledby="calls-title">
          <h2 id="calls-title">
            <img src={asset("Group.svg")} alt="" />
            OPEN CALLS
          </h2>
          <div className={styles.listing}>
            <p className={styles.sortLabel}>Closing soonest first</p>
            <SessionListings module="opportunities" />
          </div>
        </section>
        <section className={styles.paths} aria-labelledby="paths-title">
          <div className={styles.pathsIntro}>
            <img
              className={styles.pathsArt}
              src={asset("Group (1).svg")}
              alt=""
            />
            <p className={styles.label}>Individual opportunities</p>
            <h2 id="paths-title">
              Different Paths <br />
              To Engage &amp; Learn
            </h2>
            <p className={styles.pathsCopy}>
              Getting involved with EKE is about finding a space where your
              background, voice, and ideas can connect with others. We cultivate
              open environments where different generations cross paths to learn
              by doing. It is a simple invitation to share your unique
              perspective and grow alongside a supportive network where no one
              gets left behind.
            </p>
          </div>
          <div className={styles.pathGrid}>
            {opportunityPaths.map((path) => (
              <article className={styles.path} key={path.id}>
                <div className={styles.pathPhoto}>
                  <img src={asset(path.image)} alt={path.alt} />
                </div>
                <div className={styles.pathBody}>
                  <img
                    className={styles.pathReflection}
                    src={asset(path.image)}
                    alt=""
                    aria-hidden="true"
                  />
                  <p>{path.text}</p>
                </div>
                <h3>
                  {path.id === "volunteering" ? (
                    <>
                      <img
                        className={styles.pathIcon}
                        src={asset("svg1.svg")}
                        alt=""
                      />
                      {path.title}
                    </>
                  ) : path.id === "internships" ? (
                    <>
                      <svg
                        className={styles.internIcon}
                        viewBox="0 0 65 83"
                        aria-hidden="true"
                      >
                        <image
                          href={asset("Group 646.svg")}
                          width="318"
                          height="83"
                        />
                      </svg>
                      {path.title}
                    </>
                  ) : (
                    <>
                      <img
                        className={styles.pathIcon}
                        src={asset(
                          path.id === "jobs" ? "Group (2).svg" : "Group 84.svg",
                        )}
                        alt=""
                      />
                      {path.title}
                    </>
                  )}
                </h3>
              </article>
            ))}
          </div>
        </section>
        <div className={styles.closing}>
          <p>
            Real-world experience is something we build together, not a
            prerequisite to join. We anchor our network around real people ready
            to <strong>show up, listen, and push things forward.</strong> If
            there isn’t a live call that mirrors your direction today, drop us a
            message anyway. Tell us what sparks your focus, and let&apos;s map
            out how to <strong>move forward together.</strong>
          </p>
        </div>
        <PartnerSection />
      </main>
      <Footer />
    </div>
  );
}
