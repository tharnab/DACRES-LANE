const express = require('express');
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById,
    trackOrder  // Add this
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/track/:orderId', protect, trackOrder);  // Add this line

// Admin routes
router.get('/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/:id', protect, getOrderById);

module.exports = router;