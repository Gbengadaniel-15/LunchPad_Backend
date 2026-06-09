import Application from '../models/applicationModel.js'
import Job from '../models/jobModel.js'
import User from '../models/userModel.js'
import { uploadToCloudinary } from '../services/cloudinaryService.js'
import { 
    sendApplicationRecieveEmail, 
    sendApplicationAcceptedEmail,
    sendApplicationRejectedEmail } from '../services/emailservice.js';


export const applyForJob = async (req, res, next) =>{
    try{
        const { jobId} = req.params
        const { coverLetter } = req.body

        //check if job exists

        const job = await Job.findById(jobId)
        if(!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
                data: null
            })
        }

        // Check if job is approved — only apply to verified jobs
        if (job.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'This job is not available for applications',
                data: null
            })
        }

        // check if already applied
        const alreadyApplied = await Application.findOne({
            applicant: req.user._id,
            job: jobId
        })
        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job',
                data: null
            })
        }

        // check if resume/cv was uploaded
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: 'please upload your Resume/CV',
                data: null
            })
        }
         // Upload CV to Cloudinary
        const filename = `resume_${req.user._id}_${Date.now()}.pdf`
        const cloudinaryResult = await uploadToCloudinary(
            req.file.buffer,
            filename
        )

         // Create the application
        const application = await Application.create({
            applicant: req.user._id,
            job: jobId,
            resumeUrl: cloudinaryResult.secure_url,
            coverLetter: coverLetter || null,
            status: 'pending'
        })

        const employer = await User.findById(job.employer)
        await sendApplicationRecieveEmail(employer, req.user, job)

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        })

    
    }catch (error){
        next(error)
    }

}

// Tunde sees all his applications
// GET /api/applications/my-applications
export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({
            applicant: req.user._id
        })
        .populate('job', 'title company location jobType status')
        .sort({ appliedAt: -1 })  // newest first

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        })

    } catch (error) {
        next(error)
    }
}

// Employer sees who applied to their job
// GET /api/applications/job/:jobId

export const getJobApplications = async (req, res, next) =>{
    try{
        const { jobId } = req.params

        // check if job exists and belongs to this employer
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
                data: null
            })
        }
        // make sure only the employer who posted can see the applicantions
        if(job.employer.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view these applications',
                data: null
            })
        }

        const applications = await Application.find({ job : jobId})
            .populate('applicant', 'name email')
            .sort ({ appliedAt: -1 })

        res.status(200).json({
            success: true,
            message: 'Application retrieved successfully',
            count: applications.length,
            data: applications
        })


    }catch(error) {
        next(error)
    }
}

//@desc
// Employer accepts or rejects an application
// PATCH /api/applications/:applicationId/status

export const updateApplicationStatus = async(req, res, next) =>{
    try{
        const {applicationId} = req.params
        const { status } = req.body

        // validate status value
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either accepted or rejected',
                data: null
            })
        }

        // Find the application
        const application = await Application.findById(applicationId)
            .populate('job')
        if(!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
                data : null
            })
        }
        
        // make sure only the employer who own the job can update status
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this application',
                data: null
            })
        }
        // Update the status
        application.status = status
        await application.save()

        const applicant = await User.findById(application.applicant)

        if (status === 'accepted') {
            await sendApplicationAcceptedEmail( applicant, application.job)
        }else{
            await sendApplicationRejectedEmail( applicant, application.job)
        }

        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            data: application
        })


    }catch(error){
        next(error)
    }
}

// Tunde withdraws his application
// DELETE /api/applications/:applicationId/withdraw

export const withdrawApplication  = async (req, res, next) =>{
    try{
        const {applicationId} = req.params

        //find the application
        const application = await Application.findById(applicationId)
        if(!application){
            return res.status(404).json({
               success: false,
               message: 'Application not found',
               data: null 
            })
        }

        // make sure only the tunde can withdraw his own application
        if (application.applicant.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to withdraw this application',
                data: null
            })
        
        }
        // Cannot withdraw an already accepted application
        if (application.status === 'accepted') {
            return res.status(400).json({
                success: false,
                message: 'You cannot withdraw an accepted application',
                data: null
            })
        }

        await application.deleteOne()

        res.status(200).json({
            success: true,
            message: 'Application withdrawn successfully',
            data : null
        })



    }catch(error){
        next(error)
    }
}
