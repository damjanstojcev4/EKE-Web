import Image from "next/image";
import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import HeroHeadline from "./HeroHeadline";
import { Button, Stripe } from "../ui";

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-photo">
        <Image
          src="/assets/hero-lightbulb.webp"
          alt="A glowing light bulb"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero-mask hero-mask-large" />
      <div className="hero-mask hero-mask-small" />
      <div className="hero-body">
        <HeroHeadline />
        <div className="hero-intro">
          <ContentBlock block={siteContent.heroIntro} />
          <div className="actions">
            <Button light outline href={"/projects"}>
              Explore Our Projects
            </Button>
            <Button light href={"/about"}>
              Discover our story
            </Button>
          </div>
        </div>
      </div>
      <Stripe />
    </section>
  );
}
