import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import AboutUs from './components/AboutUs.tsx';
import Contact from './components/Contact.tsx';
import Projects from './components/Projects.tsx';
import ProjectDetail from './components/ProjectDetail.tsx';
import AdminPage from './components/AdminPage.tsx';
import Login from './components/Login.tsx';
import ScrollToTop from './components/utils/ScrollToTop.tsx';
import BackToTopButton from './components/utils/BackToTopButton.tsx';

function App() {
  // PrivateRoute component
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/project/:uuid" element={<ProjectDetail />} />
      </Routes>
      <BackToTopButton />
    </Router>
  );
}

export default App;
