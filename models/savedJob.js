import mongoose from 'mongoose';

const SavedJobSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  }
}, { timestamps: true });

// Prevent duplicate saves for the same applicant + job pair
SavedJobSchema.index({ applicant: 1, job: 1 }, { unique: true });

export default mongoose.model('SavedJob', SavedJobSchema);