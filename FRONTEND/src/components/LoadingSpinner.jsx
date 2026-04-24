import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="loading-container">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                    width: 50,
                    height: 50,
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #FF6B35",
                    borderRadius: "50%"
                }}
            />
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="loading-text"
            >
                Loading delicious food...
            </motion.p>
        </div>
    );
};

export default LoadingSpinner;