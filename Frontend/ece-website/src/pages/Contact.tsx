import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import hands from "../assets/get-in-touch-vele.jpg";

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [yourMessage, setYourMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const finalSubject = subject === "custom" ? customSubject : subject;

    try {
      const response = await fetch("/api/messages/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          subject: finalSubject,
          yourMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess("Your message has been sent successfully ✅");
      setFullName("");
      setEmail("");
      setSubject("");
      setCustomSubject("");
      setYourMessage("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 via-white to-white min-h-screen px-6 sm:px-16 py-10 text-slate-800 pt-40">

      {/* Back to Home */}
      <a href="/" className="flex items-center text-teal-600 hover:text-teal-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
      </a>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2">Get In Touch</h1>
      <p className="text-slate-600 mb-10 max-w-2xl">
        We’d love to hear from you. Reach out to learn more about our work or get involved.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Contact Information Section */}
        <div>
          <h2 className="text-lg font-semibold mb-6">Contact Information</h2>

          <div className="space-y-6">

            <div className="flex items-start gap-3">
              <div className="p-3 bg-teal-600 text-white rounded-lg">
                <FaEnvelope />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-slate-600">office.eke.macedonia@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-3 bg-teal-600 text-white rounded-lg">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-slate-600">
                  Belgradska 27, 7000 Bitola, Republic N. Macedonia
                </p>
              </div>
            </div>

            {/* Image */}
            <img
              src={hands}
              className="rounded-xl mt-4 shadow-md w-full"
              alt="helping hands"
            />
          </div>
        </div>

        {/* Send a Message Form */}
        <div>
          <h2 className="text-lg font-semibold mb-6">Send Us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm mb-1">Your Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg p-3"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg p-3"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg p-3"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Message *</label>
              <textarea
                rows={4}
                value={yourMessage}
                onChange={(e) => setYourMessage(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg p-3"
                placeholder="Tell us more about your inquiry…"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : (
                <>
                  <span>Send Message</span>
                </>
              )}
            </button>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </form>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">

        <div className="p-6 bg-teal-50 rounded-xl text-center shadow-sm">
          <h3 className="font-semibold mb-2">Volunteer With Us</h3>
          <p className="text-slate-600 text-sm">
            Join our team of dedicated volunteers making a difference.
          </p>
          <a href="#" className="text-teal-700 text-sm font-semibold mt-3 inline-block">
            Learn More →
          </a>
        </div>

        <div className="p-6 bg-teal-50 rounded-xl text-center shadow-sm">
          <h3 className="font-semibold mb-2">Partner With Us</h3>
          <p className="text-slate-600 text-sm">
            Collaborate on projects that create sustainable impact.
          </p>
          <a href="#" className="text-teal-700 text-sm font-semibold mt-3 inline-block">
            Learn More →
          </a>
        </div>

        <div className="p-6 bg-teal-50 rounded-xl text-center shadow-sm">
          <h3 className="font-semibold mb-2">Support Our Work</h3>
          <p className="text-slate-600 text-sm">
            Help us continue making a positive impact in communities.
          </p>
          <a href="#" className="text-teal-700 text-sm font-semibold mt-3 inline-block">
            Learn More →
          </a>
        </div>

      </div>
    </div>
  );
};

export default Contact;
