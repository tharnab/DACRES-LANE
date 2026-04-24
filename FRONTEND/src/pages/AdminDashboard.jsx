import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Table, Badge, Spinner, Tabs, Tab } from 'react-bootstrap';
import API from '../services/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);
    
    // Orders state
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    
    // Foods state
    const [foods, setFoods] = useState([]);
    const [showFoodModal, setShowFoodModal] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [foodForm, setFoodForm] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Lunch',
        imageUrl: '',
        isAvailable: true,
        rating: 0,
        isVeg: true
    });
    
    // Stats
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalFoods: 0,
        availableFoods: 0
    });

    const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    const statusColors = {
        'Pending': 'warning',
        'Confirmed': 'info',
        'Preparing': 'primary',
        'Out for Delivery': 'dark',
        'Delivered': 'success',
        'Cancelled': 'danger'
    };
    const categories = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner', 'Beverage'];

    useEffect(() => {
        fetchOrders();
        fetchFoods();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await API.get('/orders/all');
            setOrders(data);
            setStats(prev => ({
                ...prev,
                totalOrders: data.length,
                pendingOrders: data.filter(o => o.status === 'Pending').length
            }));
        } catch (error) {
            toast.error('Failed to fetch orders');
        }
    };

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/foods');
            setFoods(data);
            setStats(prev => ({
                ...prev,
                totalFoods: data.length,
                availableFoods: data.filter(f => f.isAvailable).length
            }));
        } catch (error) {
            toast.error('Failed to fetch foods');
        } finally {
            setLoading(false);
        }
    };

    // Order Management
    const handleUpdateStatus = async () => {
        try {
            await API.put(`/orders/${selectedOrder._id}/status`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            setShowOrderModal(false);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // Food Management
    const handleFoodSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFood) {
                await API.put(`/foods/${editingFood._id}`, foodForm);
                toast.success('Food updated successfully');
            } else {
                await API.post('/foods', foodForm);
                toast.success('Food added successfully');
            }
            setShowFoodModal(false);
            resetFoodForm();
            fetchFoods();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save food');
        }
    };

    const handleDeleteFood = async (foodId) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            try {
                await API.delete(`/foods/${foodId}`);
                toast.success('Food deleted successfully');
                fetchFoods();
            } catch (error) {
                toast.error('Failed to delete food');
            }
        }
    };

    const editFood = (food) => {
        setEditingFood(food);
        setFoodForm({
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category,
            imageUrl: food.imageUrl || '',
            isAvailable: food.isAvailable,
            rating: food.rating || 0,
            isVeg: food.isVeg
        });
        setShowFoodModal(true);
    };

    const resetFoodForm = () => {
        setEditingFood(null);
        setFoodForm({
            name: '',
            description: '',
            price: '',
            category: 'Lunch',
            imageUrl: '',
            isAvailable: true,
            rating: 0,
            isVeg: true
        });
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <Container>
                    <h1>Admin Dashboard</h1>
                    <p>Manage orders, menu items, and more</p>
                </Container>
            </div>

            <Container className="admin-container">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p>{stats.totalOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <h3>Pending Orders</h3>
                            <p>{stats.pendingOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🍽️</div>
                        <div className="stat-info">
                            <h3>Total Menu Items</h3>
                            <p>{stats.totalFoods}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Available Items</h3>
                            <p>{stats.availableFoods}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        📋 Orders
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
                        onClick={() => setActiveTab('menu')}
                    >
                        🍕 Menu Management
                    </button>
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="orders-section">
                        <div className="section-header">
                            <h2>All Orders</h2>
                        </div>
                        {orders.length === 0 ? (
                            <div className="empty-state">No orders yet</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="admin-table">
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
                                                    <div className="customer-cell">
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
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setNewStatus(order.status);
                                                            setShowOrderModal(true);
                                                        }}
                                                    >
                                                        Update
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Menu Management Tab */}
                {activeTab === 'menu' && (
                    <div className="menu-section">
                        <div className="section-header">
                            <h2>Menu Management</h2>
                            <Button 
                                variant="danger" 
                                onClick={() => {
                                    resetFoodForm();
                                    setShowFoodModal(true);
                                }}
                            >
                                + Add New Food
                            </Button>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Veg/Non-Veg</th>
                                        <th>Status</th>
                                        <th>Rating</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foods.map((food) => (
                                        <tr key={food._id}>
                                            <td>
                                                <img 
                                                    src={food.imageUrl || 'https://via.placeholder.com/50'} 
                                                    alt={food.name}
                                                    className="food-thumb"
                                                />
                                            </td>
                                            <td>{food.name}</td>
                                            <td>{food.category}</td>
                                            <td>₹{food.price}</td>
                                            <td>
                                                <Badge bg={food.isVeg ? 'success' : 'danger'}>
                                                    {food.isVeg ? 'Veg' : 'Non-Veg'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={food.isAvailable ? 'success' : 'secondary'}>
                                                    {food.isAvailable ? 'Available' : 'Out of Stock'}
                                                </Badge>
                                            </td>
                                            <td>⭐ {food.rating}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline-warning"
                                                        onClick={() => editFood(food)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline-danger"
                                                        onClick={() => handleDeleteFood(food._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Container>

            {/* Update Status Modal */}
            <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} centered>
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
                    <Button variant="secondary" onClick={() => setShowOrderModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdateStatus}>Update</Button>
                </Modal.Footer>
            </Modal>

            {/* Add/Edit Food Modal */}
            <Modal show={showFoodModal} onHide={() => setShowFoodModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFoodSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Food Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={foodForm.name}
                                onChange={(e) => setFoodForm({...foodForm, name: e.target.value})}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={foodForm.description}
                                onChange={(e) => setFoodForm({...foodForm, description: e.target.value})}
                                required
                            />
                        </Form.Group>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (₹) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={foodForm.price}
                                        onChange={(e) => setFoodForm({...foodForm, price: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Category *</Form.Label>
                                    <Form.Select
                                        value={foodForm.category}
                                        onChange={(e) => setFoodForm({...foodForm, category: e.target.value})}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={foodForm.imageUrl}
                                onChange={(e) => setFoodForm({...foodForm, imageUrl: e.target.value})}
                            />
                        </Form.Group>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={foodForm.rating}
                                        onChange={(e) => setFoodForm({...foodForm, rating: e.target.value})}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Food Type</Form.Label>
                                    <Form.Select
                                        value={foodForm.isVeg}
                                        onChange={(e) => setFoodForm({...foodForm, isVeg: e.target.value === 'true'})}
                                    >
                                        <option value="true">Vegetarian</option>
                                        <option value="false">Non-Vegetarian</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Availability</Form.Label>
                            <Form.Select
                                value={foodForm.isAvailable}
                                onChange={(e) => setFoodForm({...foodForm, isAvailable: e.target.value === 'true'})}
                            >
                                <option value="true">Available</option>
                                <option value="false">Out of Stock</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowFoodModal(false)}>Cancel</Button>
                        <Button variant="danger" type="submit">Save Food Item</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;