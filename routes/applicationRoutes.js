import express from 'express';
import {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { validateApplication, validateStatus } from '../utils/validators.js';

const router = express.Router();

router.use(authMiddleware);

// ── Applicant only ────────────────────────────────────────────────────────────
// Note: param name is :jobId (lowercase) — must match req.params.jobId in controller
router.post(
  '/apply/:jobId',
  roleMiddleware('applicant'),
  validateApplication,
  uploadResume,
  applyForJob
);

router.get(
  '/my-applications',
  roleMiddleware('applicant'),
  getMyApplications
);

router.delete(
  '/:applicationId/withdraw',
  roleMiddleware('applicant'),
  withdrawApplication
);

// ── Employer only ─────────────────────────────────────────────────────────────
router.get(
  '/job/:jobId',
  roleMiddleware('employer'),
  getJobApplications
);

router.patch(
  '/:applicationId/status',
  roleMiddleware('employer'),
  validateStatus,
  updateApplicationStatus
);

export default router;