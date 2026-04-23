const Food = require('../models/Food');

// Create new food item (protected)
const createFood = async (req, res) => {
    try {
        const food = new Food({
            ...req.body,
            createdBy: req.user._id  // Now req.user exists from auth middleware
        });
        
        const savedFood = await food.save();
        res.status(201).json(savedFood);
    } catch(error) {
        console.error('Create food error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all food (public)
const getAllFood = async (req, res) => {
    try {
        const foods = await Food.find().populate('createdBy', 'name email');
        res.status(200).json(foods);
    } catch(error) {
        console.error('Get all food error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get single food item (public)
const getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate('createdBy', 'name email');
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json(food);
    } catch(error) {
        console.error('Get food by id error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get food by category (public)
const getFoodByCategory = async (req, res) => {
    try {
        const foods = await Food.find({ category: req.params.category });
        res.status(200).json(foods);
    } catch(error) {
        console.error('Get food by category error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update food item (protected)
const updateFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        
        // Check if user is admin or the creator
        if (food.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this food' });
        }
        
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedFood);
    } catch(error) {
        console.error('Update food error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete food item (protected)
const deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        
        // Check if user is admin or the creator
        if (food.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this food' });
        }
        
        await food.deleteOne();
        res.status(200).json({ message: 'Food deleted successfully' });
    } catch(error) {
        console.error('Delete food error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Search food items (public)
const searchFood = async (req, res) => {
    try {
        const { query } = req.query;
        const foods = await Food.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(foods);
    } catch(error) {
        console.error('Search food error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get available food items (public)
const getAvailableFood = async (req, res) => {
    try {
        const foods = await Food.find({ isAvailable: true });
        res.status(200).json(foods);
    } catch(error) {
        console.error('Get available food error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFood,
    getAllFood,
    getFoodById,
    getFoodByCategory,
    updateFood,
    deleteFood,
    searchFood,
    getAvailableFood
};