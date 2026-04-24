import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FoodCard from './FoodCard';

const CategorySection = ({ title, foods, onAddToCart, icon }) => {
    if (foods.length === 0) return null;
    
    return (
        <div className="category-section">
            <div className="category-header">
                <div className="category-icon">{icon}</div>
                <h2 className="category-title">{title}</h2>
                <div className="category-line"></div>
            </div>
            <Row>
                {foods.map((food) => (
                    <Col key={food._id} md={6} lg={4} xl={3} className="mb-4">
                        <FoodCard food={food} onAddToCart={onAddToCart} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CategorySection;