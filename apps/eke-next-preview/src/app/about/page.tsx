import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PartnerSection from "@/components/home/PartnerSection";
import { Arrow, Stripe } from "@/components/ui";
import {
  pillars,
  values,
  members,
  documents,
} from "@/components/about/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About us — EKE Bitola",
  description:
    "Meet European Cultural Epicenter Bitola: our mission, values, team and extended network.",
};
const asset = (name: string) => `/assets/about/images/${name}`;

export default function About() {
  return (
    <div className={styles.page}>
      <Header />
      <main id="main">
        <section className={styles.hero} aria-labelledby="about-heading">
          <div className={styles.heroArtwork} aria-hidden="true">
            <img src="/assets/about/assets/Group.svg" alt="" />
          </div>
          <p className={styles.label}>About Us</p>
          <h1 id="about-heading">
            Inspiring Locally, Impacting
            <br /> Globally
          </h1>
          <p className={styles.intro}>
            European Cultural Epicenter (EKE) Bitola is a vision-led non-profit
            organization from N. Macedonia. Established in 2012 by Youth in
            Action alumni, EKE has grown from a passionate grassroots initiative
            into an trusted association uniting generations across education,
            community development, and international cooperation.
          </p>
          <div className={styles.pillars}>
            {pillars.map((p) => (
              <article key={p.title}>
                <img
                  src={asset(p.image)}
                  alt={p.title}
                  width={p.image === "Rectangle 65.png" ? 553 : 578}
                  height={378}
                />
                <div>
                  <h2>{p.title}</h2>
                  <p>{p.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.mission} aria-labelledby="mission-heading">
          <p className={styles.label}>Mission &amp; Vision</p>
          <h2 id="mission-heading">What Guides Our Work</h2>
          <ul>
            <li>
              We believe in a future where every individual is personally,
              professionally, and socially fulfilled. We visualize a resilient
              community of active, informed citizens who can navigate
              contemporary professional demands and societal transitions with
              confidence, purpose, and solidarity.
            </li>
            <li>
              Our work is grounded in a simple mandate: to democratize education
              and foster lifelong learning. By designing inclusive,
              learner-centered non-formal programs, we dismantle socio-economic,
              geographic, and digital barriers. From marginalized urban
              neighborhoods and isolated rural communities to correctional
              settings, we provide vulnerable groups with the vital competencies
              needed for personal and professional development.
            </li>
          </ul>
        </section>
        <section className={styles.values} aria-labelledby="values-heading">
          <h2 id="values-heading">Values</h2>
          {values.map((v, i) => (
            <article key={v.title}>
              <div className={styles.valueArtwork} aria-hidden="true">
                {(i === 1 || i === 3) && (
                  <img
                    className={styles.valueCircle}
                    src={`/assets/about/assets/${i === 1 ? "Ellipse 5.svg" : "Group 41.svg"}`}
                    alt=""
                  />
                )}
                <img
                  className={styles.valueIllustration}
                  src={`/assets/about/assets/${["Group 71.svg", "Group 37.svg", "Group 42.svg", "Vector.svg"][i]}`}
                  alt=""
                />
              </div>
              <div className={styles.valueCopy}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
              <span className={styles.number}>0{i + 1}</span>
            </article>
          ))}
        </section>
        <section
          className={styles.team}
          id="team"
          aria-labelledby="team-heading"
        >
          <p className={styles.label}>Inside EKE</p>
          <h2 id="team-heading">
            <span>Meet the Team</span>
          </h2>
          <p className={styles.teamIntro}>
            Our work is driven by a passionate network of{" "}
            <strong>educators, coordinators, and visionaries</strong> united for
            lasting community impact. Meet the dedicated people and minds
            bringing our mission to life every single day.
          </p>
          <div className={styles.members}>
            {members.map((m) => (
              <article key={m.name}>
                <img
                  src={asset(m.image)}
                  alt={m.name}
                  width={241}
                  height={339}
                />
                <div>
                  <h3>{m.name}</h3>
                  <p className={styles.role}>{m.role}</p>
                  <p className={styles.bio}>{m.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.network} aria-labelledby="network-heading">
          <Stripe />
          <div className={styles.networkPhoto}>
            <img
              src={asset("unsplash_M5k978V3qBc.png")}
              alt="Field experts exchanging ideas"
              width={1920}
              height={682}
            />
            <div className={styles.networkTitle}>
              <p className={styles.label}>Our extended network</p>
              <h2 id="network-heading">
                Grassroots Volunteers
                <br />
                &amp; Field Experts
              </h2>
            </div>
          </div>
          <div className={styles.networkCopy}>
            <p>
              Our central hub in Bitola thrives on the{" "}
              <strong>
                collaborative energy shared between our core team and
                international youth volunteers.
              </strong>{" "}
              Traveling from across Europe through the European Solidarity
              Corps, these volunteers add fresh global perspectives to our
              ongoing local efforts. On the ground, they work closely alongside
              us as supportive co-facilitators, learning the ropes while helping
              our team deliver{" "}
              <strong>
                open-air classrooms, street workout sessions, and digital
                workshops across generations.
              </strong>
            </p>
            <div>
              <p>
                To keep our non-formal learning deeply credible, we blend daily
                this enthusiasm with a specialized network of{" "}
                <strong>
                  university professors, researchers, teachers, and journalists
                </strong>{" "}
                hired on an honorary basis. This professional circle provides
                the evidence-based backbone required to handle our most
                sensitive areas of expertise.
              </p>
              <p>
                By combining their academic research with our practical field
                experience, we are able to{" "}
                <strong>
                  design high-quality, trusted educational curricula for complex
                  initiatives,
                </strong>{" "}
                ranging from digital literacy toolkits to pioneering
                resocialization programs inside correctional institutions.
              </p>
            </div>
          </div>
          <Stripe />
        </section>
        <section
          className={styles.governance}
          aria-labelledby="governance-heading"
        >
          <img
            className={styles.governanceArtwork}
            src="/assets/about/assets/Vector1.svg"
            alt=""
            aria-hidden="true"
          />
          <p className={styles.label}>How we work and stay accountable</p>
          <div className={styles.governanceIntro}>
            <h2 id="governance-heading">
              Governance &amp;
              <br />
              Transparency
            </h2>
            <p>
              Accountability is the backbone of our mission. EKE Bitola operates
              with a stable structure rooted in our internal statutes and driven
              by total transparency. Our strategic direction is led by the
              Assembly of Citizens, handled operationally by the Executive
              Board, and audited for complete compliance. From grassroots
              funding to global initiatives, we ensure every project and
              financial line stands up to the highest standards of public trust.
            </p>
          </div>
          <div className={styles.documents}>
            {documents.map((d) => (
              <article key={d.title}>
                <p>{d.text}</p>
                <div className={styles.documentAction}>
                  <button
                    type="button"
                    className="button"
                    aria-disabled="true"
                    aria-label={`${d.title} — download unavailable`}
                    aria-describedby="document-status"
                  >
                    {d.title}
                    <Arrow file="vector4.svg" down />
                  </button>
                  <span role="tooltip">Document not yet available</span>
                </div>
              </article>
            ))}
          </div>
          <p id="document-status" className={styles.documentStatus}>
            Statute, Financial Reports, Policies and Annual Reports: downloads
            not yet available.
          </p>
        </section>
        <div className={styles.partner}>
          <PartnerSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
