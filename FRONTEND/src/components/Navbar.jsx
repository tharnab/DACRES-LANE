import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <Container className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
           DACRES LANE
        </Link>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
        </button>

        {/* Nav Links */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/menu" className="nav-link" onClick={() => setIsOpen(false)}>Menu</Link>
          <Link to="/cart" className="nav-link" onClick={() => setIsOpen(false)}>Cart 🛒</Link>
          
          {user ? (
            <>
              <span className="user-name">👤 {user.name}</span>
              <button onClick={handleLogout} className="logout-btn-mobile">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary-mobile" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>

        {/* Desktop Buttons */}
        <div className="desktop-buttons">
          {user ? (
            <>
              <span className="user-name-desktop">👤 {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default NavigationBar;