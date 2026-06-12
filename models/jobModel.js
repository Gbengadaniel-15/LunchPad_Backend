import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'    // THIS is LaunchPad's core trust feature
    },

    jobType: {
        type: String,
        enum: ['internship', 'full-time', 'part-time', 'NYSC', 'contract'],
        required: true        // Tunde needs to filter by this
    },

    company: {
        type: String,
        required: true

    },

    experienceLevel: {
        type: String,
        enum: ['entry-level', 'junior', 'mid-level'],
        default: 'entry-level'
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    salary: {
        type: String
    },

    tags: {
        type: [String],
        default: []

    },
    isActive: {
        type: Boolean,
        default: true         // admin can deactivate without deleting
    },
    deadline: {
        type: Date        // admin can deactivate without deletin
    },

    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

export default mongoose.model('Job', JobSchema)