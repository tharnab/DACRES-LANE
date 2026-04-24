import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Badge, Button, Modal, Form } from 'react-bootstrap';
import API from '../services/api';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    
    const statusColors = {
        'Pending': 'warning',
        'Confirmed': 'info',
        'Preparing': 'primary',
        'Out for Delivery': 'dark',
        'Delivered': 'success',
        'Cancelled': 'danger'
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/orders/all');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await API.put(`/orders/${selectedOrder._id}/status`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            setShowModal(false);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="admin-orders-loading">
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return (
        <div className="admin-orders-page">
            <div className="admin-orders-hero">
                <Container>
                    <h1>Admin Dashboard</h1>
                    <p>Manage all customer orders</p>
                </Container>
            </div>

            <Container className="admin-orders-container">
                <div className="stats-cards">
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>{orders.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending</h3>
                        <p>{orders.filter(o => o.status === 'Pending').length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Delivered</h3>
                        <p>{orders.filter(o => o.status === 'Delivered').length}</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <p>No orders yet</p>
                    </div>
                ) : (
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>#{order._id.slice(-8)}</td>
                                        <td>
                                            <div className="customer-info">
                                                <strong>{order.user?.name}</strong>
                                                <small>{order.user?.email}</small>
                                            </div>
                                        </td>
                                        <td>{order.items.length} items</td>
                                        <td>₹{order.totalAmount}</td>
                                        <td>
                                            <Badge bg={statusColors[order.status]}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button 
                                                size="sm" 
                                                variant="outline-primary"
                                                onClick={() => openStatusModal(order)}
                                            >
                                                Update Status
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Container>

            {/* Update Status Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Order Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Order ID:</strong> #{selectedOrder?._id?.slice(-8)}</p>
                    <p><strong>Customer:</strong> {selectedOrder?.user?.name}</p>
                    <p><strong>Total:</strong> ₹{selectedOrder?.totalAmount}</p>
                    <Form.Group className="mt-3">
                        <Form.Label>Select Status</Form.Label>
                        <Form.Select 
                            value={newStatus} 
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateStatus}>
                        Update Status
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminOrders;