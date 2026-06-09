import User from '../models/userModel.js';
import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js'
import {
    sendJobApprovedEmail,
    sendJobRejectedEmail,
    sendAccountBannedEmail,
    sendAccountVerifiedEmail
}  from '../services/emailservice.js'

//@desc Get all User
//@ route GET/api/admin/users
//@access Admin only

export const getAllUsers = async (req, res, next) =>{
    try {
        const users = await User.find().select('-password')
    
    return res.status(200).json({
        success:true,
        message: 'User retrieved successfully',
        count: users.length,
        data: users

    })

    }catch(error){
        next(error)

   }
}

//@desc  Delete a user
//@route Delete /api/admin/users/:id
//@access Admin only

export const deleteUser = async(req, res, next) =>{
    try{
        const user = await User.findById(req.params.id)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null
            })
        }

        await User.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: null

        })
    }catch(error) {
        next(error)
    }
}

// @desc Ban a user
//@routes put /api/admin/user/:id/ban
//@access Admin only

export const banUser = async (req ,res, next) =>{
    try{
        const user = await User.findById(req.params.id)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null

            })
        }

        // prevent admin from banning another admin
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot ban an admin account',
                data: null
            });
        }

        user.isBanned = !user.isBanned
        await user.save()

        await sendAccountBannedEmail(user)

        res.status(200).json({
            success:true,
            message: user.isBanned
             ? 'User banned successfully'
             : 'User unbanned successfully',
            data: null

        });

    }catch(error) {
        next(error)
    }
}



// Verify an employer account
export const verifyEmployer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // only employers can be verified
    if (user.role !== 'employer') {
      return res.status(400).json({
        success: false,
        message: 'Only employer accounts can be verified',
        data: null
      });
    }

    user.isVerified = true;
    await user.save();

    await sendAccountVerifiedEmail(user)

    res.status(200).json({
      success: true,
      message: 'Employer verified successfully',
      data: null
    });

  } catch (error) {
    next(error);
  }
};

// @desc Get all pending jobs waiting for approval
// @route GET /api/admin/jobs/pending
// @access Admin only
export const getPendingJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ status: 'pending' })
            .populate('employer', 'name email isVerified')
            .sort({ createdAt: -1 })  // newest first

        if (jobs.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No pending jobs at the moment',
                count: 0,
                data: []
            })
        }

        res.status(200).json({
            success: true,
            message: 'Pending jobs retrieved successfully',
            count: jobs.length,
            data: jobs
        })

    } catch (error) {
        next(error)
    }
}

// @desc Approve a job listing
// @route PUT /api/admin/jobs/:id/approve
// @access Admin only
export const approveJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
                data: null
            })
        }

        // Check if job is already approved
        if (job.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Job is already approved',
                data: null
            })
        }

        job.status = 'approved'
        await job.save()

        //email service
        const employer = await User.findById(job.employer)
        await sendJobApprovedEmail(employer,job)

        res.status(200).json({
            success: true,
            message: 'Job approved successfully — it is now live for applicants',
            data: job
        })

    } catch (error) {
        next(error)
    }
} 

// @desc Reject a job listing
// @route PUT /api/admin/jobs/:id/reject
// @access Admin only
export const rejectJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
                data: null
            })
        }

        // Check if job is already rejected
        if (job.status === 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Job is already rejected',
                data: null
            })
        }

        job.status = 'rejected'
        await job.save()

        //email services
        const employer = await User.findById(job.employer)
        await sendJobRejectedEmail(employer, job)

        res.status(200).json({
            success: true,
            message: 'Job rejected successfully — it will not be visible to applicants',
            data: job
        })

    } catch (error) {
        next(error)
    }
}




export const getAllApplications = async (req, res, next) => {
    try{
        const application = await Application.find()
           .populate('applicant', 'name email' )
           .populate('job', 'title company')

        
           res.status(200).json({
            success: true, 
            message: 'Applications retrieved successfully',
            count: application.length,
            data: application
           })


    }catch(error) {
        next(error)
    }


}

