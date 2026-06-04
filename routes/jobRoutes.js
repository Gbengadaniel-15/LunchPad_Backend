import express from 'express'

import{
    createJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob } from  '../controllers/jobController.js'

import { authMiddleware } from '../middleware/authMiddleware.js'
import  roleMiddleware from '../middleware/roleMiddleware.js'
import { validateJob } from '../utils/validators.js'

const router = express.Router()

router.use(authMiddleware)
router.use(roleMiddleware)

 router.route('/')
        .get(getJobs)
        .post(roleMiddleware('employer'),validateJob, createJob)  // create job - login required

router.route('/:id')
      .get(getJob)             // get single job - public
      .put(roleMiddleware('employer'),validateJob, updateJob)    // edit job - login required
      .deleteJob( deleteJob)    // delete job - login required
      

export default router
