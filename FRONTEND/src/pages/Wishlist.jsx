import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import API from '../services/api';
import toast from 'react-hot-toast';


const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/wishlist');
            setWishlist(data);
        } catch (error) {
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (foodId) => {
        try {
            await API.delete(`/wishlist/remove/${foodId}`);
            toast.success('Removed from wishlist');
            fetchWishlist();
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const addToCart = async (foodId) => {
        try {
            await API.post('/cart/add', { foodId, quantity: 1 });
            toast.success('Added to cart!');
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="wishlist-loading">
                <Spinner animation="border" variant="danger" />
                <p>Loading wishlist...</p>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-hero">
                <Container>
                    <motion.h1 
                        className="wishlist-title"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        My Wishlist
                    </motion.h1>
                    <motion.p 
                        className="wishlist-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Your favorite items
                    </motion.p>
                </Container>
            </div>

            <Container className="wishlist-container">
                {wishlist.length === 0 ? (
                    <div className="empty-wishlist">
                        <div className="empty-icon">❤️</div>
                        <h3>Your wishlist is empty</h3>
                        <a href="/menu" className="browse-wishlist-btn">Browse Menu</a>
                    </div>
                ) : (
                    <Row>
                        {wishlist.map((item, idx) => (
                            <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="wishlist-card">
                                        <Card.Img variant="top" src={item.imageUrl} />
                                        <Card.Body>
                                            <Card.Title>{item.name}</Card.Title>
                                            <Card.Text>₹{item.price}</Card.Text>
                                            <div className="wishlist-buttons">
                                                <Button size="sm" variant="danger" onClick={() => addToCart(item._id)}>
                                                    Add to Cart
                                                </Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => removeFromWishlist(item._id)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Wishlist;