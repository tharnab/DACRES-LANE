import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
    const [popularFoods, setPopularFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [whiteOverlayVisible, setWhiteOverlayVisible] = useState(false);
    
    const heroBgRef = useRef(null);
    const servicesRef = useRef(null);
    const popularRef = useRef(null);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);

    useEffect(() => {
        fetchPopularFoods();
        
        // Parallax effect on scroll
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setScrollY(scrollPosition);
            
            // Parallax background movement
            if (heroBgRef.current) {
                heroBgRef.current.style.transform = `translateY(${scrollPosition * 0.3}px) scale(1.05)`;
            }
            
            // White overlay reveals from bottom
            if (scrollPosition > 50) {
                setWhiteOverlayVisible(true);
            } else {
                setWhiteOverlayVisible(false);
            }
            
            // Scroll reveal for sections
            const sections = [
                { ref: servicesRef, className: 'services-section' },
                { ref: popularRef, className: 'popular-section' },
                { ref: aboutRef, className: 'about-section' },
                { ref: contactRef, className: 'contact-section' }
            ];
            
            sections.forEach(section => {
                if (section.ref.current) {
                    const rect = section.ref.current.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight - 100;
                    if (isVisible) {
                        section.ref.current.classList.add('revealed');
                    }
                }
            });
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchPopularFoods = async () => {
        try {
            const { data } = await API.get('/foods');
            const topRated = data.sort((a, b) => b.rating - a.rating).slice(0, 6);
            setPopularFoods(topRated);
        } catch (error) {
            console.error('Error fetching foods:', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <>
            {/* Hero Section */}
            <div className="home-hero">
                <div className="hero-bg" ref={heroBgRef}></div>
                <div className={`hero-white-overlay ${whiteOverlayVisible ? 'visible' : ''}`}></div>
                <div className="hero-overlay">
                    <Container className="hero-content">
                        <h1 className="hero-title">
                            <span className="hero-title-line">DACRES</span>
                            <span className="hero-title-line">LANE</span>
                        </h1>
                        <p className="hero-year">2026</p>
                        <Link to="/menu">
                            <button className="order-btn">
                                Order Now
                                <span className="btn-arrow">→</span>
                            </button>
                        </Link>
                    </Container>
                </div>
                <div className="scroll-indicator">
                    <span>Scroll to explore</span>
                    <div className="scroll-mouse"></div>
                </div>
            </div>

            {/* Services Section */}
            <div className="services-section" ref={servicesRef}>
                <Container>
                    <Row>
                        <Col xs={12} md={4}>
                            <div className="service-card">
                                <div className="service-icon">🍽️</div>
                                <h3>Services</h3>
                                <p>TAKEAWAY<br />DELIVERY</p>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="service-card">
                                <div className="service-icon">📍</div>
                                <h3>Location</h3>
                                <p>EAST VILLAGE →<br />KOLKATA, 700001</p>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="service-card">
                                <div className="service-icon">👨‍🍳</div>
                                <h3>Founder</h3>
                                <p>DACRES LANE<br />EST. 2024</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Popular Dishes Section */}
            <div className="popular-section" ref={popularRef}>
                <Container>
                    <h2 className="section-title">POPULAR DISHES</h2>
                    <div className="section-title-line"></div>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                        </div>
                    ) : popularFoods.length === 0 ? (
                        <div className="text-center py-5">
                            <p>No dishes found. Add some food items to the database.</p>
                        </div>
                    ) : (
                        <Row>
                            {popularFoods.map((food) => (
                                <Col key={food._id} xs={12} sm={6} lg={4} className="mb-4">
                                    <Card className="popular-card">
                                        <div className="card-img-wrapper">
                                            <Card.Img 
                                                variant="top" 
                                                src={food.imageUrl || 'https://via.placeholder.com/400x250?text=Food'} 
                                                className="popular-card-img"
                                            />
                                            <div className="card-overlay">
                                                <Button 
                                                    variant="light" 
                                                    size="sm"
                                                    className="quick-add-btn"
                                                    onClick={() => addToCart(food._id)}
                                                >
                                                    Quick Add
                                                </Button>
                                            </div>
                                            {food.rating >= 4.5 && (
                                                <div className="bestseller-badge">⭐ Bestseller</div>
                                            )}
                                        </div>
                                        <Card.Body>
                                            <div className="food-type">
                                                <span className={`type-badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
                                                    {food.isVeg ? 'VEG' : 'NON-VEG'}
                                                </span>
                                            </div>
                                            <Card.Title className="popular-card-title">{food.name}</Card.Title>
                                            <Card.Text className="popular-card-text">
                                                {food.description?.substring(0, 60)}...
                                            </Card.Text>
                                            <div className="popular-card-footer">
                                                <span className="popular-price">₹{food.price}</span>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm"
                                                    className="add-btn"
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
                    
                    <div className="view-all-container">
                        <Link to="/menu">
                            <button className="view-all-btn">View Full Menu →</button>
                        </Link>
                    </div>
                </Container>
            </div>

            {/* About Section */}
            <div className="about-section" ref={aboutRef}>
                <Container>
                    <Row className="align-items-center">
                        <Col xs={12} md={6}>
                            <h2 className="about-title">ABOUT DACRES LANE</h2>
                            <p className="about-text">
                                Since 2026, we've been serving authentic flavors with a modern twist. 
                                Our passion for food and commitment to quality makes every meal 
                                an unforgettable experience.
                            </p>
                            <p className="about-text">
                                From our kitchen to your table, we bring you the finest ingredients 
                                prepared with love and expertise.
                            </p>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="about-image">
                                <img 
                                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600" 
                                    alt="Restaurant Interior" 
                                    className="img-fluid"
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Contact Section */}
            {/* <div className="contact-section" ref={contactRef}>
                <Container>
                    <Row>
                        <Col xs={12} md={6}>
                            <div className="contact-card">
                                <div className="contact-icon">🕐</div>
                                <h3>OPENING HOURS</h3>
                                <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                                <p>Saturday - Sunday: 12:00 PM - 11:00 PM</p>
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="contact-card">
                                <div className="contact-icon">📞</div>
                                <h3>CONTACT US</h3>
                                <p>📞 +91 12345 67890</p>
                                <p>📧 info@dacreslane.com</p>
                                <p>📍 Park Street, Kolkata - 700001</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div> */}
        </>
    );
};

export default Home;