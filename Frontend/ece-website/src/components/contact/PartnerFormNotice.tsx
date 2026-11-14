"use client";
import { useState } from "react";
import styles from "@/app/contact/page.module.css";

export default function PartnerFormNotice() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button
        type="button"
        className={styles.partnerButton}
        aria-describedby={visible ? "partner-form-notice" : undefined}
        onClick={() => setVisible(true)}
      >
        Fill in partner information form
      </button>
      {visible && (
        <p id="partner-form-notice" role="status" className={styles.notice}>
          The partner information form is not available in this preview.
        </p>
      )}
    </>
  );
}
