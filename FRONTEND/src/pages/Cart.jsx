import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Modal, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/cart');
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (foodId, quantity) => {
        if (quantity < 1) return;
        try {
            const { data } = await API.put('/cart/update', { foodId, quantity });
            setCart(data.cart);
            toast.success('Cart updated');
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const removeFromCart = async (foodId) => {
        try {
            const { data } = await API.delete(`/cart/remove/${foodId}`);
            setCart(data.cart);
            toast.success('Removed from cart');
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const clearCart = async () => {
        try {
            await API.delete('/cart/clear');
            await fetchCart();
            toast.success('Cart cleared');
        } catch (error) {
            toast.error('Failed to clear cart');
        }
    };

    const placeOrder = async () => {
        setPlacingOrder(true);
        try {
            await API.post('/orders', {});
            toast.success('Order placed successfully!');
            setShowConfirm(false);
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="cart-loading">
                <div className="loader"></div>
            </div>
        );
    }

    if (!cart || cart.items?.length === 0) {
        return (
            <div className="cart-page">
                <Container className="cart-container">
                    <div className="cart-hero">
                        <div className="cart-hero-icon">🛒</div>
                        <h1>Your Cart</h1>
                        <p>Looks like your cart is empty</p>
                    </div>
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🍽️</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items yet</p>
                        <Link to="/menu" className="browse-btn">Browse Menu</Link>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Container className="cart-container">
                <div className="cart-hero">
                    <div className="cart-hero-icon">🛒</div>
                    <h1>Your Cart</h1>
                    <p>{cart.totalItems} items • ₹{cart.totalPrice}</p>
                </div>

                <div className="cart-items">
                    {cart.items.map((item) => (
                        <div key={item.food} className="cart-item">
                            <div className="cart-item-info">
                                <h5>{item.name}</h5>
                                <div className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                                    {item.isVeg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
                                </div>
                                <div className="cart-item-price">₹{item.price}</div>
                            </div>
                            
                            <div className="cart-item-actions">
                                <div className="quantity-control">
                                    <button 
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.food, item.quantity - 1)}
                                    >
                                        −
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button 
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.food, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.food)}
                                >
                                    Remove
                                </button>
                            </div>
                            
                            <div className="cart-item-total">
                                ₹{item.price * item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-actions">
                    <Button variant="outline-danger" className="clear-cart-btn" onClick={clearCart}>
                        Clear Cart
                    </Button>
                    <Link to="/menu">
                        <Button className="add-more-btn">Add More Items</Button>
                    </Link>
                </div>

                <Card className="order-summary">
                    <Card.Body>
                        <h4>Order Summary</h4>
                        <div className="summary-row">
                            <span>Items ({cart.totalItems})</span>
                            <span>₹{cart.totalPrice}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>₹40</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <span>₹{cart.totalPrice + 40}</span>
                        </div>
                        <Button 
                            className="checkout-btn"
                            onClick={() => setShowConfirm(true)}
                        >
                            Place Order
                        </Button>
                    </Card.Body>
                </Card>
            </Container>

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to place this order?</p>
                    <p><strong>Total Amount: ₹{cart.totalPrice + 40}</strong></p>
                    <p className="text-muted small">Order will be saved to your orders section</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={placeOrder}
                        disabled={placingOrder}
                        style={{ background: '#C4A062', border: 'none' }}
                    >
                        {placingOrder ? 'Placing Order...' : 'Confirm Order'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Cart;