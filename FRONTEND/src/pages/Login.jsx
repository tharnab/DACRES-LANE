import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid email or password');
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
                        <h2>Welcome Back!</h2>
                        <p>Login to continue to DACRES LANE</p>
                    </div>

                    {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <div className="forgot-link">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <motion.button 
                            type="submit" 
                            className="auth-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Login
                        </motion.button>
                    </Form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default Login;