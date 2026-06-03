import Job from "../models/jobModel.js";

// @desc    Create a new job position
// @route   POST /api/jobs
// @access  Employer only
export const createJob = async (req, res, next) => {
  try {
    const newJob = await Job.create({...req.body,
        employer: req.user._id
    });
    res.status(201).json({ 
        success: true, 
        message: 'Job created successfully',
        data: newJob 
    });

  } catch (error) {
    next(error);
  }

};

// @desc    Get all job postings
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'approved'});
    res.status(200).json({ 
        success: true, 
        message: 'Jobs retrieved successfully',
        count: jobs.length, 
        data: jobs 
    });

  } catch (error) {
    next(error);
  }
}

  // @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public

export const getJob = async (req, res, next) =>{
    try{
        const job = await Job.findById(req.params.id)
        .populate('employer', 'name email')

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'job not found',
                data: null
            })
        }

        res.status(200).json({
            success: true,
            message: 'job retrieved successfully',
            data: job
        })
    }catch(error){
        next(error)
    }
}

// @desc    Update/Edit an existing job
// @route   PUT /api/jobs/:id
// @access  Employer only (owner)
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)

    if(!job) {
        return res.status(404).json({
            success: false,
            message: "Job not found",
            data: null
        })
    }
    //only the employer who created it can edit
    if(job.employer.toString() !== req.user._id) {
        return res.status(403).json({
            success: false,
            message: 'You are not allowed to edit this job',
            data : null
        })
        
    }
    const updatedjob = await Job.findByIdUpdate(
        req.params.id, req.body ,{new: true, runValidators: true}

    )
    res.status(200).json({ 
        success: true,
        message: 'job updated Successfully', 
        data: updatedjob });

  } catch (error) {
    next(error)
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Employer only (owner)

export const deleteJob = async (req, res,next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: "Job not found",
        data: null 
    });
    }
    // only the emplyer who created it and admin can delete
    const isEmployer = job.employer.toString() === req.user._id
    const isAdmin = req.user.role === 'admin'

    if(!isEmployer && !isAdmin) {
        return res.status(403).json({
            success:false,
            message:'You are not allowed to delete this job',
            data: null

        })
    }

    await Job.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: null
    })

  } catch (error) {
    next(error)
  }
}
