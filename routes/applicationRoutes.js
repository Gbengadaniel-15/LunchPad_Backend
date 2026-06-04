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
import {  validateApplication, validateStatus } from '../utils/validators'


const router = express.Router()

router.use(authMiddleware)

//@desc
//Applicant only

router.post('/apply/:JobId', roleMiddleware('applicant'),validateApplication,   uploadResume,applyForJob )
router.get('/myapplication',roleMiddleware('applicant'),  getMyApplications)
router.delete('/:applicationId/withdraw',roleMiddleware('applicant'),  withdrawApplication)

//Employer only
// =====================
router.get('/job/:jobId', roleMiddleware('employer'), getJobApplications)
router.patch('/:applicationId/status', roleMiddleware('employer'),validateStatus, updateApplicationStatus)

export default router