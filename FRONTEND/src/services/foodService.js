import API from './api';

export const foodService = {
    // Get all foods
    getAllFoods: async () => {
        const { data } = await API.get('/foods');
        return data;
    },
    
    // Get popular foods (top rated)
    getPopularFoods: async () => {
        const { data } = await API.get('/foods');
        return data.sort((a, b) => b.rating - a.rating).slice(0, 6);
    },
    
    // Get foods by category
    getFoodsByCategory: async (category) => {
        const { data } = await API.get(`/foods/category/${category}`);
        return data;
    }
};