import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/src/assets/EKE_logo_no_background-gpt.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about-us' },
    { label: 'News', path: '/news' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="backdrop-blur-md bg-cyan-950/90 fixed w-full top-0 z-50 shadow-md border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <Link to="/"><img src={logo} alt="Logo" className="h-20 w-20 object-contain" /></Link>
          {/* ECE text only on lg and above */}
          <span className="hidden lg:inline text-white font-semibold text-lg">
            EKE Bitola
          </span>
        </div>

        {/* Hamburger Button (shown below lg) */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {/* Simple Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
        <ul className="hidden lg:flex space-x-6">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="text-white hover:bg-yellow-600 px-3 py-2 rounded transition duration-300 ease-in-out"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="lg:hidden flex flex-col px-6 pb-4 space-y-2 bg-blue-300/20">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="block text-white hover:bg-yellow-600 px-3 py-2 rounded transition duration-300 ease-in-out"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;