"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/api/use-api";
import { externalUrl } from "@/lib/api/client";
import { deadlineLabel, sessionLifecycle, type SessionRecord } from "@/lib/api/sessions";
import o from "@/app/opportunities/page.module.css";
import t from "@/app/training/page.module.css";
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
    <div className={module === "training" ? t.sessionList : o.grid}>
      {data.map((s) => {
        const deadline = s.applicationDeadline || s.registrationDeadline;
        const url = externalUrl(s.applicationUrl || s.registrationUrl);
        const state = sessionLifecycle(s, now);
        const label = deadlineLabel(deadline, state, now);
        const days = state === "OPEN" && deadline ? Math.max(0, Math.ceil((Date.parse(deadline) - now)/86400000)) : null;
        const action =
          state === "OPEN" && url ? (
            <a
              className={module === "training" ? `${t.status} ${t.registrationLink}` : `${o.pending} ${o.applicationLink}`}
              href={url}
            >
              {module === "training" ? "Register" : "Apply"}
            </a>
          ) : (
            <span className={module === "training" ? `${t.status} ${t.closed}` : o.closed}>
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
            {s.description && <p className={o.callDescription}>{s.description}</p>}
            <ul>
              {s.minimumAge != null && (
                <li>
                  Ages {s.minimumAge}
                  {s.maximumAge != null ? `–${s.maximumAge}` : "+"}
                </li>
              )}
              {(s.location || s.country) && <li>{[s.location, s.country].filter(Boolean).join(", ")}</li>}
              {(s.startDate || s.endDate) && <li>{[s.startDate, s.endDate].filter(Boolean).join(" – ")}</li>}
            </ul>
            {action}
          </article>
        ) : (
          <article className={t.session} key={s.id}>
            <dl className={t.facts}>
              {[
                ["Audience", s.audience],
                ["Format", s.format],
                ["Language", s.language],
                ["Cost", s.cost],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
            <div className={t.sessionBody}>
              <div className={t.sessionAside}>
                <div className={t.countdown}>
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
                {s.category && <p>{s.category}</p>}
              </div>
              <div className={t.sessionContent}>
                <h3>{s.title}</h3>
                {s.description && <p>{s.description}</p>}
                {s.learningObjectives && (
                  <p>
                    <strong>WHAT YOU WILL LEARN:</strong> {s.learningObjectives}
                  </p>
                )}
                {s.trainingMethods && (
                  <p>
                    <strong>HOW WE TEACH IT:</strong> {s.trainingMethods}
                  </p>
                )}
                <ul>
                  {s.location && <li>{s.location}</li>}
                  {(s.startDate || s.endDate) && <li>
                    {[s.startDate, s.endDate].filter(Boolean).join(" – ")}
                  </li>}
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
