import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.tsx";
import Home from "./components/Home.tsx";
import AboutUs from "./components/AboutUs.tsx";
import Projects from "./components/Projects.tsx";
import ProjectDetail from "./components/ProjectDetail.tsx";
import AdminPage from "./components/AdminPage.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx"; // ✅ new
import ScrollToTop from "./components/utils/ScrollToTop.tsx";
import BackToTopButton from "./components/utils/BackToTopButton.tsx";
import Footer from "./components/Footer.tsx";

function App() {
  // wrapper for routes that require login
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("jwt");
    return token ? <>{children}</> : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:uuid" element={<ProjectDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />

        {/* fallback route if no match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <BackToTopButton />
    </Router>
  );
}

export default App;
