import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private (any authenticated role)
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
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

// @desc    Update current user profile (name and/or profile picture upload)
// @route   PUT /api/user/profile
// @access  Private (any authenticated role)
export const updateProfile = async (req, res, next) => {
  try {
    const {firstName, lastName, bio, techTrack } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (techTrack) user.techTrack = techTrack;

    // Handle profile picture upload via Cloudinary if a file was attached
    if (req.file) {
      const filename = `avatar_${req.user._id}_${Date.now()}`;
      const result = await uploadToCloudinary(req.file.buffer, filename);
      user.profilePicture = result.secure_url;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,  
        lastName: updatedUser.lastName,     
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        role: updatedUser.role,
        techTrack: updatedUser.techTrack,   
        profilePicture: updatedUser.profilePicture,
        cvUrl: updatedUser.cvUrl
      }
    });

  } catch (error) {
    next(error);
  }
};

// PUT /api/user/upload-cv
export const uploadCV = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a CV',
                data: null
            })
        }

        const filename = `cv_${req.user._id}_${Date.now()}.pdf`
        const result = await uploadToCloudinary(req.file.buffer, filename)

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { cvUrl: result.secure_url },
            { new: true }
        ).select('-password')

        res.status(200).json({
            success: true,
            message: 'CV uploaded successfully',
            data: user
        })

    } catch (error) {
        next(error)
    }
}

// @desc    Change password for current user
// @route   PUT /api/user/change-password
// @access  Private (any authenticated role)
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        data: null
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: null
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete current user account
// @route   DELETE /api/user/account
// @access  Private — applicants and employers only (admins use /api/admin/users/:id)
export const deleteAccount = async (req, res, next) => {
  try {
    // Prevent admins from self-deleting via this route
    if (req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be deleted from this endpoint',
        data: null
      });
    }

    const user = await User.findById(req.user._id);
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