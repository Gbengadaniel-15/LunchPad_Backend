import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

// configuration of cloudinary with env credentials

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

// Store files in memory temporarilty before sending to cloudinary
const  storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //5mb max
    },
    fileFilter: (req, file, cb) =>{
        if(
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            cb(null, true) // accept the file
        
        }else {
            cb(new Error('Only PDF and word document are allowed'), false)
        }
    }
})

// this function takes the file from memory and pushed it to cloudinary

const uploadToCloudinary = (fileBuffer, filename) => {
    return new Promise((resolve,reject) => {
        cloudinary.uploader.upload_stream (
            {
                folder: 'launchpad/resumes',
                resource_type: 'raw',
                public_id: filename

            },
            (error, result) => {
                if (error) reject(error)
                    else resolve(result)
            }
        ).end(fileBuffer)

    })
}
export { cloudinary, upload, uploadToCloudinary }