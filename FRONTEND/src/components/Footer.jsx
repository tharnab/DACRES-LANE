import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <Container>
                <Row className="footer-content">
                    {/* Brand Section */}
                    <Col lg={4} md={6} className="mb-4 mb-lg-0">
                        <div className="footer-brand">
                            <div className="brand-icon">🍕</div>
                            <h3>DACRES LANE</h3>
                            <p>Authentic Bengali flavors delivered to your doorstep with love and care since 2024.</p>
                        </div>
                        <div className="social-icons">
                            <a href="#" className="social-icon">📘</a>
                            <a href="#" className="social-icon">📷</a>
                            <a href="#" className="social-icon">🐦</a>
                            <a href="#" className="social-icon">▶️</a>
                        </div>
                    </Col>

                    {/* Quick Links */}
                    <Col lg={2} md={6} className="mb-4 mb-lg-0">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                        </ul>
                    </Col>

                    {/* Support */}
                    <Col lg={3} md={6} className="mb-4 mb-md-0">
                        <h4>Support</h4>
                        <ul className="footer-links">
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </Col>

                    {/* Contact Info */}
                    <Col lg={3} md={6}>
                        <h4>Get in Touch</h4>
                        <ul className="footer-contact">
                            <li>
                                <span className="contact-icon">📍</span>
                                <span>Park Street, Kolkata - 700001</span>
                            </li>
                            <li>
                                <span className="contact-icon">📞</span>
                                <span>+91 12345 67890</span>
                            </li>
                            <li>
                                <span className="contact-icon">✉️</span>
                                <span>info@dacreslane.com</span>
                            </li>
                            <li>
                                <span className="contact-icon">⏰</span>
                                <span>11:00 AM - 10:00 PM</span>
                            </li>
                        </ul>
                    </Col>
                </Row>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>&copy; {currentYear} DACRES LANE. All rights reserved.</p>
                    <p>Made with ❤️ for food lovers</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;