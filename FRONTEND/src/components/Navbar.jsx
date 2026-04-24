import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import './Navbar.css';

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showNavbar, setShowNavbar] = useState(true);
    
    // Refs for detecting clicks outside
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const mobileMenuBtnRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchCartCount();
        }
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScrollDirection);
        
        // Handle click outside to close dropdown and mobile menu
        const handleClickOutside = (event) => {
            // Close user dropdown when clicking outside
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            
            // Close mobile menu when clicking outside, but NOT when clicking the menu button
            if (mobileMenuRef.current && 
                !mobileMenuRef.current.contains(event.target) && 
                mobileMenuBtnRef.current && 
                !mobileMenuBtnRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScrollDirection);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user, lastScrollY]);

    const handleScroll = () => {
        setScrolled(window.scrollY > 50);
    };

    const handleScrollDirection = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
        setLastScrollY(currentScrollY);
    };

    const fetchCartCount = async () => {
        try {
            const { data } = await API.get('/cart');
            setCartCount(data.totalItems || 0);
        } catch (error) {
            console.error('Failed to fetch cart count');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
        setShowDropdown(false);
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: '🏠' },
        { name: 'Menu', path: '/menu', icon: '🍽️' },
    ];

    return (
        <motion.nav 
            className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
            animate={{
                y: showNavbar ? 0 : -100,
                opacity: showNavbar ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <Container className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
                    <span className="logo-icon">🍕</span>
                    <span className="logo-text">DACRES LANE</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="nav-links-desktop">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className="nav-right">
                    {/* Cart */}
                    <Link to="/cart" className="cart-btn">
                        <span className="cart-icon">🛒</span>
                        {cartCount > 0 && (
                            <motion.span 
                                className="cart-count"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                {cartCount}
                            </motion.span>
                        )}
                        <span className="cart-text">Cart</span>
                    </Link>

                    {/* User Section - Desktop */}
                    {user ? (
                        <div className="user-menu desktop-only" ref={dropdownRef}>
                            <button 
                                className="user-btn"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="user-avatar">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-name">{user.name?.split(' ')[0]}</span>
                                <span className={`dropdown-arrow ${showDropdown ? 'rotate' : ''}`}>▼</span>
                            </button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div 
                                        className="user-dropdown"
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="dropdown-header">
                                            <div className="dropdown-avatar">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="dropdown-info">
                                                <h4>{user.name}</h4>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="dropdown-items">
                                            <Link to="/profile" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <span>👤</span> My Profile
                                            </Link>
                                            <Link to="/orders" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <span>📦</span> My Orders
                                            </Link>
                                            <Link to="/track-order" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <span>📍</span> Track Order
                                            </Link>
                                            <Link to="/wishlist" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <span>❤️</span> Wishlist
                                            </Link>
                                            <Link to="/addresses" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <span>🏠</span> Saved Addresses
                                            </Link>
                                            <div className="dropdown-divider"></div>
                                            {user.isAdmin && (
                                                <>
                                                    <Link to="/admin/dashboard" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                        <span>📊</span> Admin Dashboard
                                                    </Link>
                                                    <div className="dropdown-divider"></div>
                                                </>
                                            )}
                                            <Link to="/settings" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <span>⚙️</span> Settings
                                            </Link>
                                            <button className="dropdown-link logout" onClick={handleLogout}>
                                                <span>🚪</span> Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="auth-buttons desktop-only">
                            <Link to="/login" className="btn-login">Sign In</Link>
                            <Link to="/register" className="btn-register">Sign Up</Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button 
                        ref={mobileMenuBtnRef}
                        className={`mobile-menu-btn ${isOpen ? 'open' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* Mobile Menu - Full Screen Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            className="mobile-menu-overlay"
                            ref={mobileMenuRef}
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mobile-menu-container">
                                <button 
                                    className="mobile-close-btn"
                                    onClick={() => setIsOpen(false)}
                                >
                                    ✕
                                </button>
                                
                                <div className="mobile-menu-links">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className="mobile-nav-link"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="mobile-nav-icon">{link.icon}</span>
                                            <span>{link.name}</span>
                                        </Link>
                                    ))}
                                    <Link to="/cart" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                                        <span className="mobile-nav-icon">🛒</span>
                                        <span>Cart</span>
                                        {cartCount > 0 && <span className="mobile-cart-count">{cartCount}</span>}
                                    </Link>
                                </div>

                                {user ? (
                                    <div className="mobile-user-section">
                                        <div className="mobile-user-header">
                                            <div className="mobile-user-avatar">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="mobile-user-info">
                                                <div className="mobile-user-name">{user.name}</div>
                                                <div className="mobile-user-email">{user.email}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="mobile-menu-items">
                                            <Link to="/profile" className="mobile-menu-item" onClick={() => setIsOpen(false)}>
                                                <span>👤</span> My Profile
                                            </Link>
                                            <Link to="/orders" className="mobile-menu-item" onClick={() => setIsOpen(false)}>
                                                <span>📦</span> My Orders
                                            </Link>
                                            <Link to="/track-order" className="mobile-menu-item" onClick={() => setIsOpen(false)}>
                                                <span>📍</span> Track Order
                                            </Link>
                                            <Link to="/wishlist" className="mobile-menu-item" onClick={() => setIsOpen(false)}>
                                                <span>❤️</span> Wishlist
                                            </Link>
                                            <Link to="/addresses" className="mobile-menu-item" onClick={() => setIsOpen(false)}>
                                                <span>🏠</span> Saved Addresses
                                            </Link>
                                            {user.isAdmin && (
                                                <Link to="/admin/dashboard" className="mobile-menu-item" onClick={() => setIsOpen(false)}>
                                                    <span>📊</span> Admin Dashboard
                                                </Link>
                                            )}
                                            <Link to="/settings" className="mobile-menu-item" onClick={() => setIsOpen(false)}>
                                                <span>⚙️</span> Settings
                                            </Link>
                                            <button className="mobile-menu-item logout" onClick={handleLogout}>
                                                <span>🚪</span> Logout
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mobile-auth-section">
                                        <Link to="/login" className="mobile-login-btn" onClick={() => setIsOpen(false)}>Sign In</Link>
                                        <Link to="/register" className="mobile-register-btn" onClick={() => setIsOpen(false)}>Sign Up</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
        </motion.nav>
    );
};

export default NavigationBar;