import React, { useContext, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        
        try {
            const updateData = {
                name: formData.name,
                email: formData.email
            };
            
            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }
            
            await API.put(`/users/${user._id}`, updateData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="profile-page">
            {/* Decorative Shapes */}
            <div className="profile-shape shape-1"></div>
            <div className="profile-shape shape-2"></div>
            
            <Container className="profile-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="profile-header">
                        <div className="profile-header-icon">👤</div>
                        <h1 className="profile-header-title">My Profile</h1>
                        <p className="profile-header-subtitle">Manage your account information</p>
                    </div>

                    {/* Profile Card */}
                    <div className="profile-card">
                        {/* Avatar Section */}
                        <div className="profile-avatar-section">
                            <div className="profile-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h3>{user?.name}</h3>
                            <p>{user?.email}</p>
                            {user?.isAdmin && <span className="admin-badge">Administrator</span>}
                        </div>

                        {/* Profile Info or Edit Form */}
                        {!isEditing ? (
                            <div className="profile-info">
                                <div className="info-group">
                                    <div className="info-item">
                                        <div className="info-label">
                                            <span className="info-icon">📛</span>
                                            Full Name
                                        </div>
                                        <div className="info-value">{user?.name}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">
                                            <span className="info-icon">📧</span>
                                            Email Address
                                        </div>
                                        <div className="info-value">{user?.email}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">
                                            <span className="info-icon">📅</span>
                                            Member Since
                                        </div>
                                        <div className="info-value">
                                            {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-actions">
                                    <button 
                                        className="edit-profile-btn"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        ✏️ Edit Profile
                                    </button>
                                    <button 
                                        className="logout-profile-btn"
                                        onClick={handleLogout}
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="profile-form">
                                {error && <Alert variant="danger">{error}</Alert>}
                                
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon">👤</span>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon">📧</span>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-divider">
                                    <span>Change Password (Optional)</span>
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            className="form-control"
                                            placeholder="Enter new password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon">✓</span>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirm new password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-buttons">
                                    <button type="submit" className="save-btn">💾 Save Changes</button>
                                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default Profile;