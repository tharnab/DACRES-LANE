const Cart = require('../models/Cart');
const Food = require('../models/food');  // ← Changed from 'Food' to 'food'

// Get user's cart
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = await Cart.create({ 
                user: req.user._id, 
                items: [],
                totalItems: 0,
                totalPrice: 0
            });
        }
        
        res.status(200).json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { foodId, quantity = 1 } = req.body;
        
        // Get food details
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        
        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }
        
        // Check if item already exists
        const existingItem = cart.items.find(
            item => item.food.toString() === foodId
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                food: food._id,
                name: food.name,
                price: food.price,
                quantity: quantity,
                imageUrl: food.imageUrl || '',
                isVeg: food.isVeg
            });
        }
        
        // Recalculate totals
        cart.calculateTotals();
        await cart.save();
        
        res.status(200).json({ 
            success: true, 
            cart,
            message: 'Added to cart successfully'
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;
        
        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }
        
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const item = cart.items.find(item => item.food.toString() === foodId);
        if (item) {
            item.quantity = quantity;
            cart.calculateTotals();
            await cart.save();
        }
        
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { foodId } = req.params;
        
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        cart.items = cart.items.filter(item => item.food.toString() !== foodId);
        cart.calculateTotals();
        await cart.save();
        
        res.status(200).json({ success: true, cart, message: 'Item removed' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            cart.totalItems = 0;
            cart.totalPrice = 0;
            await cart.save();
        }
        
        res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};