"use client";
import { useRef, useState, type FormEvent } from "react";
import styles from "@/app/contact/page.module.css";

const fields = [
  {
    name: "firstName",
    label: "First Name",
    placeholder: "Carlos",
    required: true,
    autoComplete: "given-name",
  },
  {
    name: "lastName",
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
const pendingMessage =
  "Preview only: submission is unavailable until integration is complete. Nothing has been sent.";

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const status = useRef<HTMLParagraphElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const input = form.elements.namedItem(field.name) as HTMLInputElement;
      if (field.required && !input.value.trim())
        nextErrors[field.name] = `${field.label} is required.`;
      else if (field.type === "email" && input.validity.typeMismatch)
        nextErrors[field.name] = "Enter a valid email address.";
    }
    const upload = form.elements.namedItem("attachments") as HTMLInputElement;
    if (
      Array.from(upload.files ?? []).some(
        (file) =>
          !/\.(pdf|doc|docx)$/i.test(file.name) || file.size > 5 * 1024 * 1024,
      )
    ) {
      nextErrors.attachments =
        "Choose PDF, DOC or DOCX files, up to 5 MB each.";
    }
    setErrors(nextErrors);
    setNotice("");
    const first = Object.keys(nextErrors)[0];
    if (first) (form.elements.namedItem(first) as HTMLInputElement).focus();
    else {
      setNotice(pendingMessage);
      requestAnimationFrame(() => status.current?.focus());
    }
  }

  return (
    <form
      className={styles.form}
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
              name="interest"
              value="partner"
              defaultChecked
            />{" "}
            Partner
          </label>
          <label>
            <input type="radio" name="interest" value="opportunities" />{" "}
            Opportunities
          </label>
        </fieldset>
        <div className={styles.upload}>
          <label className={styles.uploadButton} htmlFor="attachments">
            Upload file
            <input
              id="attachments"
              name="attachments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              aria-describedby={`file-help${errors.attachments ? " attachments-error" : ""}`}
              aria-invalid={!!errors.attachments}
              onChange={(event) => {
                setFiles(
                  Array.from(event.target.files ?? []).map((file) => file.name),
                );
                setErrors((previous) => ({ ...previous, attachments: "" }));
              }}
            />
          </label>
          <span id="file-help">PDF, DOC, DOCX (up to 5 MB each)</span>
          {files.length > 0 && (
            <p className={styles.fileNames}>{files.join(", ")}</p>
          )}
          {errors.attachments && (
            <p className={styles.error} id="attachments-error">
              {errors.attachments}
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
        <button type="submit">Submit</button>
        <p id="submission-note" className={styles.notice}>
          Preview only — submission unavailable.
        </p>
      </div>
      <p ref={status} role="status" tabIndex={-1} className={styles.notice}>
        {notice}
      </p>
    </form>
  );
}
