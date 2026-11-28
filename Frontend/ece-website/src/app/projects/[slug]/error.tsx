"use client";
import Link from "next/link";
export default function ProjectError({ reset }: { reset: () => void }) {
  return <main id="main" className="min-h-[65vh] px-[24px] pt-[180px]">
    <h1>Project could not be loaded</h1>
    <p role="alert">The project service is temporarily unavailable. Please try again.</p>
    <button onClick={reset}>Try again</button>{" "}<Link href="/projects/">Back to Projects</Link>
  </main>;
}
