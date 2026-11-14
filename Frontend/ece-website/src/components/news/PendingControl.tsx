"use client";

import { useState, type ReactNode } from "react";
import styles from "@/app/news/page.module.css";

export default function PendingControl({ children, message, className = "", label }: {
  children: ReactNode; message: string; className?: string; label: string;
}) {
  const [open, setOpen] = useState(false);
  return <span className={`${styles.pending} ${className}`}>
    <button type="button" aria-label={label} aria-disabled="true" onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>
      {children}
    </button>
    <span className={`${styles.notice} ${open ? styles.noticeOpen : ""}`} role="status">{message}</span>
  </span>;
}
