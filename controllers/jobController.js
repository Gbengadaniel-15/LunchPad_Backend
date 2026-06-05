import Job from '../models/jobModel.js';

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Employer only
export const createJob = async (req, res, next) => {
  try {
    const newJob = await Job.create({
      ...req.body,
      employer: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully — it is pending admin approval',
      data: newJob
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all approved job postings
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'approved', isActive: true })
      .populate('employer', 'name email isVerified')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get a single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email isVerified');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job retrieved successfully',
      data: job
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing job
// @route   PUT /api/jobs/:id
// @access  Employer only (owner)
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
        data: null
      });
    }

    // Only the employer who created the job may edit it
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to edit this job',
        data: null
      });
    }

    // Re-submit for approval whenever content changes
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending' },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully — it is pending re-approval',
      data: updatedJob
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Employer (owner) or Admin
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
        data: null
      });
    }

    const isOwner = job.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this job',
        data: null
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: null
    });

  } catch (error) {
    next(error);
  }
};