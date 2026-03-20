const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
});

/**
 * @route   POST /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if email is already in use by another user
        if (email !== req.user.email) {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const user = await User.findById(req.user._id);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                createdAt: updatedUser.createdAt
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
});

module.exports = router;
