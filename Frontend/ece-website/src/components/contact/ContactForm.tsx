"use client";
import { useRef, useState, type FormEvent } from "react";

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
      className="min-w-0"
      noValidate
      onSubmit={submit}
      aria-labelledby="enquiry-title"
      aria-describedby="submission-note"
    >
      <h2
        id="enquiry-title"
        className="text-[length:calc(22*var(--u)_-_2px)] leading-[1.3] font-bold uppercase [@media(max-width:1100px)]:text-[length:14px]"
      >
        Direct Enquiry
      </h2>
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
                onInput={() =>
                  setErrors((previous) => ({ ...previous, [field.name]: "" }))
                }
                className="w-full min-w-0 [background:transparent] [border:0] text-surface [font-family:inherit] [font-style:inherit] [font-variant:inherit] [font-weight:inherit] [font-stretch:inherit] leading-[inherit] text-[length:calc(18*var(--u))] [padding:calc(8*var(--u))_0] placeholder:[color:#aab4d1] placeholder:opacity-100 [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:768px)]:min-h-[44px]"
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
        <fieldset className="flex flex-wrap gap-[calc(35*var(--u))] [border:0] [margin:calc(8*var(--u))_0_0] p-0 text-brand-blue text-[length:calc(20*var(--u))] [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:768px)]:gap-[18px] [@media(max-width:768px)]:m-0">
          <legend className="absolute w-[1px] h-[1px] p-0 [margin:-1px] overflow-hidden [clip-path:inset(50%)] whitespace-nowrap [border:0]">
            Enquiry type
          </legend>
          <label className="flex items-center gap-[calc(13*var(--u))] [@media(max-width:1100px)]:min-h-[44px]">
            <input
              type="radio"
              name="interest"
              value="partner"
              defaultChecked
              className="appearance-none w-[calc(22*var(--u))] h-[calc(22*var(--u))] [border:3px_solid_var(--color-brand-blue)] rounded-[50%] m-0 checked:[background:radial-gradient(circle,_var(--color-brand-blue)_0_35%,_transparent_40%)] [@media(max-width:1100px)]:w-[20px] [@media(max-width:1100px)]:h-[20px]"
            />{" "}
            Partner
          </label>
          <label className="flex items-center gap-[calc(13*var(--u))] [@media(max-width:1100px)]:min-h-[44px]">
            <input
              type="radio"
              name="interest"
              value="opportunities"
              className="appearance-none w-[calc(22*var(--u))] h-[calc(22*var(--u))] [border:3px_solid_var(--color-brand-blue)] rounded-[50%] m-0 checked:[background:radial-gradient(circle,_var(--color-brand-blue)_0_35%,_transparent_40%)] [@media(max-width:1100px)]:w-[20px] [@media(max-width:1100px)]:h-[20px]"
            />{" "}
            Opportunities
          </label>
        </fieldset>
        <div className="flex items-center flex-wrap gap-[calc(17*var(--u))] mt-[calc(8*var(--u))] [@media(max-width:768px)]:gap-[10px] [@media(max-width:768px)]:m-0">
          <label
            className="[&:is(:hover,:active,:focus-within)]:text-brand-turquoise relative text-brand-blue underline text-[length:calc(20*var(--u))] cursor-pointer focus-within:[outline:2px_solid_var(--color-brand-turquoise)] focus-within:[outline-offset:4px] [@media(max-width:1100px)]:text-[length:16px] [@media(max-width:768px)]:[padding:10px_0]"
            htmlFor="attachments"
          >
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
              className="absolute [inset:0] opacity-0 w-full cursor-pointer"
            />
          </label>
          <span
            id="file-help"
            className="text-[length:calc(16*var(--u))] [color:#aab4d1] [@media(max-width:1100px)]:text-[length:12px]"
          >
            PDF, DOC, DOCX (up to 5 MB each)
          </span>
          {files.length > 0 && (
            <p className="[overflow-wrap:anywhere] text-[length:14px]">
              {files.join(", ")}
            </p>
          )}
          {errors.attachments && (
            <p
              className="[color:#ffbdbd] text-[length:max(12px,_calc(16*var(--u)))] mt-[6px]!"
              id="attachments-error"
            >
              {errors.attachments}
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
      <div className="flex items-center gap-[calc(34*var(--u))] mt-[calc(16*var(--u))] [@media(max-width:768px)]:gap-[20px] [@media(max-width:768px)]:mt-[16px] [@media(max-width:768px)]:items-start">
        <button
          type="submit"
          className="[&:is(:hover,:active,:focus-visible)]:bg-brand-blue [&:is(:hover,:active,:focus-visible)]:text-brand-navy! [&:is(:hover,:active,:focus-visible)]:[border-color:var(--color-brand-blue)] bg-surface text-brand-navy [border:0] rounded-[calc(5*var(--u))] [padding:calc(10*var(--u))_calc(25*var(--u))] text-[length:calc(18*var(--u))]! leading-[1.35]! font-bold! uppercase [@media(max-width:1100px)]:text-[length:14px]! [@media(max-width:1100px)]:min-h-[44px] [@media(max-width:768px)]:[padding:10px_22px] [@media(max-width:768px)]:rounded-[5px]"
        >
          Submit
        </button>
        <p
          id="submission-note"
          className="focus-visible:[outline:2px_solid_var(--color-brand-turquoise)] focus-visible:[outline-offset:4px] text-brand-turquoise text-[length:max(12px,_calc(18*var(--u)))] leading-[1.4] [@media(max-width:768px)]:text-[length:13px]"
        >
          Preview only — submission unavailable.
        </p>
      </div>
      <p
        ref={status}
        role="status"
        tabIndex={-1}
        className="focus-visible:[outline:2px_solid_var(--color-brand-turquoise)] focus-visible:[outline-offset:4px] text-brand-turquoise text-[length:max(12px,_calc(18*var(--u)))] leading-[1.4] [&:not(:empty)]:mt-[16px]! [@media(max-width:768px)]:text-[length:13px]"
      >
        {notice}
      </p>
    </form>
  );
}
