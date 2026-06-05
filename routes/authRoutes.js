import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { authMiddleware as verifyToken } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin
} from '../utils/validators.js'

const router = express.Router();


router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', verifyToken, getMe);

export default router;