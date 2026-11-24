"use client";
import { useState } from "react";

export default function PartnerFormNotice() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button
        type="button"
        className="flex items-center justify-center gap-[calc(18*var(--u))] min-h-[calc(64*var(--u))] [padding:calc(10*var(--u))] rounded-[calc(7*var(--u))] uppercase font-bold! whitespace-nowrap text-[length:calc(16*var(--u))]! [border:1px_solid_#ffffffb3] [background:transparent] text-surface [&:not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:bg-brand-blue [&:not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:text-brand-navy! [&:not([aria-disabled=true]):is(:hover,:active,:focus-visible)]:[border-color:var(--color-brand-blue)] [@media(max-width:1100px)]:whitespace-normal [@media(max-width:1100px)]:text-[length:12px]! [@media(max-width:1100px)]:min-h-[44px] [@media(max-width:768px)]:text-[length:14px]! [@media(max-width:768px)]:[padding:12px] [@media(max-width:768px)]:rounded-[6px]"
        aria-describedby={visible ? "partner-form-notice" : undefined}
        onClick={() => setVisible(true)}
      >
        Fill in partner information form
      </button>
      {visible && (
        <p
          id="partner-form-notice"
          role="status"
          className="focus-visible:[outline:2px_solid_var(--color-brand-turquoise)] focus-visible:[outline-offset:4px] text-brand-turquoise text-[length:max(12px,_calc(18*var(--u)))] leading-[1.4] [@media(max-width:768px)]:text-[length:13px]"
        >
          The partner information form is not available in this preview.
        </p>
      )}
    </>
  );
}
