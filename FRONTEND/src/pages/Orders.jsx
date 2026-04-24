import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        delivered: 0,
        cancelled: 0
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/orders/myorders');
            setOrders(data);
            
            // Calculate stats
            const total = data.length;
            const pending = data.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Preparing').length;
            const delivered = data.filter(o => o.status === 'Delivered').length;
            const cancelled = data.filter(o => o.status === 'Cancelled').length;
            
            setStats({ total, pending, delivered, cancelled });
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Pending': 'warning',
            'Confirmed': 'info',
            'Preparing': 'primary',
            'Out for Delivery': 'dark',
            'Delivered': 'success',
            'Cancelled': 'danger'
        };
        return colors[status] || 'secondary';
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {/* Floating Shapes */}
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>
            <div className="bg-shape shape-3"></div>

            <Container className="orders-container">
                {/* Header */}
                <div className="orders-header">
                    <div className="orders-header-icon">📦</div>
                    <h1 className="orders-header-title">My Orders</h1>
                    <p className="orders-header-subtitle">Track and manage all your orders</p>
                </div>

                {/* Stats Cards */}
                {orders.length > 0 && (
                    <div className="stats-section">
                        {/* <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <h3>{stats.total}</h3>
                                <p>Total Orders</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏳</div>
                                <h3>{stats.pending}</h3>
                                <p>Active Orders</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <h3>{stats.delivered}</h3>
                                <p>Delivered</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">❌</div>
                                <h3>{stats.cancelled}</h3>
                                <p>Cancelled</p>
                            </div>
                        </div> */}
                    </div>
                )}

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">🍽️</div>
                        <h3>No Orders Yet</h3>
                        <p>Looks like you haven't placed any orders yet</p>
                        <Link to="/menu" className="browse-btn">Browse Menu</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <Card key={order._id} className="order-card">
                                <Card.Body>
                                    <div className="order-header">
                                        <div>
                                            <span className="order-id">Order #{order._id.slice(-8)}</span>
                                            <Badge bg={getStatusBadge(order.status)} className="order-status">
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <div className="order-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="order-item">
                                                <div className="item-info">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-quantity">x{item.quantity}</span>
                                                </div>
                                                <span className="item-price">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="order-footer">
                                        <strong className="order-total">Total: ₹{order.totalAmount}</strong>
                                        <Link to={`/track-order/${order._id}`} className="track-order-btn">
                                            Track Order →
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Orders;