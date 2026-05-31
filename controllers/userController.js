import User from '../models/User.js';

//  Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    });

  } catch (error) {
    next(error);
  }
};

//  Update current user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, profilePicture } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // only update fields that were sent
    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
        cvUrl: updatedUser.cvUrl
      }
    });

  } catch (error) {
    next(error);
  }
};

// Delete current user account
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
      data: null
    });

  } catch (error) {
    next(error);
  }
};

// get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });

  } catch (error) {
    next(error);
  }
};

// ban a user (admin only)
export const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // prevent admin from banning another admin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban an admin account',
        data: null
      });
    }

    user.isBanned = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      data: null
    });

  } catch (error) {
    next(error);
  }
};


// Verify an employer account
export const verifyEmployer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // only employers can be verified
    if (user.role !== 'employer') {
      return res.status(400).json({
        success: false,
        message: 'Only employer accounts can be verified',
        data: null
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Employer verified successfully',
      data: null
    });

  } catch (error) {
    next(error);
  }
};