"use client";
import { useRef, useState, type FormEvent } from "react";
import styles from "@/app/contact/page.module.css";

const fields = [
  {
    name: "first_name",
    label: "First Name",
    placeholder: "Carlos",
    required: true,
    autoComplete: "given-name",
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "Rodriguez",
    required: true,
    autoComplete: "family-name",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "carlos@example.com",
    required: true,
    type: "email",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone",
    placeholder: "+34 00 000 000",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "country",
    label: "Country",
    placeholder: "Spain",
    autoComplete: "country-name",
  },
  {
    name: "subject",
    label: "Subject",
    placeholder: "Possible Partnership",
    required: true,
  },
];

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const submitting = useRef(false);
  const status = useRef<HTMLParagraphElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const input = form.elements.namedItem(field.name) as HTMLInputElement;
      if (field.required && !input.value.trim())
        nextErrors[field.name] = `${field.label} is required.`;
      else if (field.type === "email" && input.validity.typeMismatch)
        nextErrors[field.name] = "Enter a valid email address.";
    }
    const upload = form.elements.namedItem("documentation") as HTMLInputElement;
    if (
      Array.from(upload.files ?? []).some(
        (file) =>
          !/\.(pdf|doc|docx)$/i.test(file.name) || file.size > 5 * 1024 * 1024,
      )
    ) {
      nextErrors.documentation =
        "Choose PDF, DOC or DOCX files, up to 5 MB each.";
    }
    setErrors(nextErrors);
    setNotice("");
    const first = Object.keys(nextErrors)[0];
    if (first) (form.elements.namedItem(first) as HTMLInputElement).focus();
    else {
      submitting.current = true;
      setSending(true);
      try {
        const body = new FormData(form);
        if (!upload.files?.length) body.delete("documentation");
        const response = await fetch(
          "/api/enquiries",
          {
            method: "POST",
            body,
          },
        );
        if (!response.ok) throw new Error("Submission failed");
        form.reset();
        setFiles([]);
        setNotice("Thank you. Your enquiry has been sent successfully.");
      } catch {
        setNotice(
          "Your enquiry could not be sent. Please try again or email contact@ekebitola.org.",
        );
      } finally {
        submitting.current = false;
        setSending(false);
      }
      requestAnimationFrame(() => status.current?.focus());
    }
  }

  return (
    <form
      className={styles.form}
      aria-busy={sending}
      noValidate
      onSubmit={submit}
      aria-labelledby="enquiry-title"
      aria-describedby="submission-note"
    >
      <h2 id="enquiry-title" className={styles.label}>
        Direct Enquiry
      </h2>
      <div className={styles.fields}>
        {fields.map((field) => (
          <div key={field.name} className={styles.field}>
            <div className={styles.inputLine}>
              <label htmlFor={field.name}>
                {field.label}
                {field.required ? "*" : ""}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                required={field.required}
                autoComplete={field.autoComplete}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
                onInput={() =>
                  setErrors((previous) => ({ ...previous, [field.name]: "" }))
                }
              />
            </div>
            {errors[field.name] && (
              <p className={styles.error} id={`${field.name}-error`}>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
        <fieldset className={styles.interest}>
          <legend className={styles.srOnly}>Enquiry type</legend>
          <label>
            <input
              type="radio"
              name="partner_opportunity"
              value="partner"
              defaultChecked
            />{" "}
            Partner
          </label>
          <label>
            <input
              type="radio"
              name="partner_opportunity"
              value="opportunities"
            />{" "}
            Opportunities
          </label>
        </fieldset>
        <div className={styles.upload}>
          <label className={styles.uploadButton} htmlFor="documentation">
            Upload file
            <input
              id="documentation"
              name="documentation"
              type="file"
              accept=".pdf,.doc,.docx"
              aria-describedby={`file-help${errors.documentation ? " documentation-error" : ""}`}
              aria-invalid={!!errors.documentation}
              onChange={(event) => {
                setFiles(
                  Array.from(event.target.files ?? []).map((file) => file.name),
                );
                setErrors((previous) => ({ ...previous, documentation: "" }));
              }}
            />
          </label>
          <span id="file-help">PDF, DOC, DOCX (up to 5 MB each)</span>
          {files.length > 0 && (
            <p className={styles.fileNames}>{files.join(", ")}</p>
          )}
          {errors.documentation && (
            <p className={styles.error} id="documentation-error">
              {errors.documentation}
            </p>
          )}
        </div>
      </div>
      <label htmlFor="message" className={styles.srOnly}>
        Your Message
      </label>
      <textarea
        id="message"
        name="message"
        placeholder="Your Message..."
        className={styles.message}
      />
      <div className={styles.submitRow}>
        <button type="submit" disabled={sending}>
          {sending ? "Sending…" : "Submit"}
        </button>
        <p id="submission-note" className={styles.notice}>
          We will respond to the email address you provide.
        </p>
      </div>
      <p ref={status} role="status" tabIndex={-1} className={styles.notice}>
        {notice}
      </p>
    </form>
  );
}
