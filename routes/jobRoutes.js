import express from 'express';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validateJob } from '../utils/validators.js';

const router = express.Router();

// ── PUBLIC routes (no auth required) ─────────────────────────────────────────
router.get('/', getJobs);
router.get('/:id', getJob);

// ── PROTECTED routes ──────────────────────────────────────────────────────────
// POST   /api/jobs       — employer only
router.post(
  '/',
  authMiddleware,
  roleMiddleware('employer'),
  validateJob,
  createJob
);

// PUT    /api/jobs/:id   — employer only (ownership enforced in controller)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('employer'),
  validateJob,
  updateJob
);

// DELETE /api/jobs/:id   — employer (owner) or admin
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('employer', 'admin'),
  deleteJob
);

router.get('/my-jobs', authMiddleware, roleMiddleware('employer'), getMyJobs)

export default router;