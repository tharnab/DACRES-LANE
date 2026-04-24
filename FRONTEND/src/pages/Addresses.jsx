import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import API from '../services/api';
import toast from 'react-hot-toast';


const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        landmark: '',
        city: '',
        pincode: ''
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/addresses');
            setAddresses(data);
        } catch (error) {
            toast.error('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async () => {
        try {
            await API.post('/addresses', formData);
            toast.success('Address added successfully');
            setShowModal(false);
            fetchAddresses();
            setFormData({ name: '', phone: '', address: '', landmark: '', city: '', pincode: '' });
        } catch (error) {
            toast.error('Failed to add address');
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/addresses/${id}`);
            toast.success('Address deleted');
            fetchAddresses();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="addresses-page">
            <div className="addresses-hero">
                <Container>
                    <motion.h1 
                        className="addresses-title"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Saved Addresses
                    </motion.h1>
                    <motion.p 
                        className="addresses-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Manage your delivery addresses
                    </motion.p>
                </Container>
            </div>

            <Container className="addresses-container">
                <Button className="add-address-btn" onClick={() => setShowModal(true)}>
                    + Add New Address
                </Button>

                {addresses.length === 0 ? (
                    <div className="no-addresses">
                        <div className="no-addresses-icon">📍</div>
                        <h3>No saved addresses</h3>
                        <p>Add your first delivery address</p>
                    </div>
                ) : (
                    <div className="addresses-list">
                        {addresses.map((addr, idx) => (
                            <motion.div
                                key={addr._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="address-card">
                                    <Card.Body>
                                        <h4>{addr.name}</h4>
                                        <p>{addr.phone}</p>
                                        <p>{addr.address}</p>
                                        {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                                        <p>{addr.city} - {addr.pincode}</p>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(addr._id)}>
                                            Delete
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Full name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="tel" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Street address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Landmark (Optional)</Form.Label>
                            <Form.Control type="text" placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleAddAddress}>Save Address</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Addresses;