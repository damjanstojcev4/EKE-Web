import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ImpactSection from "@/components/home/ImpactSection";
import ExpertiseSection from "@/components/home/ExpertiseSection";
import PartnershipsSection from "@/components/home/PartnershipsSection";
import NewsSection from "@/components/home/NewsSection";
import TeamSection from "@/components/home/TeamSection";
import PartnerSection from "@/components/home/PartnerSection";
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <HeroSection />
        <ImpactSection />
        <ExpertiseSection />
        <PartnershipsSection />
        <NewsSection />
        <TeamSection />
        <PartnerSection />
      </main>
      <Footer />
    </>
  );
}
