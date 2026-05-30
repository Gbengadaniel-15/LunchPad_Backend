
const SavedJob = require("../models/SavedJob");


// SAVE A JOB
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const alreadySaved = await SavedJob.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        message: "Job already saved",
      });
    }

    const savedJob = await SavedJob.create({
      user: req.user.id,
      job: jobId,
    });

    res.status(201).json(savedJob);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SAVED JOBS
exports.getSavedJobs = async (req, res) => {
  try {

    const jobs = await SavedJob.find({
      user: req.user.id,
    }).populate("job");

    res.status(200).json(jobs);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE SAVED JOB
exports.removeSavedJob = async (req, res) => {
  try {

    const deletedJob = await SavedJob.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({
        message: "Saved job not found",
      });
    }

    res.status(200).json({
      message: "Saved job removed",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
