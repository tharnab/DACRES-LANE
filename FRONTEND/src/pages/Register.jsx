import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        const success = await register(name, email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Registration failed. Email may already exist.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-shape shape-1"></div>
            <div className="auth-bg-shape shape-2"></div>
            
            <Container className="auth-container">
                <motion.div 
                    className="auth-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="auth-header">
                        <div className="auth-logo">🍕</div>
                        <h2>Create Account</h2>
                        <p>Join DACRES LANE for delicious food</p>
                    </div>

                    {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label>Full Name</Form.Label>
                            <div className="input-group-custom">
                                <span className="input-icon">👤</span>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Email Address</Form.Label>
                            <div className="input-group-custom">
                                <span className="input-icon">📧</span>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <div className="input-group-custom">
                                <span className="input-icon">🔒</span>
                                <Form.Control
                                    type="password"
                                    placeholder="Create a password (min. 6 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Confirm Password</Form.Label>
                            <div className="input-group-custom">
                                <span className="input-icon">✓</span>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <motion.button 
                            type="submit" 
                            className="auth-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Create Account
                        </motion.button>
                    </Form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default Register;