import express from 'express';
import { saveJob, getSavedJobs, removeSavedJob } from '../controllers/savedJobController.js';
import { authMiddleware as verifyToken } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/:jobId', verifyToken, roleMiddleware('applicant'), saveJob);
router.get('/', verifyToken, roleMiddleware('applicant'), getSavedJobs);
router.delete('/:jobId', verifyToken, roleMiddleware('applicant'), removeSavedJob);

export default router;