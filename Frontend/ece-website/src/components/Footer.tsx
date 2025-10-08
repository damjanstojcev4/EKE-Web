import logo from "../assets/EKE_logo_no_background-gpt.png";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a2e] text-white py-12 px-6 sm:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-slate-700 pb-12">
          {/* Contact Section */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <div className="flex items-start space-x-4">
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
                className="mt-1 flex-shrink-0 text-orange-400"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <div>
                <p className="font-medium text-slate-300">Office</p>
                <p className="text-sm text-slate-400">
                  Belgradska 27, 7000 Bitola, Republic N. Macedonia
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
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
                className="mt-1 flex-shrink-0 text-orange-400"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <div>
                <p className="font-medium text-slate-300">Correspondence</p>
                <p className="text-sm text-slate-400">
                  Boris Kidric 5/5B, 7000 Bitola, Republic N. Macedonia
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              {/* Phone Icon */}
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
                className="mt-1 flex-shrink-0 text-orange-400"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2.05 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <p className="text-sm text-slate-400">+389 (0) 75 211 557</p>
            </div>
            <div className="flex items-start space-x-4">
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
                className="mt-1 flex-shrink-0 text-orange-400"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <p className="text-sm text-slate-400">
                office.eke.macedonia@gmail.com
              </p>
            </div>
          </div>

          {/* Follow Us Section */}
<div className="flex flex-col space-y-6">
  <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
  <div className="flex space-x-4">
    {/* Facebook */}
    <a
      href="https://www.facebook.com/EKEBitola"
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-slate-700 rounded-full hover:bg-orange-400 transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
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
      className="p-3 bg-slate-700 rounded-full hover:bg-orange-400 transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
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

          {/* Where Are We? Section */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-xl font-semibold mb-2">Where are we?</h3>
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt="European Cultural Epicenter Logo"
                className="w-10 h-10 rounded-lg flex-shrink-0"
              />
              <div>
                <p className="font-medium text-slate-300">
                  European Cultural Epicenter
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              {/* MapPin Icon */}
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
                className="mt-1 flex-shrink-0 text-orange-400"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-sm text-slate-400">Bitola, North Macedonia</p>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Located in the heart of Bitola, we provide 200m² of space for
              educational activities and community initiatives.
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>© 2024 European Cultural Epicenter (EKE). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
