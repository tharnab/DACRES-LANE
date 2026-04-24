import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import API from '../services/api';
import toast from 'react-hot-toast';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await API.get('/foods');
      setFoods(data);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (foodId) => {
    try {
      await API.post('/cart/add', { foodId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Please login first');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">Our Menu</h1>
      <Row>
        {foods.map((food) => (
          <Col key={food._id} md={4} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={food.imageUrl || 'https://via.placeholder.com/300x200?text=Food'} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{food.name}</Card.Title>
                <Card.Text>{food.description?.substring(0, 80)}...</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="text-danger">${food.price}</h5>
                  <Button variant="danger" size="sm" onClick={() => addToCart(food._id)}>
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Menu;