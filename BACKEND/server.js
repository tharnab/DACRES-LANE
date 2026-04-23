require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const uri = process.env.uri;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');

app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('SERVER is working');
});

// Database connection
async function connectdb() {
    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to database");
    } catch(err) {
        console.error("❌ MongoDB connection failed", err.message);
        process.exit(1);
    }
}

// Start server
connectdb().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 App is listening on port ${PORT}`);
    });
});