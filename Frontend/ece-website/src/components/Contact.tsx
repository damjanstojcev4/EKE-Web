import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

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
    <div className="flex flex-col min-h-screen">
      {/* Background */}
      <div className="relative w-full flex-1 font-sans">
        <div className="absolute inset-0 z-0">
          <img
            src="src/assets/o-bg.jpg"
            alt="Contact background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 ">
            Contact Us
          </h2>
          <p className="text-center text-gray-200 mb-12">
            Get in touch with the European Cultural Epicenter team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column - Contact Form */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                {/* Subject with dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="" className="bg-gray-300 text-gray-900">Select subject</option>
                    <option value="Become a Partner" className="bg-gray-300 text-gray-900">Become a Partner</option>
                    <option value="custom" className="bg-gray-300 text-gray-900">Other</option>
                  </select>
                  {subject === "custom" && (
                    <input
                      type="text"
                      placeholder="Enter your subject"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="mt-3 w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    value={yourMessage}
                    onChange={(e) => setYourMessage(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition shadow-md disabled:opacity-50"
                >
                  {loading ? "Sending..." : "SEND MESSAGE"}
                </button>

                {success && <p className="text-green-400 mt-3">{success}</p>}
                {error && <p className="text-red-400 mt-3">{error}</p>}
              </form>
            </div>

            {/* Right Column - Contact Info */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg">
              <h3 className="text-3xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6 text-xl">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-400" /> Office:
                  </p>
                  <p className="ml-7 text-gray-200">
                    Belgradska 27, 7000 Bitola, Republic N.Macedonia
                  </p>
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-400" /> Correspondence:
                  </p>
                  <p className="ml-7 text-gray-200">
                    Boris Kidric 5/50, 7000 Bitola, Republic N.Macedonia
                  </p>
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <FaPhoneAlt className="text-orange-400" /> Phone:
                  </p>
                  <p className="ml-7 text-gray-200">+389 (0) 75 211 557</p>
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <FaEnvelope className="text-orange-400" /> Email:
                  </p>
                  <p className="ml-7 text-gray-200">
                    office.eke.macedonia@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
