import { useState, useEffect } from 'react';
import { foodService } from '../services/foodService';
import API from '../services/api';
import toast from 'react-hot-toast';

export const useFoods = () => {
    const [popularFoods, setPopularFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPopularFoods();
    }, []);

    const fetchPopularFoods = async () => {
        try {
            setLoading(true);
            const foods = await foodService.getPopularFoods();
            setPopularFoods(foods);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load popular foods');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (foodId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                return false;
            }
            await API.post('/cart/add', { foodId, quantity: 1 });
            toast.success('Added to cart!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
            return false;
        }
    };

    return { popularFoods, loading, error, addToCart };
};