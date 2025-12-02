

const Footer = () => {
  return (
    <footer className="bg-[#1a1a2e] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 border-b border-slate-700 pb-8 sm:pb-12">
          {/* Contact Section */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center md:text-left">Contact</h3>
            <div className="space-y-4">
              {/* Office Address with Google Maps Link */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Belgradska+27,+7000+Bitola,+Republic+N.+Macedonia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 group hover:text-teal-400 transition-colors duration-200"
              >
                {/* Home Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 flex-shrink-0 text-teal-500 group-hover:text-teal-400"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-slate-300 text-sm sm:text-base">Office</p>
                  <p className="text-xs sm:text-sm text-slate-400 group-hover:text-teal-300 leading-relaxed">
                    Belgradska 27, 7000 Bitola, Republic N. Macedonia
                  </p>
                </div>
              </a>

              {/* Email with Link to Contact Page */}
              <a
                href="/contact"
                className="flex items-start space-x-3 group hover:text-teal-400 transition-colors duration-200"
              >
                {/* Mail Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 flex-shrink-0 text-teal-500 group-hover:text-teal-400"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-slate-300 text-sm sm:text-base">Email</p>
                  <p className="text-xs sm:text-sm text-slate-400 group-hover:text-teal-300 break-all">
                    office.eke.macedonia@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center md:text-left">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/EKEBitola"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-slate-700 rounded-full hover:bg-teal-700 transition-colors duration-200"
                aria-label="Visit our Facebook page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  className="sm:w-5 sm:h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/eke.bitola/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-slate-700 rounded-full hover:bg-teal-700 transition-colors duration-200"
                aria-label="Visit our Instagram page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  className="sm:w-5 sm:h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-slate-500 px-2">
          <p>© 2024 European Cultural Epicenter (EKE). All rights reserved.</p>
          <a href="https://portfolio-damjan.vercel.app/" className="hover:text-teal-400 transition-colors duration-200">
            Developed by
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;