"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/api/use-api";
import { externalUrl } from "@/lib/api/client";
import {
  deadlineLabel,
  sessionLifecycle,
  type SessionRecord,
} from "@/lib/api/sessions";
import o from "@/app/opportunities/page.module.css";
export default function SessionListings({
  module,
}: {
  module: "opportunities" | "training";
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const { data, error } = useApi<SessionRecord[]>(
    module === "training" ? "/training/sessions" : "/opportunities/public",
  );
  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p role="status">Loading {module}…</p>;
  if (!data.length)
    return (
      <p>
        No published{" "}
        {module === "training" ? "training sessions" : "opportunities"} yet.
      </p>
    );
  return (
    <div
      className={
        module === "training"
          ? [
              "[padding:calc(174*var(--u))_calc(130*var(--u))_calc(74*var(--u))]",
              "[@media(max-width:1100px)]:[padding:65px_40px]",
              "[@media(max-width:700px)]:[padding:45px_24px]",
            ].join(" ")
          : o.grid
      }
    >
      {data.map((s) => {
        const deadline = s.applicationDeadline || s.registrationDeadline;
        const url = externalUrl(s.applicationUrl || s.registrationUrl);
        const state = sessionLifecycle(s, now);
        const label = deadlineLabel(deadline, state, now);
        const days =
          state === "OPEN" && deadline
            ? Math.max(0, Math.ceil((Date.parse(deadline) - now) / 86400000))
            : null;
        const action =
          state === "OPEN" && url ? (
            <a
              className={
                module === "training"
                  ? [
                      "absolute right-[calc(26*var(--u))] bottom-[calc(38*var(--u))]",
                      "[@media(max-width:1100px)]:right-[24px] [@media(max-width:1100px)]:bottom-[20px]",
                    ].join(" ") +
                    " " +
                    "inline-flex items-center justify-center min-h-[48px] [padding:12px_24px] [border:1px_solid_#4da6ff99] rounded-[8px] bg-brand-navy text-brand-turquoise! font-bold"
                  : `${o.pending} ${o.applicationLink}`
              }
              href={url}
            >
              {module === "training" ? "Register" : "Apply"}
            </a>
          ) : (
            <span
              className={
                module === "training"
                  ? [
                      "absolute right-[calc(26*var(--u))] bottom-[calc(38*var(--u))]",
                      "[@media(max-width:1100px)]:right-[24px] [@media(max-width:1100px)]:bottom-[20px]",
                    ].join(" ") +
                    " " +
                    "text-[#ff6767] [cursor:default]"
                  : o.closed
              }
            >
              {state === "OPEN" ? "Link not supplied" : state}
            </span>
          );
        return module === "opportunities" ? (
          <article key={s.id} className={o.call}>
            <div className={o.count}>
              <strong>{days ?? label}</strong>
              {days !== null && <span>days left</span>}
              {deadline && (
                <time dateTime={deadline}>
                  {new Date(deadline).toLocaleDateString("en-GB", {
                    timeZone: "Europe/Skopje",
                  })}
                </time>
              )}
            </div>
            <h3>{s.title}</h3>
            {s.category && <p className={o.category}>{s.category}</p>}
            {s.description && (
              <p className={o.callDescription}>{s.description}</p>
            )}
            <ul>
              {s.minimumAge != null && (
                <li>
                  Ages {s.minimumAge}
                  {s.maximumAge != null ? `–${s.maximumAge}` : "+"}
                </li>
              )}
              {(s.location || s.country) && (
                <li>{[s.location, s.country].filter(Boolean).join(", ")}</li>
              )}
              {(s.startDate || s.endDate) && (
                <li>{[s.startDate, s.endDate].filter(Boolean).join(" – ")}</li>
              )}
            </ul>
            {action}
          </article>
        ) : (
          <article
            className={[
              'relative isolate mb-[calc(120*var(--u))]! [&::before]:[content:""] [&::before]:absolute [&::before]:z-[-1] [&::before]:left-[calc(-40*var(--u))] [&::before]:right-[calc(-40*var(--u))] [&::before]:top-[calc(-40*var(--u))] [&::before]:bottom-[calc(66*var(--u))] [&::before]:[border:1px_solid_#4da6ff66] [&::before]:rounded-[calc(16*var(--u))] [&:first-child_>div:last-child>span:last-child]:[background:transparent] [&:first-child_>div:last-child>span:last-child]:text-[red] [&:first-child_>div:last-child>span:last-child]:[border-color:#212c5d] [&:last-of-type]:mb-[0]!',
              "[@media(max-width:1100px)]:mb-[65px]! [@media(max-width:1100px)]:[&::before]:left-[-15px] [@media(max-width:1100px)]:[&::before]:right-[-15px] [@media(max-width:1100px)]:[&::before]:top-[-15px] [@media(max-width:1100px)]:[&::before]:bottom-[35px] [@media(max-width:1100px)]:[&::before]:rounded-[12px]",
              "[@media(max-width:700px)]:mb-[50px]! [@media(max-width:700px)]:[&::before]:left-[-10px] [@media(max-width:700px)]:[&::before]:right-[-10px] [@media(max-width:700px)]:[&::before]:top-[-10px]",
            ].join(" ")}
            key={s.id}
          >
            <dl
              className={[
                "grid grid-cols-[repeat(4,_minmax(0,_1fr))] gap-[calc(20*var(--u))] [margin:0_0_calc(20*var(--u))]!",
                "[@media(max-width:1100px)]:gap-[12px] [@media(max-width:1100px)]:mb-[12px]!",
                "[@media(max-width:700px)]:grid-cols-[repeat(2,_minmax(0,_1fr))] [@media(max-width:700px)]:gap-[10px]",
              ].join(" ")}
            >
              {[
                ["Audience", s.audience],
                ["Format", s.format],
                ["Language", s.language],
                ["Cost", s.cost],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div
                    className={[
                      "h-[calc(180*var(--u))] [padding:calc(24*var(--u))_calc(34*var(--u))] bg-brand-blue rounded-[calc(16*var(--u))]",
                      "[@media(max-width:1100px)]:h-[auto] [@media(max-width:1100px)]:min-h-[140px] [@media(max-width:1100px)]:[padding:18px_14px] [@media(max-width:1100px)]:rounded-[12px]",
                      "[@media(max-width:700px)]:min-h-[150px] [@media(max-width:700px)]:[padding:16px_12px]",
                    ].join(" ")}
                    key={k}
                  >
                    <dt
                      className={[
                        'relative pl-[calc(24*var(--u))] text-[length:calc(20*var(--u))] leading-[calc(28*var(--u))] uppercase before:[content:""] before:w-[calc(12*var(--u))] before:h-[calc(12*var(--u))] before:[background:var(--tirkiz)] before:absolute before:left-[0] before:top-[calc(8*var(--u))]',
                        "[@media(max-width:1100px)]:pl-[16px] [@media(max-width:1100px)]:text-[length:13px] [@media(max-width:1100px)]:leading-[20px] [@media(max-width:1100px)]:before:w-[8px] [@media(max-width:1100px)]:before:h-[8px] [@media(max-width:1100px)]:before:top-[6px]",
                        "[@media(max-width:700px)]:text-[length:12px]",
                      ].join(" ")}
                    >{k}</dt>
                    <dd
                      className={[
                        "whitespace-pre-line [margin:calc(12*var(--u))_0_0_calc(24*var(--u))]! text-[length:calc(24*var(--u))] leading-[calc(28*var(--u))] font-medium",
                        "[@media(max-width:1100px)]:[margin:10px_0_0_16px]! [@media(max-width:1100px)]:text-[length:17px] [@media(max-width:1100px)]:leading-[21px] [@media(max-width:1100px)]:[overflow-wrap:anywhere]",
                        "[@media(max-width:700px)]:text-[length:16px] [@media(max-width:700px)]:leading-[21px] [@media(max-width:700px)]:ml-[0]!",
                      ].join(" ")}
                    >{v}</dd>
                  </div>
                ))}
            </dl>
            <div
              className={[
                "relative grid grid-cols-[calc(340*var(--u))_1fr] gap-[calc(42*var(--u))] min-h-[calc(368*var(--u))] [padding:calc(24*var(--u))_calc(40*var(--u))] bg-brand-blue rounded-[calc(16*var(--u))]",
                "[@media(max-width:1100px)]:grid-cols-[155px_1fr] [@media(max-width:1100px)]:gap-[24px] [@media(max-width:1100px)]:min-h-[0] [@media(max-width:1100px)]:[padding:25px_24px_85px] [@media(max-width:1100px)]:rounded-[12px]",
                "[@media(max-width:700px)]:grid-cols-[1fr] [@media(max-width:700px)]:[padding:24px_20px_88px] [@media(max-width:700px)]:gap-[24px]",
              ].join(" ")}
            >
              <div
                className={
                  "[@media(max-width:700px)]:flex [@media(max-width:700px)]:gap-[18px] [@media(max-width:700px)]:items-center"
                }
              >
                <div
                  className={[
                    "[border-right:1px_solid_#212c5d80] min-h-[calc(88*var(--u))] pt-[calc(10*var(--u))]",
                    "[@media(max-width:1100px)]:min-h-[70px] [@media(max-width:1100px)]:pt-[4px]",
                    "[@media(max-width:700px)]:w-[125px] [@media(max-width:700px)]:shrink-0 [@media(max-width:700px)]:[border:0] [@media(max-width:700px)]:h-[auto]",
                  ].join(" ")}
                >
                  <strong
                    className={[
                      "block text-[length:calc(46*var(--u))] leading-[calc(46*var(--u))] font-bold",
                      "[@media(max-width:1100px)]:text-[length:28px] [@media(max-width:1100px)]:leading-[32px]",
                      "[@media(max-width:700px)]:text-[length:26px]",
                    ].join(" ")}
                  >{days ?? label}</strong>
                  {days !== null && (
                    <span
                      className={[
                        "text-[length:calc(24*var(--u))] leading-[calc(28*var(--u))]",
                        "[@media(max-width:1100px)]:text-[length:18px] [@media(max-width:1100px)]:leading-[22px]",
                      ].join(" ")}
                    >days left</span>
                  )}
                  {deadline && (
                    <time
                      className={"block text-[length:14px] leading-[1.4]"}
                      dateTime={deadline}
                    >
                      {new Date(deadline).toLocaleDateString("en-GB", {
                        timeZone: "Europe/Skopje",
                      })}
                    </time>
                  )}
                </div>
                {s.category && (
                  <p
                    className={[
                      "whitespace-pre-line uppercase text-white w-[calc(278*var(--u))] [border-top:1px_solid_#212c5d80] mt-[calc(32*var(--u))]! pt-[calc(18*var(--u))] text-[length:calc(20*var(--u))] leading-[calc(24*var(--u))] font-bold",
                      "[@media(max-width:1100px)]:w-[140px] [@media(max-width:1100px)]:mt-[20px]! [@media(max-width:1100px)]:pt-[16px] [@media(max-width:1100px)]:text-[length:15px] [@media(max-width:1100px)]:leading-[20px]",
                      "[@media(max-width:700px)]:[border-top:0] [@media(max-width:700px)]:[border-left:1px_solid_#212c5d80] [@media(max-width:700px)]:[padding:0_0_0_18px] [@media(max-width:700px)]:[margin:0]! [@media(max-width:700px)]:w-[auto] [@media(max-width:700px)]:text-[length:13px] [@media(max-width:700px)]:leading-[17px]",
                    ].join(" ")}
                  >{s.category}</p>
                )}
              </div>
              <div className={""}>
                <h3
                  className={[
                    "whitespace-pre-line uppercase text-white text-[length:calc(36*var(--u)_-_2px)] leading-[calc(42*var(--u))] font-bold [letter-spacing:calc(0.6*var(--u))] [margin:calc(6*var(--u))_0_calc(20*var(--u))]!",
                    "[@media(max-width:1100px)]:text-[length:22px] [@media(max-width:1100px)]:leading-[28px] [@media(max-width:1100px)]:[margin:0_0_18px]! [@media(max-width:1100px)]:whitespace-normal [@media(max-width:1100px)]:[letter-spacing:0]",
                    "[@media(max-width:700px)]:text-[length:21px] [@media(max-width:700px)]:leading-[28px]",
                  ].join(" ")}
                >{s.title}</h3>
                {s.description && (
                  <p
                    className={[
                      "text-[length:calc(20*var(--u))] leading-[calc(26*var(--u))] mt-[calc(14*var(--u))]!",
                      "[@media(max-width:1100px)]:text-[length:16px] [@media(max-width:1100px)]:leading-[22px] [@media(max-width:1100px)]:mt-[14px]!",
                    ].join(" ")}
                  >{s.description}</p>
                )}
                {s.learningObjectives && (
                  <p
                    className={[
                      "text-[length:calc(20*var(--u))] leading-[calc(26*var(--u))] mt-[calc(14*var(--u))]!",
                      "[@media(max-width:1100px)]:text-[length:16px] [@media(max-width:1100px)]:leading-[22px] [@media(max-width:1100px)]:mt-[14px]!",
                    ].join(" ")}
                  >
                    <strong>WHAT YOU WILL LEARN:</strong> {s.learningObjectives}
                  </p>
                )}
                {s.trainingMethods && (
                  <p
                    className={[
                      "text-[length:calc(20*var(--u))] leading-[calc(26*var(--u))] mt-[calc(14*var(--u))]!",
                      "[@media(max-width:1100px)]:text-[length:16px] [@media(max-width:1100px)]:leading-[22px] [@media(max-width:1100px)]:mt-[14px]!",
                    ].join(" ")}
                  >
                    <strong>HOW WE TEACH IT:</strong> {s.trainingMethods}
                  </p>
                )}
                <ul
                  className={[
                    "flex flex-wrap gap-[calc(28*var(--u))] [margin:calc(40*var(--u))_calc(150*var(--u))_0_0]! [padding:0] [list-style:none] text-[length:calc(20*var(--u))] leading-[calc(28*var(--u))] font-medium",
                    "[@media(max-width:1100px)]:[margin:24px_0_0]! [@media(max-width:1100px)]:gap-[10px_18px] [@media(max-width:1100px)]:text-[length:14px] [@media(max-width:1100px)]:leading-[20px]",
                    "[@media(max-width:700px)]:grid [@media(max-width:700px)]:gap-[8px]",
                  ].join(" ")}
                >
                  {s.location && (
                    <li
                      className={[
                        'before:[content:""] before:w-[calc(12*var(--u))] before:h-[calc(12*var(--u))] before:[background:var(--tirkiz)] before:absolute before:left-[0] before:top-[calc(8*var(--u))] relative pl-[calc(20*var(--u))]',
                        "[@media(max-width:1100px)]:before:w-[8px] [@media(max-width:1100px)]:before:h-[8px] [@media(max-width:1100px)]:before:top-[6px] [@media(max-width:1100px)]:pl-[15px]",
                      ].join(" ")}
                    >{s.location}</li>
                  )}
                  {(s.startDate || s.endDate) && (
                    <li
                      className={[
                        'before:[content:""] before:w-[calc(12*var(--u))] before:h-[calc(12*var(--u))] before:[background:var(--tirkiz)] before:absolute before:left-[0] before:top-[calc(8*var(--u))] relative pl-[calc(20*var(--u))]',
                        "[@media(max-width:1100px)]:before:w-[8px] [@media(max-width:1100px)]:before:h-[8px] [@media(max-width:1100px)]:before:top-[6px] [@media(max-width:1100px)]:pl-[15px]",
                      ].join(" ")}
                    >
                    {[s.startDate, s.endDate].filter(Boolean).join(" – ")}
                  </li>
                  )}
                </ul>
              </div>
              {action}
            </div>
          </article>
        );
      })}
    </div>
  );
}
