import { upload } from '../services/cloudinaryService.js';

// Resume upload — used by the apply-for-job route
export const uploadResume = upload.single('resume');

// Avatar upload — used by the update-profile route
export const uploadAvatar = upload.single('avatar');