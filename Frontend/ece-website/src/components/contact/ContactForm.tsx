"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";

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

type SubmissionState = "idle" | "submitting" | "success" | "error";
type FailureKind = "validation" | "network" | "timeout" | "server" | "response";
const errorClass =
  "text-[#ffbdbd] text-[length:max(12px,calc(16*var(--u)))] mt-1.5";
const focusClass =
  "focus-visible:outline-2 focus-visible:outline-brand-turquoise focus-visible:outline-offset-4";
const attachmentError = "Choose a PDF, DOC or DOCX file up to 5 MB.";

function validateInput(input: HTMLInputElement) {
  const field = fields.find((item) => item.name === input.name);
  if (field?.required && !input.value.trim())
    return field.label + " is required.";
  if (input.name === "email" && input.validity.typeMismatch)
    return "Enter a valid email address.";
  if (
    input.name === "documentation" &&
    Array.from(input.files ?? []).some(
      (file) =>
        !/\.(pdf|doc|docx)$/i.test(file.name) || file.size > 5 * 1024 * 1024,
    )
  )
    return attachmentError;
  return "";
}

function reveal(element: HTMLElement | null) {
  if (!element) return;
  element.focus({ preventScroll: true });
  element.scrollIntoView({
    block: "nearest",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [failure, setFailure] = useState<FailureKind>("server");
  const sending = state === "submitting";
  const submitting = useRef(false);
  const status = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state !== "success" && state !== "error") return;
    const frame = requestAnimationFrame(() => reveal(status.current));
    return () => cancelAnimationFrame(frame);
  }, [state]);

  function editInput(input: HTMLInputElement, blurred = false) {
    if (state === "success") setState("idle");
    setErrors((previous) =>
      blurred || previous[input.name]
        ? { ...previous, [input.name]: validateInput(input) }
        : previous,
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const input = form.elements.namedItem(field.name) as HTMLInputElement;
      const error = validateInput(input);
      if (error) nextErrors[field.name] = error;
    }
    const selection = (
      form.elements.namedItem("partner_opportunity") as RadioNodeList
    ).value;
    if (!["partner", "opportunities"].includes(selection))
      nextErrors.partner_opportunity = "Choose Partner or Opportunities.";
    const upload = uploadRef.current!;
    const fileError = validateInput(upload);
    if (fileError) nextErrors.documentation = fileError;
    setErrors(nextErrors);
    setState("idle");
    const first = Object.keys(nextErrors)[0];
    if (first) {
      const element =
        first === "partner_opportunity"
          ? form.querySelector<HTMLInputElement>(
              'input[name="partner_opportunity"]',
            )
          : (form.elements.namedItem(first) as HTMLInputElement);
      reveal(element);
      return;
    }

    const body = new FormData(form);
    if (!upload.files?.length) body.delete("documentation");
    submitting.current = true;
    setState("submitting");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        body,
        signal: controller.signal,
      });
      if (!response.ok) {
        setFailure(
          response.status === 400 || response.status === 422
            ? "validation"
            : "server",
        );
        setState("error");
      } else {
        // n8n's confirmed response contract: { success: boolean, message: string }.
        // Do not render upstream text, or treat a 200 response alone as success.
        const result: unknown = await response.json().catch(() => null);
        if (controller.signal.aborted) throw new Error("Request timed out");
        if (
          typeof result !== "object" ||
          result === null ||
          !("success" in result) ||
          result.success !== true
        ) {
          setFailure("response");
          setState("error");
        } else {
          form.reset();
          setFileName("");
          setErrors({});
          setState("success");
        }
      }
    } catch {
      setFailure(controller.signal.aborted ? "timeout" : "network");
      setState("error");
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
    }
  }

  return (
    <form
      className="min-w-0"
      aria-busy={sending}
      noValidate
      onSubmit={submit}
      aria-labelledby="enquiry-title"
      aria-describedby="required-note submission-note"
    >
      <h2
        id="enquiry-title"
        className="text-[length:calc(22*var(--u)_-_2px)] leading-[1.3] font-bold uppercase [@media(max-width:1100px)]:text-[length:14px]"
      >
        Direct Enquiry
      </h2>
      <p id="required-note" className="mt-3 text-sm text-surface/75">
        Fields marked with an asterisk (*) are required.
      </p>
      <fieldset disabled={sending} className="m-0 min-w-0 border-0 p-0">
        <div className="grid grid-cols-[repeat(2,_minmax(0,_1fr))] gap-x-[calc(39*var(--u))] gap-y-[calc(22*var(--u))] mt-[calc(55*var(--u))] [@media(max-width:768px)]:mt-[26px] [@media(max-width:768px)]:gap-[20px] [@media(max-width:480px)]:grid-cols-[1fr]">
          {fields.map((field) => (
            <div key={field.name}>
              <div className="flex gap-[calc(13*var(--u))] items-center [border-bottom:1px_solid_#ffffff66] min-h-[calc(47*var(--u))] [&:has([aria-invalid=true])]:[border-color:#ffbdbd] [@media(max-width:1100px)]:flex-col [@media(max-width:1100px)]:items-stretch [@media(max-width:1100px)]:gap-[4px]">
                <label
                  htmlFor={field.name}
                  className="shrink-0 text-[length:calc(20*var(--u))] text-brand-blue [@media(max-width:1100px)]:text-[length:16px]"
                >
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
                  onInput={(event) => editInput(event.currentTarget)}
                  onBlur={(event) => editInput(event.currentTarget, true)}
                  className="focus-visible:outline-2 focus-visible:outline-brand-turquoise focus-visible:outline-offset-4 scroll-mt-8 w-full min-w-0 [background:transparent] [border:0] text-surface [font-family:inherit] [font-style:inherit] [font-variant:inherit] [font-weight:inherit] [font-stretch:inherit] leading-[inherit] text-[length:calc(18*var(--u))] [padding:calc(8*var(--u))_0] placeholder:[color:#aab4d1] placeholder:opacity-100 [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:768px)]:min-h-[44px]"
                />
              </div>
              {errors[field.name] && (
                <p
                  className="[color:#ffbdbd] text-[length:max(12px,_calc(16*var(--u)))] mt-[6px]!"
                  id={`${field.name}-error`}
                >
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
          <fieldset
            aria-describedby={
              errors.partner_opportunity
                ? "partner_opportunity-error"
                : undefined
            }
            aria-invalid={!!errors.partner_opportunity}
            className={
              "min-w-0 m-0 border rounded-md p-3 text-brand-blue " +
              (errors.partner_opportunity
                ? "border-[#ffbdbd]"
                : "border-transparent")
            }
          >
            <legend className="px-1 text-sm text-surface/75">
              Enquiry type*
            </legend>
            <div className="flex flex-wrap gap-5">
              {[
                ["partner", "Partner"],
                ["opportunities", "Opportunities"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-11 items-center gap-3 text-[length:max(16px,calc(20*var(--u)))]"
                >
                  <input
                    type="radio"
                    name="partner_opportunity"
                    value={value}
                    required
                    aria-describedby={
                      errors.partner_opportunity
                        ? "partner_opportunity-error"
                        : undefined
                    }
                    onChange={() => {
                      setErrors((previous) => ({
                        ...previous,
                        partner_opportunity: "",
                      }));
                      if (state === "success") setState("idle");
                    }}
                    className={
                      "size-5 shrink-0 appearance-none rounded-full border-[3px] border-brand-blue checked:bg-[radial-gradient(circle,var(--color-brand-blue)_0_35%,transparent_40%)] " +
                      focusClass
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            {errors.partner_opportunity && (
              <p id="partner_opportunity-error" className={errorClass}>
                {errors.partner_opportunity}
              </p>
            )}
          </fieldset>
          <div className="flex items-center flex-wrap gap-[calc(17*var(--u))] mt-[calc(8*var(--u))] [@media(max-width:768px)]:gap-[10px] [@media(max-width:768px)]:m-0">
            <label
              className="has-[[aria-invalid=true]]:outline-2 has-[[aria-invalid=true]]:outline-[#ffbdbd] has-[[aria-invalid=true]]:outline-offset-4 [&:is(:hover,:active,:focus-within)]:text-brand-turquoise relative text-brand-blue underline text-[length:calc(20*var(--u))] cursor-pointer focus-within:[outline:2px_solid_var(--color-brand-turquoise)] focus-within:[outline-offset:4px] [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:768px)]:[padding:10px_0]"
              htmlFor="documentation"
            >
              Upload file
              <input
                ref={uploadRef}
                id="documentation"
                name="documentation"
                type="file"
                accept=".pdf,.doc,.docx"
                aria-describedby={`file-help${errors.documentation ? " documentation-error" : ""}`}
                aria-invalid={!!errors.documentation}
                onChange={(event) => {
                  setFileName(event.currentTarget.files?.[0]?.name ?? "");
                  editInput(event.currentTarget, true);
                }}
                className="absolute [inset:0] opacity-0 w-full cursor-pointer"
              />
            </label>
            <span
              id="file-help"
              className="text-[length:calc(16*var(--u))] [color:#aab4d1] [@media(max-width:1100px)]:text-[length:12px]"
            >
              PDF, DOC, DOCX · one file, up to 5 MB
            </span>
            {fileName && (
              <div className="flex w-full min-w-0 flex-wrap items-center gap-3 text-sm">
                <span className="min-w-0 break-all">{fileName}</span>
                <button
                  type="button"
                  className={
                    "min-h-11 px-2 text-brand-turquoise underline " + focusClass
                  }
                  aria-label={"Remove attachment " + fileName}
                  onClick={() => {
                    if (uploadRef.current) uploadRef.current.value = "";
                    setFileName("");
                    setErrors((previous) => ({
                      ...previous,
                      documentation: "",
                    }));
                    uploadRef.current?.focus();
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            {errors.documentation && (
              <p
                className="[color:#ffbdbd] text-[length:max(12px,_calc(16*var(--u)))] mt-[6px]!"
                id="documentation-error"
              >
                {errors.documentation}
              </p>
            )}
          </div>
        </div>
        <label
          htmlFor="message"
          className="absolute w-[1px] h-[1px] p-0 [margin:-1px] overflow-hidden [clip-path:inset(50%)] whitespace-nowrap [border:0]"
        >
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Your Message..."
          className="block w-full h-[calc(184*var(--u))] mt-[calc(57*var(--u))] [padding:calc(28*var(--u))_calc(20*var(--u))] [border:1px_solid_#ddd] rounded-[calc(7*var(--u))] bg-surface text-brand-navy [font-family:inherit] [font-style:inherit] [font-variant:inherit] [font-weight:inherit] [font-stretch:inherit] leading-[inherit] text-[length:calc(18*var(--u))] resize-y placeholder:text-brand-navy placeholder:opacity-100 [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:768px)]:mt-[30px] [@media(max-width:768px)]:h-[184px] [@media(max-width:768px)]:[padding:18px] [@media(max-width:768px)]:rounded-[6px]"
        />
      </fieldset>
      <div className="flex items-center gap-[calc(34*var(--u))] mt-[calc(16*var(--u))] [@media(max-width:768px)]:gap-[20px] [@media(max-width:768px)]:mt-[16px] [@media(max-width:768px)]:items-start">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex w-[184px] shrink-0 [@media(max-width:768px)]:w-[148px] justify-center items-center gap-2 disabled:cursor-wait disabled:opacity-75 [&:is(:hover,:active,:focus-visible)]:bg-brand-blue [&:is(:hover,:active,:focus-visible)]:text-brand-navy! [&:is(:hover,:active,:focus-visible)]:[border-color:var(--color-brand-blue)] bg-surface text-brand-navy [border:0] rounded-[calc(5*var(--u))] [padding:calc(10*var(--u))_calc(25*var(--u))] text-[length:calc(18*var(--u))]! leading-[1.35]! font-bold! uppercase [@media(max-width:1100px)]:text-[length:14px]! [@media(max-width:1100px)]:min-h-[44px] [@media(max-width:768px)]:[padding:10px_22px] [@media(max-width:768px)]:rounded-[5px]"
        >
          {sending && (
            <span
              aria-hidden="true"
              className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
            />
          )}
          {sending ? "Sending..." : "Submit"}
        </button>
        <p
          id="submission-note"
          className="focus-visible:[outline:2px_solid_var(--color-brand-turquoise)] focus-visible:[outline-offset:4px] text-brand-turquoise text-[length:max(12px,_calc(18*var(--u)))] leading-[1.4] [@media(max-width:768px)]:text-[length:13px]"
        >
          We will respond to the email address you provide.
        </p>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {sending ? "Sending your enquiry. Please wait." : ""}
      </p>
      {(state === "success" || state === "error") && (
        <div
          ref={status}
          id="submission-feedback"
          tabIndex={-1}
          role={state === "error" ? "alert" : "status"}
          className={
            "mt-5 flex scroll-mt-8 items-start gap-3 rounded-lg border p-4 sm:p-5 " +
            focusClass +
            (state === "success"
              ? " border-brand-turquoise/50 bg-brand-turquoise/10"
              : " border-[#ffbdbd]/60 bg-[#ffbdbd]/10")
          }
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className={
              "mt-0.5 size-6 shrink-0 " +
              (state === "success" ? "text-brand-turquoise" : "text-[#ffbdbd]")
            }
          >
            <circle cx="12" cy="12" r="9" />
            <path
              d={state === "success" ? "m7.5 12 3 3 6-6" : "M12 7v6m0 3v1"}
            />
          </svg>
          <div className="min-w-0 text-sm leading-relaxed sm:text-base">
            <h3
              className={
                "font-bold " +
                (state === "success"
                  ? "text-brand-turquoise"
                  : "text-[#ffbdbd]")
              }
            >
              {state === "success"
                ? "Enquiry submitted successfully!"
                : "We couldn't send your enquiry."}
            </h3>
            {state === "success" ? (
              <p className="mt-2">
                Thank you for reaching out to EKE. Our team has received your
                enquiry and will get back to you within 3 working days.
              </p>
            ) : (
              <>
                <p className="mt-2">
                  {failure === "validation"
                    ? "Please check your enquiry details and attachment, then try again."
                    : failure === "timeout"
                      ? "Delivery could not be confirmed because the request timed out. Your enquiry may have been received. Please contact us before trying again."
                      : failure === "network"
                        ? "A connection problem prevented us from confirming delivery. Please check your connection before trying again."
                        : "Something went wrong while submitting your enquiry. Please try again."}
                </p>
                <p className="mt-2">
                  You can contact us directly at{" "}
                  <a
                    className={
                        "break-words text-brand-turquoise underline " + focusClass
                    }
                    href="mailto:contact@ekebitola.org"
                  >
                    contact@ekebitola.org
                  </a>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
