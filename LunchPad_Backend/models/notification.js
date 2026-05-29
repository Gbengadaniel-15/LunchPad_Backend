import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            'application_received',
            'application_accepted',
            'application_rejected',
            'job_posted',
            'general'
        ],
        default: 'general'
    },
    isRead: {
        type: Boolean,
        default: false

    },relatedjob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        default: null
    }
},{timestamps: true})

export default mongoose.model('Notification', NotificationSchema)