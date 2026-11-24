"use client";

import { useState, type ReactNode } from "react";

export default function PendingControl({
  children,
  message,
  className = "",
  label,
}: {
  children: ReactNode;
  message: string;
  className?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className={`group/pending relative inline-flex ${className}`}>
      <button
        className="[border:0] bg-transparent text-inherit"
        type="button"
        aria-label={label}
        aria-disabled="true"
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </button>
      <span
        className={`absolute z-[5] bottom-[calc(100%+8px)] left-1/2 [transform:translateX(-50%)] w-[220px] p-[12px] rounded-[8px] bg-brand-navy text-white text-[14px] leading-[1.4] text-center [box-shadow:0_2px_12px_#0003] ${open ? "block" : "hidden group-[:hover]/pending:block group-focus-within/pending:block"}`}
        role="status"
      >
        {message}
      </span>
    </span>
  );
}
