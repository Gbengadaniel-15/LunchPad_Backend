import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadCV
} from '../controllers/userController.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { upload } from '../services/cloudinaryService.js';
import { validateChangePassword, validateUpdateProfile } from '../utils/validators.js';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);


///////

// GET    /api/user/profile      — any authenticated role
router.get('/profile', getProfile);

// PUT    /api/user/profile      — any authenticated role
router.put(
  '/update-profile', upload.single('avatar'), validateUpdateProfile, updateProfile);

// PUT /api/user/upload-cv — applicants only
router.put('/upload-cv', roleMiddleware('applicant'), uploadResume, uploadCV);

// PUT    /api/user/change-password — any authenticated role
router.put('/change-password', validateChangePassword, changePassword);

// DELETE /api/user/account      — applicants and employers only
router.delete('/account',  roleMiddleware ('applicant', 'employer'), deleteAccount );



export default router;