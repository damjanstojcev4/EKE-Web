import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import AboutUs from './components/AboutUs.tsx';
import BackToTopButton from './components/BackToTopButton.tsx';
import Contact from './components/Contact.tsx'
import Admin from './components/Admin.tsx'
import ScrollToTop from './components/ScrollToTop.tsx';

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <BackToTopButton/>
    </Router>
  );
}

export default App;
