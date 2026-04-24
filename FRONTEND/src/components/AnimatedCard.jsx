import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.5, 
                delay: delay,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedCard;