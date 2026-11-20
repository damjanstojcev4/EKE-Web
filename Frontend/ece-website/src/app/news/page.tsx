import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicNewsList from "@/components/news/PublicNewsList";
import styles from "./page.module.css";
export const metadata = { title: "News — EKE Bitola" };
export default function NewsPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main id="main">
        {" "}
        <section className={styles.hero} aria-labelledby="news-title">
          <p className={styles.label}>Latest from EKE</p>
          <h1 id="news-title">
            Community Updates &amp; Shared
            <br /> Insights
          </h1>
          <p className={styles.intro}>
            Discover how EKE nurtures sustainable change from the ground up. Dig
            into our{" "}
            <strong>
              open calls, network briefs, first-hand stories, and open-source
              resources
            </strong>{" "}
            created to help fresh ideas take root and blossom into real-world
            solutions.
          </p>
        </section>
        <PublicNewsList />
        <section className={styles.statement}>
          <p>
            People, ideas and communities move forward when non-formal learning
            and international perspectives cross paths to turn{" "}
            <strong>shared knowledge into collective power.</strong>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
