import express from 'express'

import{
    createJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob } from  '../controllers/jobController.js'

import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

 router.route('/')
        .get(getJobs)
        .post(authMiddleware, createJob)  // create job - login required

router.route('/:id')
      .get(getJob)             // get single job - public
      .put(authMiddleware, updateJob)    // edit job - login required
      .deleteJob(authMiddleware, deleteJob)    // delete job - login required
      

export default router
