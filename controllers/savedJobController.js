import SavedJob from "../models/SavedJob.js";

// @desc    Save a job
// @route   POST /api/saved/:jobId
// @access  Private (applicant only)
export const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // check if already saved
    const alreadySaved = await SavedJob.findOne({
      applicant: req.user._id,
      job: jobId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
        data: null,
      });
    }

    const savedJob = await SavedJob.create({
      applicant: req.user._id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: savedJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved jobs for logged in user
// @route   GET /api/saved
// @access  Private (applicant only)
export const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ applicant: req.user._id }).populate(
      "job",
    );

    res.status(200).json({
      success: true,
      message: "Saved jobs retrieved successfully",
      data: savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a saved job
// @route   DELETE /api/saved/:jobId
// @access  Private (applicant only)
export const removeSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      applicant: req.user._id,
      job: jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Job removed from saved list",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
