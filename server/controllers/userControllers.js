// controllers/userControllers.js
const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password'); // Don't return the password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile', error });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, profilePicture } = req.body;

    // Find the user and update their profile details
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username, email, profilePicture },
      { new: true } // Return the updated user
    ).select('-password'); // Don't return the password

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user profile', error });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    // Find and delete the user account
    const user = await User.findByIdAndDelete(req.user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user account', error });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
};
