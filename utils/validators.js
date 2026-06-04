// utils/validators.js
import { body, validationResult } from 'express-validator'

// ── HELPER FUNCTION ───────────────────────
// checks validation results and sends error
export const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,  // first error message
      data: null
    })
  }

  next()  // no errors - move forward ✅
}

// ── REGISTER VALIDATION ───────────────────
export const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['applicant', 'employer'])
    .withMessage('Role must be applicant or employer'),

  validate   // 👈 always last
]

// ── LOGIN VALIDATION ──────────────────────
export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate   // 👈 always last
]

// ── JOB VALIDATION ────────────────────────
export const validateJob = [
  body('title')
    .notEmpty()
    .withMessage('Job title is required'),

  body('company')
    .notEmpty()
    .withMessage('Company name is required'),

  body('description')
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),

  body('location')
    .notEmpty()
    .withMessage('Location is required'),

  body('salary')
    .optional(),   // 👈 not required

  validate   // 👈 always last
]

// ── APPLICATION VALIDATION ────────────────
export const validateApplication = [
  body('coverLetter')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Cover letter cannot exceed 500 characters'),

  validate   // 👈 always last
]

// ── UPDATE STATUS VALIDATION ──────────────
export const validateStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['accepted', 'rejected'])
    .withMessage('Status must be accepted or rejected'),

  validate   // 👈 always last
]