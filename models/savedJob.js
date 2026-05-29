import mongoose from 'mongoose'

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

},{timestamps: true})

SavedJobSchema.index({ applicant: 1, job: 1 }, { unique: true })

export default mongoose.model(' SavedJob', SavedJobSchema )