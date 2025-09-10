import Footer from "./Footer";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="flex flex-col min-h-screen pt-20">
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3">
            Contact Us
          </h2>
          <p className="text-center text-gray-200 mb-12">
            Get in touch with the European Cultural Epicenter team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column - Contact Form */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Subject
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition shadow-md"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* Right Column - Contact Info */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
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
                    <FaMapMarkerAlt className="text-orange-400" />{" "}
                    Correspondence:
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

      <Footer />
    </div>
  );
};

export default ContactUs;
