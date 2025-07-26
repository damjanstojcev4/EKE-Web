import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../custom-css/custom.css';

function Header() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  // Close menu automatically on route change
  React.useEffect(() => {
    setExpanded(false);
  }, [location]);

  return (
    <Navbar expand="lg" expanded={expanded} className="custom-navbar" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">European Cultural Epicentar</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
            <Nav.Link as={Link} to="/about-us" onClick={() => setExpanded(false)}>About Us</Nav.Link>
            <Nav.Link as={Link} to="/news" onClick={() => setExpanded(false)}>News</Nav.Link>
            <Nav.Link as={Link} to="/projects" onClick={() => setExpanded(false)}>Projects</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={() => setExpanded(false)}>Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
