import express from 'express'
import {
    getAllUsers,
    deleteUser,
    banUser,
    verifyEmployer,
    getPendingJobs,
    approveJob,
    getAllApplications,
    rejectJob
} from '../controllers/adminController.js'

import { authMiddleware } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";


const router = express.Router()

router.use(authMiddleware)
router.use(roleMiddleware('admin'))

//Get Api
router.get('/users', getAllUsers)
router.get('/jobs/pending', getPendingJobs)


//delete Api
router.delete('/users/:id', deleteUser)


//
router.put('/users/:id/ban', banUser)
router.put('/users/:id/verify', verifyEmployer)
router.put('/jobs/:id/approve', approveJob)
router.put('/jobs/:id/reject', rejectJob)

//--- Application Routes

router.get('/applications', getAllApplications)

export default router