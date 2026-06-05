// utils/validators.js
import { body, validationResult } from 'express-validator';

// ── HELPER ────────────────────────────────────────────────────────────────────
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      data: null
    });
  }
  next();
};

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['applicant', 'employer']).withMessage('Role must be applicant or employer'),

  validate
];

export const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required'),

  validate
];

// ── USER PROFILE ──────────────────────────────────────────────────────────────
export const validateUpdateProfile = [
  body('name')
    .optional()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  validate
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must differ from the current password');
      }
      return true;
    }),

  validate
];

// ── JOB ───────────────────────────────────────────────────────────────────────
export const validateJob = [
  body('title')
    .notEmpty().withMessage('Job title is required'),

  body('company')
    .notEmpty().withMessage('Company name is required'),

  body('description')
    .notEmpty().withMessage('Job description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

  body('location')
    .notEmpty().withMessage('Location is required'),

  body('jobType')
    .notEmpty().withMessage('Job type is required')
    .isIn(['internship', 'full-time', 'part-time', 'NYSC', 'contract'])
    .withMessage('Invalid job type'),

  body('salary').optional(),

  validate
];

// ── APPLICATION ───────────────────────────────────────────────────────────────
export const validateApplication = [
  body('coverLetter')
    .optional()
    .isLength({ max: 500 }).withMessage('Cover letter cannot exceed 500 characters'),

  validate
];

export const validateStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected'),

  validate
];