import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },

    techTrack: {
        type: String,
        default: null
    },

    bio: {
         type: String, 
         default: null 
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
    companyName: { 
        type: String, 
        default: null 
    },
    
    companyWebsite: { 
        type: String, 
        default: null 
    },

    companySize: { 
        type: String, 
        default: null 
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