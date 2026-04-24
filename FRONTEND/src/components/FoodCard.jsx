import React from 'react';
import { Button } from 'react-bootstrap';

const FoodCard = ({ food, onAddToCart }) => {
    return (
        <div className="food-card-premium">
            <div className="food-card-image">
                <img 
                    src={food.imageUrl || `https://placehold.co/600x400/FF6B35/white?text=${food.name}`} 
                    alt={food.name}
                />
                <div className={`food-badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
                    {food.isVeg ? 'VEG' : 'NON-VEG'}
                </div>
                {food.isBestseller && (
                    <div className="bestseller-badge">⭐ Bestseller</div>
                )}
            </div>
            <div className="food-card-content">
                <h3 className="food-title">{food.name}</h3>
                <p className="food-description">{food.description?.substring(0, 60)}...</p>
                <div className="food-meta">
                    <div className="rating">
                        <span className="stars">{'★'.repeat(Math.floor(food.rating || 0))}</span>
                        <span className="rating-value">{food.rating || 0}</span>
                    </div>
                    <div className="price">₹{food.price}</div>
                </div>
                <Button 
                    className="add-to-cart-btn-premium" 
                    onClick={() => onAddToCart(food._id)}
                    disabled={!food.isAvailable}
                >
                    {food.isAvailable ? 'Add to Cart +' : 'Out of Stock'}
                </Button>
            </div>
        </div>
    );
};

export default FoodCard;