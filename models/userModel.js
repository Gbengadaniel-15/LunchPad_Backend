import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['applicant', 'employer', 'admin'],
        default: 'applicant'

    },
    isVerified: {
        type: Boolean,
        default: false        // for employer verification by admin
    },
    isBanned: {
        type: Boolean,
        default: false        // admin needs this to ban scammers
    },
    cvUrl: {
        type: String,
        default: null         // applicant's uploaded CV from Cloudinary
    },
    profilePicture: {
        type: String,
        default: null
    },


},{timestamps: true} )

export default mongoose.model('User', UserSchema )