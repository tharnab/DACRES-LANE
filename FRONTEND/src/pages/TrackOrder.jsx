import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import toast from 'react-hot-toast';
import './TrackOrder.css';

const TrackOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setOrderId(id);
            fetchOrderById(id);
        }
    }, [id]);

    const fetchOrderById = async (orderId) => {
        setLoading(true);
        try {
            const { data } = await API.get(`/orders/${orderId}`);
            setOrder(data);
        } catch (error) {
            toast.error('Order not found');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId) {
            toast.error('Please enter order ID');
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await API.get(`/orders/${orderId}`);
            setOrder(data);
            navigate(`/track-order/${orderId}`);
        } catch (error) {
            toast.error('Order not found');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const getStepStatus = (orderStatus) => {
        const steps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
        const currentIndex = steps.indexOf(orderStatus);
        return steps.map((step, idx) => ({
            name: step,
            active: idx <= currentIndex,
            completed: idx < currentIndex
        }));
    };

    const steps = getStepStatus(order?.status || 'Pending');

    return (
        <div className="track-page">
            {/* Floating Background Elements */}
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>
            <div className="bg-shape shape-3"></div>

            <Container className="track-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header Section */}
                    <div className="track-header">
                        <div className="track-header-icon">📍</div>
                        <h1 className="track-header-title">Track Your Order</h1>
                        <p className="track-header-subtitle">Real-time delivery updates at your fingertips</p>
                    </div>

                    {/* Search Card */}
                    <Card className="track-search-card">
                        <Card.Body>
                            <Form onSubmit={handleTrack}>
                                <div className="search-input-wrapper">
                                    <span className="search-icon">🔍</span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your order ID (e.g., ORD2401012345)"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="search-input"
                                    />
                                    <Button type="submit" className="track-btn" disabled={loading}>
                                        {loading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            'Track Now'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Loading State */}
                    {loading && (
                        <div className="loading-state">
                            <div className="loader"></div>
                            <p>Fetching your order details...</p>
                        </div>
                    )}

                    {/* Order Result */}
                    {order && (
                        <motion.div
                            className="order-result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Order Header */}
                            <div className="order-result-header">
                                <div className="order-badge">
                                    <span className="order-icon">📋</span>
                                    <span>Order #{order._id?.slice(-8)}</span>
                                </div>
                                <div className={`order-status-badge ${order.status?.toLowerCase()}`}>
                                    {order.status}
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="tracking-timeline">
                                {steps.map((step, idx) => (
                                    <div key={idx} className={`timeline-step ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
                                        <div className="timeline-dot">
                                            {step.completed ? (
                                                <span className="dot-check">✓</span>
                                            ) : (
                                                <span className="dot-number">{idx + 1}</span>
                                            )}
                                        </div>
                                        <div className="timeline-content">
                                            <h4>{step.name}</h4>
                                            <p>{step.active ? 'Current status' : step.completed ? 'Completed' : 'Pending'}</p>
                                        </div>
                                        {idx < steps.length - 1 && <div className="timeline-line"></div>}
                                    </div>
                                ))}
                            </div>

                            {/* Order Details Grid */}
                            <div className="order-details-grid">
                                <div className="detail-card">
                                    <div className="detail-icon">💰</div>
                                    <div className="detail-info">
                                        <span className="detail-label">Total Amount</span>
                                        <span className="detail-value">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                                <div className="detail-card">
                                    <div className="detail-icon">📦</div>
                                    <div className="detail-info">
                                        <span className="detail-label">Items</span>
                                        <span className="detail-value">{order.items?.length} items</span>
                                    </div>
                                </div>
                                <div className="detail-card">
                                    <div className="detail-icon">📅</div>
                                    <div className="detail-info">
                                        <span className="detail-label">Order Date</span>
                                        <span className="detail-value">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="detail-card">
                                    <div className="detail-icon">⏰</div>
                                    <div className="detail-info">
                                        <span className="detail-label">Est. Delivery</span>
                                        <span className="detail-value">45 mins</span>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="items-section">
                                <h3 className="items-title">
                                    <span>🍽️</span> Order Summary
                                </h3>
                                <div className="items-list">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="item-row">
                                            <div className="item-info">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-qty">x{item.quantity}</span>
                                            </div>
                                            <span className="item-price">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="items-total">
                                    <span>Grand Total</span>
                                    <span>₹{order.totalAmount}</span>
                                </div>
                            </div>

                            {/* Need Help Section */}
                            <div className="need-help">
                                <div className="help-icon">💬</div>
                                <div className="help-content">
                                    <h4>Need Help?</h4>
                                    <p>Contact our support team for any assistance with your order</p>
                                    <Button variant="outline-primary" size="sm">Contact Support</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </Container>
        </div>
    );
};

export default TrackOrder;