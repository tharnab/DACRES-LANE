import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <Container className="hero-content">
            <h1 className="restaurant-name">DACRES LANE</h1>
            <p className="restaurant-year">2026</p>
            <Button as={Link} to="/menu" className="reserve-btn">
              Order Now →
            </Button>
          </Container>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section">
        <Container>
          <Row>
            <Col md={4}>
              <div className="service-card">
                <div className="service-icon">🍽️</div>
                <h3>Services</h3>
                <p>TAKEAWAY<br />DELIVERY</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="service-card">
                <div className="service-icon">📍</div>
                <h3>Location</h3>
                <p>EAST VILLAGE →<br />KOLKATA, 700001</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="service-card">
                <div className="service-icon">👨‍🍳</div>
                <h3>Founder</h3>
                <p>DACRES LANE<br />EST. 2024</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Menu Section */}
      <div className="popular-section">
        <Container>
          <h2 className="section-title">POPULAR DISHES</h2>
          <Row>
            <Col md={4}>
              <Card className="menu-card">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500" 
                  className="menu-card-img"
                />
                <Card.Body className="menu-card-body">
                  <Card.Title className="menu-card-title">Margherita Pizza</Card.Title>
                  <Card.Text className="menu-card-text">
                    Fresh mozzarella, tomato sauce, and basil
                  </Card.Text>
                  <div className="price">$12.99</div>
                  <Button className="add-to-cart-btn">Add to Cart</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="menu-card">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1550304943-4f24f54dd8df?w=500" 
                  className="menu-card-img"
                />
                <Card.Body className="menu-card-body">
                  <Card.Title className="menu-card-title">Caesar Salad</Card.Title>
                  <Card.Text className="menu-card-text">
                    Romaine lettuce, parmesan cheese, croutons
                  </Card.Text>
                  <div className="price">$8.99</div>
                  <Button className="add-to-cart-btn">Add to Cart</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="menu-card">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" 
                  className="menu-card-img"
                />
                <Card.Body className="menu-card-body">
                  <Card.Title className="menu-card-title">Chocolate Cake</Card.Title>
                  <Card.Text className="menu-card-text">
                    Rich chocolate layer cake with fudge frosting
                  </Card.Text>
                  <div className="price">$6.99</div>
                  <Button className="add-to-cart-btn">Add to Cart</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="view-all-btn">
            <Button as={Link} to="/menu" className="btn">
              View Full Menu →
            </Button>
          </div>
        </Container>
      </div>

      {/* About Section */}
      <div className="about-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="about-title">ABOUT DACRES LANE</h2>
              <p className="about-text">
                Since 2024, we've been serving authentic flavors with a modern twist. 
                Our passion for food and commitment to quality makes every meal 
                an unforgettable experience.
              </p>
              <p className="about-text">
                From our kitchen to your table, we bring you the finest ingredients 
                prepared with love and expertise.
              </p>
            </Col>
            <Col md={6}>
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

      {/* Info Section (Hours & Contact) */}
      <div className="info-section">
        <Container>
          <Row>
            <Col md={6}>
              <div className="info-card">
                <div className="info-icon">🕐</div>
                <h3>OPENING HOURS</h3>
                <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 12:00 PM - 11:00 PM</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>CONTACT US</h3>
                <p>📞 +91 12345 67890</p>
                <p>📧 info@dacreslane.com</p>
                <p>📍 Park Street, Kolkata - 700001</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;