import express from 'express'
import {
    getJobApplications,
    getMyApplications,
    withdrawApplication,
    updateApplicationStatus,
    applyForJob

} from '../controllers/applicationController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { uploadResume } from '../middleware/uploadMiddleware.js'
import {  validateApplication, validateStatus } from '../utils/validators.js'


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