"use client";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Stripe } from "@/components/ui";
import ArticleContent from "@/components/news/ArticleContent";
import { articleBlocks } from "@/lib/api/news";
import { useApi } from "@/lib/api/use-api";
import { externalUrl, mediaUrl } from "@/lib/api/client";
import type { ProjectRecord } from "@/lib/api/projects";
import styles from "@/components/project-details/project-detail.module.css";
const factCellClasses = [
  "relative [padding:calc(21*var(--u))_calc(20*var(--u))_calc(15*var(--u))_calc(103*var(--u))] [border-left:1px_solid_#212c5d40] min-h-[calc(101*var(--u))] first:[border:0] first:pl-[calc(36*var(--u))]",
  "before:content-[''] before:absolute before:left-[calc(68*var(--u))] before:top-[calc(29*var(--u))] before:size-[calc(17*var(--u))] before:bg-brand-blue first:before:left-0",
  "[@media(max-width:1100px)]:[padding:0_0_0_24px] [@media(max-width:1100px)]:first:pl-[24px] [@media(max-width:1100px)]:[border:0] [@media(max-width:1100px)]:min-h-0 [@media(max-width:1100px)]:before:left-0 [@media(max-width:1100px)]:before:top-[6px] [@media(max-width:1100px)]:before:size-[10px]",
].join(" ");

export default function PublicProject({ slug, initialProject }: { slug: string; initialProject?: ProjectRecord }) {
  const { data: p, error } = useApi<ProjectRecord>(
    `/projects/slug/${encodeURIComponent(slug)}`,
    initialProject,
  );
  const logo = p?.logoFilePath
    ? mediaUrl(`/api/uploads/images/${encodeURIComponent(p.logoFilePath)}`)
    : mediaUrl(p?.image);
  function references(value: string | null | undefined): {
    name?: string;
    title?: string;
    url: string;
    alt?: string;
    description?: string;
  }[] {
    try {
      const items = JSON.parse(value || "[]");
      return Array.isArray(items) ? items.filter((item) => item && typeof item === "object" && typeof item.url === "string") : [];
    } catch {
      return [];
    }
  }
  return (
    <div className={`${styles.page} bg-surface-muted overflow-clip`}>
      <Header />
      <main id="main">
        {p && <Link className="absolute top-[100px] left-[24px] z-10 underline" href="/projects/">Back to Projects</Link>}
        {error ? (
          <div
            className={
              "min-h-[65vh] [padding:180px_24px_100px] [&_h1]:text-[38px] [&_p]:[margin:24px_0]! [&_a]:underline!"
            }
          >
            <h1>Project unavailable</h1>
            <p role="alert">{error}</p>
            <Link href="/projects/">Back to Projects</Link>
          </div>
        ) : !p ? (
          <p className="min-h-[65vh] px-[24px] pt-[180px]" role="status">Loading project…</p>
        ) : (
          <>
            <section
              className={[
                "h-[calc(1387*var(--u))] relative [padding:calc(246*var(--u))_calc(80*var(--u))_0] isolate",
                "[@media(max-width:1100px)]:h-auto [@media(max-width:1100px)]:[padding:150px_32px_60px]",
                "[@media(max-width:700px)]:[padding:140px_24px_50px]",
              ].join(" ")}
            >
              <div className={styles.artwork} aria-hidden="true">
                <img src="/assets/project-details/Group.svg" alt="" />
              </div>
              <p
                className={
                  "text-[length:calc(22*var(--u))] leading-[calc(72*var(--u))] font-bold uppercase [@media(max-width:1100px)]:text-[18px] [@media(max-width:1100px)]:leading-[1.4]"
                }
              >
                Project details
              </p>
              <h1
                className={[
                  "[margin:calc(5*var(--u))_0_0_calc(-4*var(--u))]! w-[calc(1410*var(--u))] text-[length:calc(110*var(--u)_-_2px)] leading-[calc(110*var(--u))] font-bold",
                  "[@media(max-width:1100px)]:text-[length:calc(clamp(42px,_5.73vw,_70px)_-_2px)] [@media(max-width:1100px)]:leading-none [@media(max-width:1100px)]:w-[min(100%,850px)] [@media(max-width:1100px)]:[margin:20px_0_70px]!",
                  "[@media(max-width:700px)]:text-[42px] [@media(max-width:700px)]:leading-[1.08] [@media(max-width:700px)]:mb-[48px]! [@media(max-width:700px)]:[overflow-wrap:anywhere]",
                ].join(" ")}
              >
                {p.title}
              </h1>
              <div
                className={[
                  styles.facts,
                  [
                    "absolute top-[calc(722*var(--u))] left-[calc(80*var(--u))] right-[calc(81*var(--u))] text-[length:calc(24*var(--u))] leading-[calc(32*var(--u))] [&_dd]:font-bold [&_dd]:whitespace-pre-line",
                    "[@media(max-width:1100px)]:relative [@media(max-width:1100px)]:inset-auto [@media(max-width:1100px)]:text-[17px] [@media(max-width:1100px)]:leading-[1.45]",
                  ].join(" "),
                ].join(" ")}
              >
                <Stripe />
                <dl
                  className={[
                    "grid [margin:calc(70*var(--u))_0_0] [grid-template-columns:222fr_320fr_407fr_320fr_490fr]",
                    "[@media(width>1100px)]:[&>div:nth-child(3)]:pl-[calc(94*var(--u))] [@media(width>1100px)]:[&>div:nth-child(3)]:before:left-[calc(59*var(--u))]",
                    "[@media(max-width:1100px)]:[grid-template-columns:repeat(3,_1fr)] [@media(max-width:1100px)]:gap-[24px] [@media(max-width:1100px)]:mt-[32px]",
                    "[@media(max-width:700px)]:[grid-template-columns:1fr]",
                  ].join(" ")}
                >
                  {[
                    ["Programme", p.programme],
                    [
                      "Project status",
                      p.status === "ON_GOING" ? "Ongoing" : "Past",
                    ],
                    ["Start date", p.startDate],
                    ["End date", p.endDate],
                    [
                      "Grant",
                      p.grantValue === null
                        ? null
                        : `${p.grantValue} ${p.currency || ""}`,
                    ],
                    ["Countries covered", p.countries],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className={factCellClasses}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                </dl>
                <dl
                  className={[
                    "grid [margin:calc(89*var(--u))_0_0] [grid-template-columns:calc(525*var(--u))_calc(433*var(--u))_1fr]",
                    "[@media(width>1100px)]:[&>div]:pt-0 [@media(width>1100px)]:[&>div]:pl-[calc(90*var(--u))] [@media(width>1100px)]:[&>div]:before:left-[calc(55*var(--u))] [@media(width>1100px)]:[&>div]:before:top-[calc(7*var(--u))]",
                    "[@media(min-width:1101px)]:mt-[calc(83*var(--u))]",
                    "[@media(max-width:1100px)]:[grid-template-columns:repeat(3,_1fr)] [@media(max-width:1100px)]:gap-[24px] [@media(max-width:1100px)]:mt-[32px]",
                    "[@media(max-width:700px)]:[grid-template-columns:1fr]",
                  ].join(" ")}
                >
                  {[
                    ["Key action", p.keyAction],
                    ["Action type", p.actionType],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className={factCellClasses}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  {externalUrl(p.website) && (
                    <div className={factCellClasses}>
                      <dt>Website</dt>
                      <dd>
                        <a href={externalUrl(p.website)}>{p.website}</a>
                      </dd>
                    </div>
                  )}
                </dl>
                {p.topics && (
                  <div
                    className={[
                      "relative mt-[calc(77*var(--u))] pl-[calc(36*var(--u))] before:content-[''] before:absolute before:left-0 before:top-[calc(7*var(--u))] before:size-[calc(17*var(--u))] before:bg-brand-blue",
                      "[@media(min-width:1101px)]:mt-[calc(73*var(--u))] [@media(min-width:1101px)]:[&_li]:font-medium",
                      "[&_ul]:flex [&_ul]:gap-[calc(18*var(--u))] [&_ul]:list-none [&_ul]:p-0 [&_ul]:[margin:calc(11*var(--u))_0_0] [&_li]:[border:1px_solid_#37416d] [&_li]:rounded-[calc(10*var(--u))] [&_li]:p-[calc(10*var(--u))] [&_li]:text-[length:calc(22*var(--u))]",
                      "[@media(max-width:1100px)]:mt-[32px] [@media(max-width:1100px)]:pl-[24px] [@media(max-width:1100px)]:before:top-[6px] [@media(max-width:1100px)]:before:size-[10px] [@media(max-width:1100px)]:[&_ul]:flex-wrap [@media(max-width:1100px)]:[&_ul]:gap-[10px] [@media(max-width:1100px)]:[&_ul]:mt-[10px] [@media(max-width:1100px)]:[&_li]:text-[16px] [@media(max-width:1100px)]:[&_li]:p-[8px] [@media(max-width:1100px)]:[&_li]:rounded-[8px]",
                    ].join(" ")}
                  >
                    <p>Topics</p>
                    <ul>
                      {p.topics.split(",").map((t) => (
                        <li key={t}>{t.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
            <section
              className={[
                "h-[calc(393*var(--u))] bg-brand-navy text-white [padding:calc(30*var(--u))_calc(42*var(--u))_calc(30*var(--u))_calc(48*var(--u))]",
                "[@media(max-width:1100px)]:h-auto [@media(max-width:1100px)]:p-[24px]",
                "[@media(max-width:700px)]:p-[16px]",
              ].join(" ")}
            >
              <div
                className={[
                  styles.summaryInner,
                  [
                    "h-full [border:1px_solid_var(--light-blue)] rounded-[calc(28*var(--u))] grid [grid-template-columns:calc(345*var(--u))_1fr] gap-[calc(75*var(--u))] p-[calc(28*var(--u))] items-center",
                    "[@media(max-width:1100px)]:p-[24px] [@media(max-width:1100px)]:[grid-template-columns:180px_1fr] [@media(max-width:1100px)]:gap-[32px] [@media(max-width:1100px)]:rounded-[20px]",
                    "[@media(max-width:700px)]:[grid-template-columns:1fr] [@media(max-width:700px)]:gap-[24px]",
                  ].join(" "),
                ].join(" ")}
              >
                {logo && (
                  <div
                    className={[
                      styles.logo,
                      [
                        "h-[calc(276*var(--u))] rounded-[calc(24*var(--u))] bg-[#1554a0] flex items-center justify-center overflow-hidden [&_img]:w-[calc(325*var(--u))] [&_img]:h-auto",
                        "[@media(max-width:1100px)]:h-[180px] [@media(max-width:1100px)]:rounded-[16px] [@media(max-width:1100px)]:[&_img]:w-[95%]",
                        "[@media(max-width:700px)]:w-[200px] [@media(max-width:700px)]:h-[160px]",
                      ].join(" "),
                    ].join(" ")}
                  >
                    <img src={logo} alt={`${p.title} logo`} />
                  </div>
                )}
                <div>
                  <h2 className="text-[length:calc(44*var(--u)_-_2px)] font-bold leading-[calc(42*var(--u))] mb-[calc(30*var(--u))]! [@media(max-width:1100px)]:text-[30px] [@media(max-width:1100px)]:leading-[1.2] [@media(max-width:1100px)]:mb-[20px]!">
                    Summary
                  </h2>
                  <p className="text-[length:calc(24*var(--u))] leading-[calc(32*var(--u))] whitespace-pre-wrap [@media(max-width:1100px)]:text-[18px] [@media(max-width:1100px)]:leading-[1.5]">
                    {p.description ||
                      p.quickSummary ||
                      "Further project information has not been supplied."}
                  </p>
                </div>
              </div>
            </section>
            <div
              className={[
                "h-[calc(1592*var(--u))] [padding:calc(151*var(--u))_calc(80*var(--u))_calc(145*var(--u))]",
                "[@media(max-width:1100px)]:h-auto [@media(max-width:1100px)]:[padding:72px_32px]",
                "[@media(max-width:700px)]:[padding:56px_24px]",
              ].join(" ")}
            >
              <ArticleContent blocks={articleBlocks(p.contentJson)} />
            </div>
            <div
              className={[
                "h-[calc(382*var(--u))] bg-brand-navy text-white [padding:calc(23*var(--u))_calc(40*var(--u))_calc(26*var(--u))_calc(38*var(--u))] grid [grid-template-columns:900fr_921fr] gap-[calc(21*var(--u))]",
                "[&_h2]:text-brand-blue [&_h2]:text-[length:calc(34*var(--u)_-_2px)] [&_h2]:leading-[calc(42*var(--u))] [&_h2]:font-bold [&_p]:text-[length:calc(20*var(--u))] [&_p]:leading-[calc(32*var(--u))]",
                "[@media(max-width:1100px)]:h-auto [@media(max-width:1100px)]:p-[24px] [@media(max-width:1100px)]:[grid-template-columns:1fr] [@media(max-width:1100px)]:gap-[24px] [@media(max-width:1100px)]:[&_h2]:text-[26px] [@media(max-width:1100px)]:[&_h2]:leading-[1.3] [@media(max-width:1100px)]:[&_p]:text-[17px] [@media(max-width:1100px)]:[&_p]:leading-[1.6]",
                "[@media(max-width:700px)]:p-[16px]",
              ].join(" ")}
            >
              {(!!p.partners?.length ||
                !!references(p.partnerMediaJson).length) && (
                <section
                  className={[
                    "[border:1px_solid_var(--light-blue)] rounded-[calc(28*var(--u))] grid [grid-template-columns:calc(245*var(--u))_1fr] [padding:calc(31*var(--u))_calc(36*var(--u))_calc(29*var(--u))_calc(41*var(--u))] [&_p]:text-[#e24b59]",
                    "[@media(max-width:1100px)]:p-[24px] [@media(max-width:1100px)]:rounded-[20px] [@media(max-width:1100px)]:[grid-template-columns:1fr_1.5fr] [@media(max-width:1100px)]:gap-[24px]",
                    "[@media(max-width:700px)]:[grid-template-columns:1fr]",
                  ].join(" ")}
                >
                  <h2>Partners</h2>
                  <ul>
                    {(p.partners || []).map((partner) => (
                      <li key={partner}>{partner}</li>
                    ))}
                  </ul>
                  <div
                    className={[
                      styles.partnerGrid,
                      [
                        "grid [grid-template-columns:repeat(4,_calc(129*var(--u)))] [gap:calc(10*var(--u))_calc(19*var(--u))] [&>div]:w-[calc(129*var(--u))] [&>div]:h-[calc(131*var(--u))]",
                        "[@media(max-width:1100px)]:[grid-template-columns:repeat(4,_1fr)] [@media(max-width:1100px)]:gap-[10px] [@media(max-width:1100px)]:[&>div]:w-auto [@media(max-width:1100px)]:[&>div]:h-auto [@media(max-width:1100px)]:[&>div]:aspect-[129/131]",
                      ].join(" "),
                    ].join(" ")}
                  >
                    {references(p.partnerMediaJson).map((partner, index) => (
                      <div key={index}>
                        {mediaUrl(partner.url) && (
                          <img
                            src={mediaUrl(partner.url)}
                            alt={partner.alt || ""}
                            width={129}
                            height={131}
                          />
                        )}
                        <p>{partner.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section
                className={[
                  "[border:1px_solid_var(--light-blue)] rounded-[calc(28*var(--u))] grid [grid-template-columns:calc(331*var(--u))_1fr] gap-[calc(41*var(--u))] [padding:calc(48*var(--u))_calc(40*var(--u))_calc(30*var(--u))_calc(45*var(--u))]",
                  "[@media(min-width:1101px)]:[&>div:first-child>p]:mt-[calc(7*var(--u))]!",
                  "[@media(max-width:1100px)]:p-[24px] [@media(max-width:1100px)]:rounded-[20px] [@media(max-width:1100px)]:[grid-template-columns:1fr_1.5fr] [@media(max-width:1100px)]:gap-[24px]",
                  "[@media(max-width:700px)]:[grid-template-columns:1fr]",
                ].join(" ")}
              >
                <div>
                  <h2>Download</h2>
                  <p>{p.downloadDescription}</p>
                </div>
                {mediaUrl(p.pdfUrl) ? (
                  <a
                    className={[
                      "inline-flex items-center gap-[calc(18*var(--u))] mt-[calc(40*var(--u))] min-h-[calc(73*var(--u))] [border:1px_solid_#fff] rounded-[calc(6*var(--u))] [padding:calc(12*var(--u))_calc(17*var(--u))] bg-transparent text-white! text-[length:calc(18*var(--u))] font-bold uppercase",
                      "[&:not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:bg-brand-blue [&:not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:text-brand-navy! [&:not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:border-brand-blue",
                      "[@media(max-width:1100px)]:text-[16px] [@media(max-width:1100px)]:min-h-[52px] [@media(max-width:1100px)]:[padding:12px_16px] [@media(max-width:1100px)]:gap-[16px] [@media(max-width:1100px)]:mt-[24px]",
                    ].join(" ")}
                    href={mediaUrl(p.pdfUrl)}
                    download
                  >
                    Download PDF
                  </a>
                ) : (
                  <p>No project document has been supplied.</p>
                )}
                <div>
                  {references(p.resourcesJson).map((resource, index) => (
                    <article key={index}>
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      {mediaUrl(resource.url) && (
                        <a href={mediaUrl(resource.url)} download>
                          Download {resource.title}
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
