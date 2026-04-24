import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import API from '../services/api';
import toast from 'react-hot-toast';
import './Menu.css';

const Menu = () => {
    const [allFoods, setAllFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Breakfast');
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: 'Breakfast', icon: '🌅' },
        { name: 'Lunch', icon: '🍛' },
        { name: 'Evening Snacks', icon: '☕' },
        { name: 'Dinner', icon: '🌙' },
        { name: 'Beverage', icon: '🥤' }
    ];

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/foods');
            setAllFoods(data);
            const breakfastItems = data.filter(food => food.category === 'Breakfast');
            setFilteredFoods(breakfastItems);
        } catch (error) {
            toast.error('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    const filterByCategory = (category) => {
        setActiveCategory(category);
        const filtered = allFoods.filter(food => food.category === category);
        setFilteredFoods(filtered);
    };

    const addToCart = async (foodId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                return;
            }
            await API.post('/cart/add', { foodId, quantity: 1 });
            toast.success('Added to cart! 🛒');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="danger" />
                <p className="mt-2">Loading menu...</p>
            </div>
        );
    }

    return (
        <div className="menu-page">
            {/* Hero Section */}
            <div className="menu-hero">
                <Container>
                    <h1 className="menu-hero-title">Our Menu</h1>
                    <p className="menu-hero-subtitle">Discover the authentic flavors of Bengal</p>
                </Container>
            </div>

            <Container>
                {/* Filter Buttons */}
                <div className="filter-buttons-wrapper">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            className={`filter-btn ${activeCategory === category.name ? 'active' : ''}`}
                            onClick={() => filterByCategory(category.name)}
                        >
                            <span className="filter-icon">{category.icon}</span>
                            <span className="filter-name">{category.name}</span>
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <div className="results-count">
                    {filteredFoods.length} items found
                </div>

                {/* Food Grid */}
                {filteredFoods.length === 0 ? (
                    <div className="empty-menu">
                        <p>No items found in {activeCategory} category</p>
                    </div>
                ) : (
                    <Row className="food-grid">
                        {filteredFoods.map((food) => (
                            <Col key={food._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                <Card className="menu-card">
                                    <Card.Img 
                                        variant="top" 
                                        src={food.imageUrl || 'https://via.placeholder.com/300x200?text=Food'} 
                                        className="menu-card-img"
                                    />
                                    <Card.Body>
                                        <div className="food-type-badge">
                                            <span className={`badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
                                                {food.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                                            </span>
                                        </div>
                                        <Card.Title className="food-name">{food.name}</Card.Title>
                                        <Card.Text className="food-description">
                                            {food.description?.substring(0, 70)}...
                                        </Card.Text>
                                        <div className="food-footer">
                                            <div className="food-price">₹{food.price}</div>
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                className="add-to-cart-btn"
                                                onClick={() => addToCart(food._id)}
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Menu;