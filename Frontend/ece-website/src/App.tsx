import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import AboutUs from './components/AboutUs.tsx';
import BackToTopButton from './components/utils/BackToTopButton.tsx';
import Contact from './components/Contact.tsx'
import ScrollToTop from './components/utils/ScrollToTop.tsx';
import ProjectDetail from './components/ProjectDetail.tsx';
import Projects from './components/Projects.tsx';
import AdminPage from './components/AdminPage.tsx';

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/project/:uuid" element={<ProjectDetail />} />
      </Routes>
      <BackToTopButton/>
    </Router>
  );
}

export default App;
