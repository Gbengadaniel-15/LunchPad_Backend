import express from 'express'
import {
    getJobApplications,
    getMyApplications,
    withdrawApplication,
    updateApplicationStatus,
    applyForJob

} from '../controllers/applicationController'
import { authMiddleware } from '../middleware/authMiddleware'
import roleMiddleware from '../middleware/roleMiddleware'
import { uploadResume } from '../middleware/uploadMiddleware'


const router = express.Router()

router.use(authMiddleware)

//Applicant only

router.post('/apply/:JobId', roleMiddleware('applicant'),   uploadResume,applyForJob )
router.get('/myapplication',roleMiddleware('applicant'),  getMyApplications)
router.delete('/:applicationId/withdraw',roleMiddleware('applicant'),  withdrawApplication)

//Employer only
// =====================
router.get('/job/:jobId', roleMiddleware('employer'), getJobApplications)
router.patch('/:applicationId/status', roleMiddleware('employer'), updateApplicationStatus)

export default router