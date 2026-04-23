const express = require('express');
const {
    createFood,
    getAllFood,
    getFoodById,
    getFoodByCategory,
    updateFood,
    deleteFood,
    searchFood,
    getAvailableFood
} = require('../controllers/foodController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication needed)
router.get('/', getAllFood);
router.get('/available', getAvailableFood);
router.get('/search', searchFood);
router.get('/category/:category', getFoodByCategory);
router.get('/:id', getFoodById);

// Protected routes (require authentication)
router.post('/', protect, createFood);
router.put('/:id', protect, updateFood);
router.delete('/:id', protect, deleteFood);

module.exports = router;