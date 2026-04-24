import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import API from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      await API.delete(`/cart/remove/${foodId}`);
      toast.success('Removed from cart');
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  if (cart.items?.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2>Your cart is empty</h2>
        <Button href="/menu" variant="danger" className="mt-3">Browse Menu</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Your Cart</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.items?.map((item) => (
            <tr key={item.food?._id}>
              <td>{item.food?.name}</td>
              <td>${item.food?.price}</td>
              <td>{item.quantity}</td>
              <td>${(item.food?.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => removeFromCart(item.food?._id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Card className="mt-4">
        <Card.Body>
          <h4>Total: ${cart.totalPrice?.toFixed(2)}</h4>
          <Button variant="success">Proceed to Checkout</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Cart;