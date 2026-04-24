import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './UnderConstruction.css';

const UnderConstruction = () => {
    return (
        <div className="under-construction">
            <Container className="construction-container">
                <motion.div
                    className="construction-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="construction-icon">🚧</div>
                    
                    <h1>Page Under Construction</h1>
                    
                    <div className="construction-message">
                        <p>This page is currently being built.</p>
                        <p>We're working hard to bring you something amazing!</p>
                    </div>
                    
                    <div className="progress-bar-container">
                        <div className="progress-bar">
                            <motion.div 
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            ></motion.div>
                        </div>
                        <span className="progress-text">65% Complete</span>
                    </div>
                    
                    <div className="construction-features">
                        <h3>Coming Soon:</h3>
                        <ul>
                            <li>✨ Real-time order tracking</li>
                            <li>💳 Payment gateway integration</li>
                            <li>🔔 Push notifications</li>
                            <li>⭐ User reviews & ratings</li>
                            <li>🎁 Loyalty points system</li>
                        </ul>
                    </div>
                    
                    <Button as={Link} to="/" className="home-btn">
                        🏠 Return to Home
                    </Button>
                    
                    <div className="construction-note">
                        <p>⚡ Check back soon! Meanwhile, explore our delicious menu.</p>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default UnderConstruction;