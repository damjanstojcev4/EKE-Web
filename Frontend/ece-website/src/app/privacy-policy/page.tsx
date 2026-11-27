import { pageMetadata } from "@/lib/seo";
import { BreadcrumbStructuredData } from "@/components/SeoStructuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";

export const metadata = pageMetadata("privacy");

function OrganisationDetails() {
  return (
    <ul className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]! mb-0 list-none pl-0">
      <li className="relative before:absolute before:content-[''] before:w-[calc(14*var(--u))] before:h-[calc(14*var(--u))] before:left-[calc(-34*var(--u))] before:top-[calc(10*var(--u))] before:bg-brand-navy [@media(max-width:1100px)]:before:w-[9px] [@media(max-width:1100px)]:before:h-[9px] [@media(max-width:1100px)]:before:left-[-20px] [@media(max-width:1100px)]:before:top-[10px]">
        <strong>Organisation:</strong> EKE Bitola
      </li>
      <li className="relative before:absolute before:content-[''] before:w-[calc(14*var(--u))] before:h-[calc(14*var(--u))] before:left-[calc(-34*var(--u))] before:top-[calc(10*var(--u))] before:bg-brand-navy [@media(max-width:1100px)]:before:w-[9px] [@media(max-width:1100px)]:before:h-[9px] [@media(max-width:1100px)]:before:left-[-20px] [@media(max-width:1100px)]:before:top-[10px]">
        <strong>Website:</strong>{" "}
        <a href="https://ekebitola.org/" className="hover:underline!">
          https://ekebitola.org/
        </a>
      </li>
      <li className="relative before:absolute before:content-[''] before:w-[calc(14*var(--u))] before:h-[calc(14*var(--u))] before:left-[calc(-34*var(--u))] before:top-[calc(10*var(--u))] before:bg-brand-navy [@media(max-width:1100px)]:before:w-[9px] [@media(max-width:1100px)]:before:h-[9px] [@media(max-width:1100px)]:before:left-[-20px] [@media(max-width:1100px)]:before:top-[10px]">
        <strong>Email:</strong>{" "}
        <a href="mailto:info@ekebitola.org" className="hover:underline!">
          info@ekebitola.org
        </a>
      </li>
      <li className="relative before:absolute before:content-[''] before:w-[calc(14*var(--u))] before:h-[calc(14*var(--u))] before:left-[calc(-34*var(--u))] before:top-[calc(10*var(--u))] before:bg-brand-navy [@media(max-width:1100px)]:before:w-[9px] [@media(max-width:1100px)]:before:h-[9px] [@media(max-width:1100px)]:before:left-[-20px] [@media(max-width:1100px)]:before:top-[10px]">
        <strong>Address:</strong> Belgradska 27, 7000 Bitola, N. Macedonia
      </li>
    </ul>
  );
}

// Transcribed from the supplied local export. Approval status: PRIVACY_POLICY_REVIEW.md.
export default function PrivacyPolicyPage() {
  return (
    <div
      className={[
        styles.page,
        "relative isolate overflow-clip bg-surface-muted",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden"
        aria-hidden="true"
      >
        <img
          className={[
            styles.first,
            "absolute max-w-none w-[calc(1779*var(--u))] left-0 top-0 [@media(max-width:700px)]:w-[1000px] [@media(max-width:700px)]:left-[-250px]",
          ].join(" ")}
          src="/assets/privacy-policy/Group.svg"
          alt=""
        />
        <img
          className="absolute max-w-none w-[calc(1735*var(--u))] left-0 top-[calc(1310*var(--u))] [@media(max-width:700px)]:w-[1000px] [@media(max-width:700px)]:left-[-350px] [@media(max-width:700px)]:top-[1800px]"
          src="/assets/privacy-policy/Group%20(1).svg"
          alt=""
        />
        <img
          className="absolute max-w-none w-[calc(1840*var(--u))] left-[calc(80*var(--u))] top-[calc(3532*var(--u))] [@media(max-width:700px)]:w-[1000px] [@media(max-width:700px)]:left-[-300px] [@media(max-width:700px)]:top-[4000px]"
          src="/assets/privacy-policy/Group%20(2).svg"
          alt=""
        />
      </div>
      <Header />
      <BreadcrumbStructuredData page="privacy" />
      <main
        id="main"
        className="pt-[calc(258*var(--u))] [@media(max-width:700px)]:pt-[145px]"
      >
        <h1 className="ml-[calc(80*var(--u))]! text-[length:calc(110*var(--u)-2px)] leading-[calc(140*var(--u))] font-bold [@media(max-width:700px)]:text-[40px] [@media(max-width:700px)]:leading-[1.15] [@media(max-width:700px)]:mx-[24px]!">
          Privacy Policy
        </h1>
        <div
          className="h-[calc(23*var(--u))] mx-[calc(80*var(--u))] mt-[calc(34*var(--u))] [background:linear-gradient(to_right,var(--color-brand-turquoise)_0_calc(70*var(--u)),var(--color-brand-blue)_calc(70*var(--u))_100%)] [@media(max-width:700px)]:h-[8px] [@media(max-width:700px)]:mx-[24px] [@media(max-width:700px)]:mt-[24px] [@media(max-width:700px)]:[background:linear-gradient(to_right,var(--color-brand-turquoise)_0_24px,var(--color-brand-blue)_24px_100%)]"
          aria-hidden="true"
        />
        <article
          className="w-[calc(880*var(--u))] mt-[calc(121*var(--u))] ml-[calc(170*var(--u))] text-[length:calc(20*var(--u))] leading-[calc(32*var(--u))] [overflow-wrap:anywhere] [@media(max-width:1100px)]:w-[min(900px,calc(100%_-_112px))] [@media(max-width:1100px)]:mx-[56px] [@media(max-width:1100px)]:mt-[70px] [@media(max-width:1100px)]:text-[18px] [@media(max-width:1100px)]:leading-[1.6] [@media(max-width:700px)]:w-auto [@media(max-width:700px)]:mt-[48px] [@media(max-width:700px)]:mr-[24px] [@media(max-width:700px)]:ml-[40px] [@media(max-width:700px)]:text-[16px]"
          aria-label="Privacy Policy"
        >
          <p className="relative before:absolute before:content-[''] before:w-[calc(14*var(--u))] before:h-[calc(14*var(--u))] before:left-[calc(-34*var(--u))] before:top-[calc(10*var(--u))] before:bg-brand-navy [@media(max-width:1100px)]:before:w-[9px] [@media(max-width:1100px)]:before:h-[9px] [@media(max-width:1100px)]:before:left-[-20px] [@media(max-width:1100px)]:before:top-[10px] font-bold mb-[calc(40*var(--u))]! indent-[calc(-10*var(--u))] before:[transform:translateY(calc(-3*var(--u)))] [@media(max-width:1100px)]:mb-[36px]! [@media(max-width:700px)]:text-[15px]">
            Last updated: <time dateTime="2026-10-09">9 October 2026</time>
          </p>
          <section>
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              1. Introduction
            </h2>
            <p>
              EKE Bitola (“we”, “our”, or “us”) respects your privacy and is
              committed to protecting your personal data. This Privacy Policy
              explains how we collect, use, store, and protect personal
              information when you visit our website,{" "}
              <a href="https://ekebitola.org/" className="hover:underline!">
                https://ekebitola.org/
              </a>
              , contact us, or engage with our activities through the website.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              We process personal data in accordance with applicable personal
              data protection legislation in the Republic of North Macedonia.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              2. Who We Are
            </h2>
            <p>
              EKE Bitola is a non-governmental organization working in
              non-formal education, youth participation, inclusion and community
              development.
            </p>
            <OrganisationDetails />
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              For questions about this Privacy Policy or the processing of your
              personal data, please contact us using the details above.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              3. What Personal Data We Collect
            </h2>
            <p>
              Depending on how you interact with our website, we may collect the
              following information:
            </p>
            <ul className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]! mb-0 list-disc pl-[calc(30*var(--u))] [@media(max-width:1100px)]:pl-[26px]">
              <li>
                Contact information: Name, email address, phone number, and any
                other information you provide when contacting us.
              </li>
              <li>
                Application information: Information submitted through project
                applications, open calls, volunteering opportunities, training
                programmes, or other participation forms.
              </li>
              <li>
                Communication data: Messages, questions, feedback, and
                correspondence sent to us.
              </li>
              <li>
                Technical information: IP address, browser type, device
                information, pages visited, and basic website usage data, where
                collected.
              </li>
              <li>
                Cookie information: Data collected through cookies or similar
                technologies, depending on your cookie preferences and the tools
                used on our website.
              </li>
            </ul>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Please provide only the personal information necessary for your
              enquiry or application.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              4. How We Use Your Personal Data
            </h2>
            <p>We may use personal data for the following purposes:</p>
            <ul className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]! mb-0 list-disc pl-[calc(30*var(--u))] [@media(max-width:1100px)]:pl-[26px]">
              <li>
                To respond to enquiries and provide requested information.
              </li>
              <li>
                To manage applications for projects, events, volunteering,
                training, and other opportunities.
              </li>
              <li>
                To communicate with participants about activities, schedules,
                requirements, and application outcomes.
              </li>
              <li>
                To organize and administer educational programs and youth
                activities.
              </li>
              <li>
                To improve the functionality, accessibility, and performance of
                our website.
              </li>
              <li>To maintain website security and prevent misuse.</li>
              <li>To comply with applicable legal obligations.</li>
            </ul>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              We will not use your personal data for purposes incompatible with
              those explained in this Privacy Policy.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              5. Legal Basis for Processing
            </h2>
            <p>
              We process personal data only when an appropriate legal basis
              applies. Depending on the circumstances, this may include:
            </p>
            <ul className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]! mb-0 list-disc pl-[calc(30*var(--u))] [@media(max-width:1100px)]:pl-[26px]">
              <li>
                Consent: When you voluntarily consent to a specific use of your
                personal data.
              </li>
              <li>
                Legitimate interests: When processing is necessary for
                legitimate organisational purposes and your rights and interests
                do not override those purposes.
              </li>
              <li>
                Legal obligations: When processing is required by applicable
                law.
              </li>
              <li>
                Pre-contractual or contractual measures: When processing is
                necessary to manage a relevant agreement or request.
              </li>
            </ul>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Where processing is based on consent, you may withdraw your
              consent at any time. Withdrawal does not affect the lawfulness of
              processing carried out before withdrawal.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              6. Applications, Projects and Youth Opportunities
            </h2>
            <p>
              When you apply for a project, volunteering program, training
              course, or other opportunity through our website, we may process
              the information you submit to assess your application, communicate
              with you, and organize the relevant activity.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Access to application information will be limited to authorized
              personnel and relevant project partners where necessary and
              legally permitted.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              If an application requires additional information, such as
              information about accessibility needs, we will explain why it is
              needed and process it only where a valid legal basis applies.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Please do not submit sensitive personal information unless it is
              specifically requested through an appropriate process.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              7. Children and Young People
            </h2>
            <p>
              EKE Bitola may organize activities involving children and young
              people. We take the protection of their personal data seriously.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Where activities involve minors, we will apply appropriate
              safeguards and obtain parental or guardian authorization where
              required by applicable law. We will handle personal information
              relating to minors carefully and only for specified, legitimate
              purposes.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Photographs, videos, or personal stories of participants will be
              used in accordance with applicable data protection requirements
              and any consent or authorization required for the particular use.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              8. Sharing Your Personal Data
            </h2>
            <p>We do not sell your personal data.</p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              We may share personal information with:
            </p>
            <ul className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]! mb-0 list-disc pl-[calc(30*var(--u))] [@media(max-width:1100px)]:pl-[26px]">
              <li>
                Project partners and participating organisations, where
                necessary to organise or administer a relevant activity.
              </li>
              <li>
                Website hosting, maintenance, email, and other service providers
                acting on our behalf.
              </li>
              <li>
                Public authorities or other recipients when disclosure is
                required by law.
              </li>
            </ul>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Where third-party service providers process personal data on our
              behalf, we will take appropriate steps to ensure that the data is
              handled securely and in accordance with applicable requirements.
              We share only the information necessary for the relevant purpose.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              9. International Data Transfers
            </h2>
            <p>
              Some service providers or project partners may operate outside the
              Republic of North Macedonia. Where personal data is transferred
              internationally, we will apply the safeguards and legal
              requirements applicable to that transfer.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              10. Data Retention
            </h2>
            <p>
              We retain personal data only for as long as necessary to fulfil
              the purposes for which it was collected, including managing
              enquiries, applications, and project activities.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Certain information may need to be retained for longer periods to
              comply with legal, financial, contractual, or reporting
              obligations.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              When personal data is no longer required, we will take appropriate
              steps to delete it or otherwise dispose of it securely.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              11. Cookies and Similar Technologies
            </h2>
            <p>
              Our website may use cookies and similar technologies to support
              essential website functions, remember preferences, understand
              website usage, or provide embedded third-party content. Where
              required, non-essential cookies will be used only after obtaining
              the appropriate consent.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              You may be able to manage your preferences through the
              website&apos;s cookie settings or your browser settings. Disabling
              certain cookies may affect some website functions.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              The specific cookies and third-party technologies used by EKE
              Bitola should be listed in a separate Cookie Policy or in a
              detailed cookie settings panel.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              12. Data Security
            </h2>
            <p>
              We take appropriate technical and organizational measures to
              protect personal data against unauthorized access, loss,
              alteration, disclosure, or misuse.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Access to personal data is restricted to authorized persons who
              need it for their responsibilities. Although we take reasonable
              steps to protect information, no method of electronic transmission
              or storage can guarantee absolute security.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              13. Your Data Protection Rights
            </h2>
            <p>Subject to applicable law, you may have the right to:</p>
            <ul className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]! mb-0 list-disc pl-[calc(30*var(--u))] [@media(max-width:1100px)]:pl-[26px]">
              <li>Request access to your personal data.</li>
              <li>
                Request correction of inaccurate or incomplete information.
              </li>
              <li>Request deletion of your personal data.</li>
              <li>Request restriction of certain processing activities.</li>
              <li>Object to processing in applicable circumstances.</li>
              <li>
                Request a copy of your data in a portable format where the right
                applies.
              </li>
              <li>Withdraw consent where processing is based on consent.</li>
              <li>
                Lodge a complaint with the competent data protection supervisory
                authority.
              </li>
            </ul>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              To exercise your rights, contact us using the details provided in
              the “Who We Are” section. We may need to verify your identity
              before responding.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              14. Third-Party Websites and Services
            </h2>
            <p>
              Our website may contain links to external websites, partner
              organisations, application platforms, maps, videos, or social
              media services.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              These third parties operate under their own privacy policies and
              practices. We are not responsible for the privacy practices of
              external websites.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              We encourage you to review their privacy policies before providing
              personal information or interacting with embedded services.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              15. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy to reflect changes in our
              activities, website functionality, service providers, or legal
              requirements.
            </p>
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              Any revised version will be published on this page, together with
              an updated “Last updated” date. We encourage you to review this
              page periodically.
            </p>
          </section>
          <section className="mt-[calc(24*var(--u))] [@media(max-width:1100px)]:mt-[28px]">
            <h2 className="text-[length:calc(32*var(--u)-2px)] leading-[calc(40*var(--u))] font-bold [@media(max-width:1100px)]:text-[26px] [@media(max-width:1100px)]:leading-[1.25] [@media(max-width:700px)]:text-[22px]">
              16. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, wish to exercise
              your data protection rights, or need further information about how
              your personal data is processed, please contact:
            </p>
            <OrganisationDetails />
            <p className="mt-[calc(32*var(--u))]! [@media(max-width:1100px)]:mt-[24px]!">
              We will review and respond to your request in accordance with
              applicable data protection requirements.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
