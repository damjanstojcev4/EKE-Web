import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — EKE Bitola",
  description:
    "EKE Bitola’s privacy policy and contact information for privacy-related enquiries.",
};

function OrganisationDetails() {
  return (
    <ul className={styles.details}>
      <li>
        <strong>Organisation:</strong> EKE Bitola
      </li>
      <li>
        <strong>Website:</strong>{" "}
        <a href="https://ekebitola.org/">https://ekebitola.org/</a>
      </li>
      <li>
        <strong>Email:</strong>{" "}
        <a href="mailto:info@ekebitola.org">info@ekebitola.org</a>
      </li>
      <li>
        <strong>Address:</strong> Belgradska 27, 7000 Bitola, N. Macedonia
      </li>
    </ul>
  );
}

// Transcribed from the supplied local export. Approval status: PRIVACY_POLICY_REVIEW.md.
export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.decorations} aria-hidden="true">
        <img
          className={styles.first}
          src="/assets/privacy-policy/Group.svg"
          alt=""
        />
        <img
          className={styles.second}
          src="/assets/privacy-policy/Group%20(1).svg"
          alt=""
        />
        <img
          className={styles.third}
          src="/assets/privacy-policy/Group%20(2).svg"
          alt=""
        />
      </div>
      <Header />
      <main id="main" className={styles.main}>
        <h1>Privacy Policy</h1>
        <div className={styles.divider} aria-hidden="true" />
        <article className={styles.document} aria-label="Privacy Policy">
          <p className={styles.updated}>
            Last updated: <time dateTime="2026-10-09">9 October 2026</time>
          </p>
          <section>
            <h2>1. Introduction</h2>
            <p>
              EKE Bitola (“we”, “our”, or “us”) respects your privacy and is
              committed to protecting your personal data. This Privacy Policy
              explains how we collect, use, store, and protect personal
              information when you visit our website,{" "}
              <a href="https://ekebitola.org/">https://ekebitola.org/</a>,
              contact us, or engage with our activities through the website.
            </p>
            <p>
              We process personal data in accordance with applicable personal
              data protection legislation in the Republic of North Macedonia.
            </p>
          </section>
          <section>
            <h2>2. Who We Are</h2>
            <p>
              EKE Bitola is a non-governmental organization working in
              non-formal education, youth participation, inclusion and community
              development.
            </p>
            <OrganisationDetails />
            <p>
              For questions about this Privacy Policy or the processing of your
              personal data, please contact us using the details above.
            </p>
          </section>
          <section>
            <h2>3. What Personal Data We Collect</h2>
            <p>
              Depending on how you interact with our website, we may collect the
              following information:
            </p>
            <ul>
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
            <p>
              Please provide only the personal information necessary for your
              enquiry or application.
            </p>
          </section>
          <section>
            <h2>4. How We Use Your Personal Data</h2>
            <p>We may use personal data for the following purposes:</p>
            <ul>
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
            <p>
              We will not use your personal data for purposes incompatible with
              those explained in this Privacy Policy.
            </p>
          </section>
          <section>
            <h2>5. Legal Basis for Processing</h2>
            <p>
              We process personal data only when an appropriate legal basis
              applies. Depending on the circumstances, this may include:
            </p>
            <ul>
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
            <p>
              Where processing is based on consent, you may withdraw your
              consent at any time. Withdrawal does not affect the lawfulness of
              processing carried out before withdrawal.
            </p>
          </section>
          <section>
            <h2>6. Applications, Projects and Youth Opportunities</h2>
            <p>
              When you apply for a project, volunteering program, training
              course, or other opportunity through our website, we may process
              the information you submit to assess your application, communicate
              with you, and organize the relevant activity.
            </p>
            <p>
              Access to application information will be limited to authorized
              personnel and relevant project partners where necessary and
              legally permitted.
            </p>
            <p>
              If an application requires additional information, such as
              information about accessibility needs, we will explain why it is
              needed and process it only where a valid legal basis applies.
            </p>
            <p>
              Please do not submit sensitive personal information unless it is
              specifically requested through an appropriate process.
            </p>
          </section>
          <section>
            <h2>7. Children and Young People</h2>
            <p>
              EKE Bitola may organize activities involving children and young
              people. We take the protection of their personal data seriously.
            </p>
            <p>
              Where activities involve minors, we will apply appropriate
              safeguards and obtain parental or guardian authorization where
              required by applicable law. We will handle personal information
              relating to minors carefully and only for specified, legitimate
              purposes.
            </p>
            <p>
              Photographs, videos, or personal stories of participants will be
              used in accordance with applicable data protection requirements
              and any consent or authorization required for the particular use.
            </p>
          </section>
          <section>
            <h2>8. Sharing Your Personal Data</h2>
            <p>We do not sell your personal data.</p>
            <p>We may share personal information with:</p>
            <ul>
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
            <p>
              Where third-party service providers process personal data on our
              behalf, we will take appropriate steps to ensure that the data is
              handled securely and in accordance with applicable requirements.
              We share only the information necessary for the relevant purpose.
            </p>
          </section>
          <section>
            <h2>9. International Data Transfers</h2>
            <p>
              Some service providers or project partners may operate outside the
              Republic of North Macedonia. Where personal data is transferred
              internationally, we will apply the safeguards and legal
              requirements applicable to that transfer.
            </p>
          </section>
          <section>
            <h2>10. Data Retention</h2>
            <p>
              We retain personal data only for as long as necessary to fulfil
              the purposes for which it was collected, including managing
              enquiries, applications, and project activities.
            </p>
            <p>
              Certain information may need to be retained for longer periods to
              comply with legal, financial, contractual, or reporting
              obligations.
            </p>
            <p>
              When personal data is no longer required, we will take appropriate
              steps to delete it or otherwise dispose of it securely.
            </p>
          </section>
          <section>
            <h2>11. Cookies and Similar Technologies</h2>
            <p>
              Our website may use cookies and similar technologies to support
              essential website functions, remember preferences, understand
              website usage, or provide embedded third-party content. Where
              required, non-essential cookies will be used only after obtaining
              the appropriate consent.
            </p>
            <p>
              You may be able to manage your preferences through the
              website&apos;s cookie settings or your browser settings. Disabling
              certain cookies may affect some website functions.
            </p>
            <p>
              The specific cookies and third-party technologies used by EKE
              Bitola should be listed in a separate Cookie Policy or in a
              detailed cookie settings panel.
            </p>
          </section>
          <section>
            <h2>12. Data Security</h2>
            <p>
              We take appropriate technical and organizational measures to
              protect personal data against unauthorized access, loss,
              alteration, disclosure, or misuse.
            </p>
            <p>
              Access to personal data is restricted to authorized persons who
              need it for their responsibilities. Although we take reasonable
              steps to protect information, no method of electronic transmission
              or storage can guarantee absolute security.
            </p>
          </section>
          <section>
            <h2>13. Your Data Protection Rights</h2>
            <p>Subject to applicable law, you may have the right to:</p>
            <ul>
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
            <p>
              To exercise your rights, contact us using the details provided in
              the “Who We Are” section. We may need to verify your identity
              before responding.
            </p>
          </section>
          <section>
            <h2>14. Third-Party Websites and Services</h2>
            <p>
              Our website may contain links to external websites, partner
              organisations, application platforms, maps, videos, or social
              media services.
            </p>
            <p>
              These third parties operate under their own privacy policies and
              practices. We are not responsible for the privacy practices of
              external websites.
            </p>
            <p>
              We encourage you to review their privacy policies before providing
              personal information or interacting with embedded services.
            </p>
          </section>
          <section>
            <h2>15. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy to reflect changes in our
              activities, website functionality, service providers, or legal
              requirements.
            </p>
            <p>
              Any revised version will be published on this page, together with
              an updated “Last updated” date. We encourage you to review this
              page periodically.
            </p>
          </section>
          <section>
            <h2>16. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, wish to exercise
              your data protection rights, or need further information about how
              your personal data is processed, please contact:
            </p>
            <OrganisationDetails />
            <p>
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
