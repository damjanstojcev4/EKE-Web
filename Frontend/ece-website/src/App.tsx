import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import AboutUs from './components/AboutUs.tsx';
import BackToTopButton from './components/BackToTopButton.tsx';
import Contact from './components/Contact.tsx'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <BackToTopButton/>
    </Router>
  );
}

export default App;
