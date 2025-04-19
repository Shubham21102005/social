// routes/userRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile, deleteUserAccount } = require('../controllers/userControllers');

const router = express.Router();

// Get user profile (GET)
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile (PUT)
router.put('/profile', authMiddleware, updateUserProfile);

// Delete user account (DELETE)
router.delete('/account', authMiddleware, deleteUserAccount);

module.exports = router;
