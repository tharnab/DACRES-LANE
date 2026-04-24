import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnimatedPage from './components/AnimatedPage';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import TrackOrder from './pages/TrackOrder';
import UnderConstruction from './pages/UnderConstruction';

function AnimatedRoutes() {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
                <Route path="/menu" element={<AnimatedPage><Menu /></AnimatedPage>} />
                <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
                <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
                <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
                <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
                <Route path="/orders" element={<AnimatedPage><Orders /></AnimatedPage>} />
                <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
                <Route path="/track-order/:id?" element={<AnimatedPage><TrackOrder /></AnimatedPage>} />
                <Route path="*" element={<AnimatedPage><UnderConstruction /></AnimatedPage>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Toaster position="top-right" />
                <NavigationBar />
                <ScrollToTop />
                <main style={{ minHeight: 'calc(100vh - 200px)' }}>
                    <AnimatedRoutes />
                </main>
                <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;