import mongoose from "mongoose"

const ApplicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
        required: true

    },
    resumeUrl:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted','rejected'],
        default: 'pending'
    }
}, { timestamps: true })

export default mongoose.model('Application', ApplicationSchema)