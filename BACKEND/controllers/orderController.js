const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create order from cart (User)
const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = new Order({
            user: req.user._id,
            items: cart.items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl
            })),
            totalAmount: cart.totalPrice + 40
        });

        await order.save();

        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get user's own orders (User)
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get single order (Admin can see any, User only their own)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is admin or order belongs to user
        if (req.user.isAdmin || order.user._id.toString() === req.user._id.toString()) {
            return res.status(200).json(order);
        }

        res.status(401).json({ message: 'Not authorized' });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Track order by ID (public or user-specific)
const trackOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Find order by ID
        const order = await Order.findById(orderId).populate('user', 'name email');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if user is admin or order belongs to user
        if (req.user && (req.user.isAdmin || order.user._id.toString() === req.user._id.toString())) {
            return res.status(200).json(order);
        }
        
        // For non-logged in users, only return basic info
        if (!req.user) {
            return res.status(200).json({
                status: order.status,
                estimatedDeliveryTime: order.estimatedDeliveryTime,
                totalAmount: order.totalAmount,
                orderId: order._id
            });
        }
        
        res.status(401).json({ message: 'Not authorized' });
    } catch (error) {
        console.error('Track order error:', error);
        res.status(500).json({ message: 'Order not found' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById,
    trackOrder
};