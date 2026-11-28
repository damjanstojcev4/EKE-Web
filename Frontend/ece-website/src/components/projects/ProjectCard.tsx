import { mediaUrl } from "@/lib/api/client";
import { projectHref, type ProjectRecord } from "@/lib/api/projects";
export default function ProjectCard({
  project: p,
}: {
  project: ProjectRecord;
}) {
  const href = projectHref(p.slug);
  const image = mediaUrl(p.image);
  return (
    <article
      className={[
        "relative grid [grid-template-columns:minmax(0,_420fr)_minmax(0,_417fr)_minmax(0,_596fr)] items-stretch pb-[calc(56*var(--u))] mb-[calc(56*var(--u))] [&::after]:[content:''] [&::after]:absolute [&::after]:bottom-0 [&::after]:left-[calc(184*var(--u))] [&::after]:right-0 [&::after]:[border-bottom:1px_solid_#212c5d40] [&_>_*]:min-w-0",
        "[@media(max-width:1100px)]:[grid-template-columns:30%_25%_45%] [@media(max-width:1100px)]:pb-[50px] [@media(max-width:1100px)]:[&::after]:bottom-[25px] [@media(max-width:1100px)]:[&::after]:left-[15%]",
        "[@media(max-width:700px)]:block [@media(max-width:700px)]:pb-[45px] [@media(max-width:700px)]:mb-[30px] [@media(max-width:700px)]:[&::after]:bottom-0 [@media(max-width:700px)]:[&::after]:left-0",
      ].join(" ")}
    >
      <div className="[aspect-ratio:420/287] [align-self:start] [background:#212c5d08]">
        {image && (
          <img
            className="w-full h-full [aspect-ratio:420/287] object-cover [@media(max-width:1100px)]:w-full [@media(max-width:1100px)]:h-full"
            src={image}
            alt={p.imageAlt || ""}
            width={420}
            height={287}
          />
        )}
      </div>
      <div className="[padding:calc(24*var(--u))_calc(30*var(--u))_0_calc(63*var(--u))] flex flex-col justify-between gap-[calc(24*var(--u))] [@media(max-width:1100px)]:[padding:10px_16px] [@media(max-width:700px)]:[padding:24px_0_0] [@media(max-width:700px)]:gap-[18px]">
        <h2 className="text-[length:calc(34*var(--u)_-_2px)] font-bold leading-[calc(42*var(--u))] whitespace-pre-line [overflow-wrap:anywhere] [@media(max-width:1100px)]:text-[20px] [@media(max-width:1100px)]:leading-[1.2] [@media(max-width:700px)]:text-[26px] [@media(max-width:700px)]:whitespace-normal">
          {p.title}
        </h2>
        <div>
          <p className="[font-family:var(--font-google-flex)] text-[length:calc(20*var(--u))] leading-[calc(24*var(--u))] font-semibold uppercase [@media(max-width:1100px)]:text-[14px] [@media(max-width:1100px)]:leading-[1.5] [@media(max-width:700px)]:text-[16px]">
            {p.status === "ON_GOING" ? "Ongoing" : "Past"}
          </p>
          <p className="text-[length:calc(16*var(--u))] leading-[calc(24*var(--u))] mt-[calc(4*var(--u))]! [overflow-wrap:anywhere] [@media(max-width:1100px)]:text-[11px] [@media(max-width:1100px)]:leading-[1.5] [@media(max-width:1100px)]:whitespace-normal [@media(max-width:700px)]:text-[14px] [@media(max-width:700px)]:mt-[3px]!">
            {[p.startDate, p.endDate].filter(Boolean).join(" – ")}
          </p>
        </div>
      </div>
      <div className="pt-[calc(16*var(--u))] flex flex-col justify-between gap-[calc(24*var(--u))] [@media(max-width:1100px)]:[padding:10px_0] [@media(max-width:1100px)]:gap-[15px] [@media(max-width:700px)]:pt-[20px]">
        <p className="[overflow-wrap:anywhere] text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))] [@media(max-width:1100px)]:text-[15px] [@media(max-width:1100px)]:leading-[1.5] [@media(max-width:700px)]:text-[17px]">
          {p.quickSummary || p.description}
        </p>
        {href ? (
          <a
            className="flex items-center gap-[calc(18*var(--u))] [border:0] bg-transparent text-brand-navy! uppercase font-bold text-[length:calc(20*var(--u))] leading-[calc(30*var(--u))] [padding:0] self-end [@media(max-width:1100px)]:text-[14px] [@media(max-width:1100px)]:leading-[24px] [@media(max-width:700px)]:text-[16px]"
            href={href}
          >
            Project Details
          </a>
        ) : (
          <p className="[overflow-wrap:anywhere] text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))] [@media(max-width:1100px)]:text-[15px] [@media(max-width:1100px)]:leading-[1.5] [@media(max-width:700px)]:text-[17px]">
            Detail page awaiting the next site update.
          </p>
        )}
      </div>
    </article>
  );
}
