import { pageMetadata } from "@/lib/seo";
import { BreadcrumbStructuredData } from "@/components/SeoStructuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicNewsList from "@/components/news/PublicNewsList";
export const metadata = pageMetadata("news");
export default function NewsPage() {
  return (
    <div className="bg-surface-muted overflow-clip">
      <Header />
      <BreadcrumbStructuredData page="news" />
      <main id="main">
        {" "}
        <section
          className="relative h-[calc(760*var(--u))] px-[calc(80*var(--u))] pt-[calc(235*var(--u))] before:absolute before:z-0 before:inset-x-0 before:top-[calc(77*var(--u))] before:h-[calc(792*var(--u))] before:bg-brand-blue before:content-[''] [@media(max-width:768px)]:h-auto [@media(max-width:768px)]:bg-brand-blue [@media(max-width:768px)]:px-[24px] [@media(max-width:768px)]:pt-[145px] [@media(max-width:768px)]:pb-[48px] [@media(max-width:768px)]:before:hidden"
          aria-labelledby="news-title"
        >
          <p className="relative ml-[calc(4*var(--u))]! text-[length:calc(22*var(--u))] leading-[calc(28*var(--u))] font-bold uppercase text-white [@media(max-width:768px)]:ml-0! [@media(max-width:768px)]:text-[16px] [@media(max-width:768px)]:leading-[24px]">
            Latest from EKE
          </p>
          <h1
            id="news-title"
            className="relative mt-[calc(52*var(--u))]! text-[length:calc(100*var(--u)-2px)] font-bold leading-[.94] tracking-[calc(-1.5*var(--u))] [@media(min-width:1101px)]:tracking-normal [@media(max-width:768px)]:mt-[30px]! [@media(max-width:768px)]:text-[length:calc(clamp(38px,7vw,60px)-2px)] [@media(max-width:768px)]:leading-[1.04] [@media(max-width:768px)]:tracking-[-.7px]"
          >
            Community Updates &amp; Shared
            <br className="[@media(max-width:768px)]:hidden" /> Insights
          </h1>
          <p className="absolute top-[calc(452*var(--u))] left-[calc(508*var(--u))] right-[calc(160*var(--u))] text-[length:calc(40*var(--u))] leading-[1.25] [@media(max-width:768px)]:static [@media(max-width:768px)]:mt-[26px]! [@media(max-width:768px)]:text-[22px] [@media(max-width:768px)]:leading-[1.35]">
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
        <section className="bg-brand-blue pt-[calc(48*var(--u))] px-[calc(80*var(--u))] pb-[calc(55*var(--u))] [@media(max-width:768px)]:px-[24px] [@media(max-width:768px)]:py-[36px]">
          <p className="text-[length:calc(40*var(--u))] leading-[1.25] text-center before:inline-block before:w-[calc(135*var(--u))] before:content-[''] [@media(min-width:1101px)]:text-left [@media(min-width:1101px)]:before:w-[calc(155*var(--u))] [@media(max-width:768px)]:text-[24px] [@media(max-width:768px)]:leading-[1.35] [@media(max-width:768px)]:before:hidden">
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
