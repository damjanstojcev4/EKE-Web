import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "/src/assets/logo-black-white.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();

  const handleScroll = (id: string) => {
    setIsOpen(false);
    setIsAboutOpen(false);
    
    if (location.pathname !== "/") {
      // If we're not on home page, navigate to home first
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const aboutDropdown = [
    { label: "Us", id: "about-us" },
    { label: "Our Team", id: "about-team" },
    { label: "EKE Mission & Vision", id: "about-mission" },
    { label: "Our Projects", id: "about-projects" },
    { label: "Our Documents", id: "documents" },
    { label: "Our Resources", id: "about-resources" },
    { label: "Get In Touch", id: "get-in-touch" },
  ];

  return (
    <nav className="backdrop-blur-md bg-white/90 fixed w-full top-0 z-50 shadow-md border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <NavLink to="/" onClick={() => handleScroll("hero")}>
            <img src={logo} alt="Logo" className="h-20 w-20 object-contain" />
          </NavLink>
          <span className="hidden lg:inline text-black font-semibold text-lg">
            EKE Bitola
          </span>
        </div>

        {/* Hamburger Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 items-center relative">
          {/* About Us Dropdown - Centered */}
          <li className="relative group">
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="px-3 py-2 rounded text-black hover:text-teal-700 font-semibold flex items-center gap-1"
            >
              About
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${
                  isAboutOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown - Centered under the button */}
            {isAboutOpen && (
              <ul className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-100 z-50">
                {aboutDropdown.map((sub) => (
                  <li
                    key={sub.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                    onClick={() => handleScroll(sub.id)}
                  >
                    {sub.label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/90">
          <ul className="px-6 pb-4 space-y-2">
            {/* Mobile Dropdown */}
            <li>
              <button
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="w-full text-left px-3 py-2 rounded text-black hover:text-teal-600 flex justify-between items-center font-semibold"
              >
                About Us
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${
                    isAboutOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isAboutOpen && (
                <ul className="pl-4 mt-1 space-y-1">
                  {aboutDropdown.map((sub) => (
                    <li
                      key={sub.id}
                      className="px-3 py-2 text-black hover:text-teal-500 rounded cursor-pointer text-sm"
                      onClick={() => handleScroll(sub.id)}
                    >
                      {sub.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;