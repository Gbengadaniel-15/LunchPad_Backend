import mongoose from "mongoose"

const ApplicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true

    },
    resumeUrl:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted','rejected', 'shortlisted'],
        default: 'pending'
    },
    coverLetter: {
        type: String,
        default: null         //  USEFUL for fresh grads
    },

    appliedAt: {
        type: Date,
        default: Date.now
    }


}, { timestamps: true })

export default mongoose.model('Application', ApplicationSchema)