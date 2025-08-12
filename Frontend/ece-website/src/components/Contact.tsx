import Footer from "./Footer";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook, FaInstagram } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="flex flex-col min-h-screen pt-20">

      {/* Background */}
      <div className="relative w-full flex-1 p-4 sm:p-8 pt-[80px] overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <img
            src="src/assets/o-bg.jpg"
            alt="Contact background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 py-16 px-4">

          {/* Left Column - Contact Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-gray-600/50 p-8 rounded-2xl shadow-xl">
            <h2 className="text-4xl font-extrabold text-orange-400 mb-6">Get in Touch</h2>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <textarea
                placeholder="Your Message"
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
              ></textarea>
              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Column - Contact Info */}
          <div className="flex flex-col justify-center space-y-8 text-white">
            <h3 className="text-3xl font-bold text-orange-400">Contact Information</h3>

            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-orange-400 text-2xl" />
              <span>Bitola, North Macedonia</span>
            </div>

            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-orange-400 text-2xl" />
              <span>+389 71 234 567</span>
            </div>

            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-orange-400 text-2xl" />
              <span>info@eke.mk</span>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6 pt-4">
              <a
                href="https://www.facebook.com/EKEBitola"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 text-3xl hover:text-orange-500"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/eke.bitola/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 text-3xl hover:text-orange-500"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
