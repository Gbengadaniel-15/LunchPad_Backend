import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";


export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
        data: null });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
  success: true,
  message: 'Registration successful',
  data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    token: generateToken(user._id)
  }
    });

  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password",
        data: null
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned",
        data: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user
// @route   GET /api/auth/me
// @access  Private

export const getMe = async (req, res, next) => {
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
      message: 'User retrieved successfully',
      data: user
  });

  } catch (error) {
    next(error);
  }
};
