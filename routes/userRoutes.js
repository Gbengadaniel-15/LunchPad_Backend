import express from 'express';
import { getProfile, updateProfile, deleteAccount } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.delete('/account', verifyToken, deleteAccount);

export default router;