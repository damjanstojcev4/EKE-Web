import { Link } from 'react-router-dom';
import logo from '../assets/logo-ece.png'; // make sure to place a small image named logo.png in src/assets/

const Navbar = () => {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about-us' },
    { label: 'News', path: '/news' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-500/50 fixed w-full top-0 z-50 shadow-md">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
        <span className="text-white font-semibold text-lg">
          European Cultural Epicentar
        </span>
      </div>

      <ul className="flex space-x-6">
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
    </nav>
  );
};

export default Navbar;