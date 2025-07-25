import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Home Page</h2>} />
          <Route path="/about-us" element={<h2>About Page</h2>} />
          <Route path="/news" element={<h2>News Page</h2>} />
          <Route path="/projects" element={<h2>Projects Page</h2>} />
          <Route path="/contact" element={<h2>Contact Page</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
