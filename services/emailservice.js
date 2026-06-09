import dotenv from 'dotenv'
dotenv.config()
import  nodemailer from 'nodemailer'

//create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,          // false for port 587
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
// Verify connection

transporter.verify((error, success) => {
    if (error) {
        console.log('Email service error:', error)
    } else{
        console.log( 'Email service is ready' )
    }

})

// ================
// Welcome Email

export const sendWelcomeEmail = async (user) => {
    try{
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Welcome to LaunchPad',
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a2e;">Welcome to LaunchPad, ${user.name}! 🚀</h2>
                    <p>Your first step into tech starts here.</p>
                    <p>LaunchPad is built exclusively for  tech students and fresh graduates like you.</p>
                    <p>Here is what you can do on LaunchPad:</p>
                    <ul>
                        <li>Browse verified job listings</li>
                        <li>Apply with your CV directly</li>
                        <li>Track your applications</li>
                        <li>Stay safe from fake recruiters</li>
                    </ul>
                    <p style="color: #00b4d8;">Your journey starts now. Good luck!</p>
                    <p>— The LaunchPad Team</p>
                </div>
            `
        })
        console.log(`Welcome email sent to ${user.email}`)
    } catch (error) {
        console.log('Error sending welcome email:', error)
    }
}
//
//Application Received Email - goes to Employer
//========================

export const sendApplicationRecieveEmail = async (employer, applicant, job) =>{
    try{
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: employer.email,
            subject: `New Application for ${job.title}`,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a2e;">New Application Received</h2>
                    <p>Someone just applied for your job listing.</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Title</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Applicant Name</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${applicant.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Applicant Email</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${applicant.email}</td>
                        </tr>
                    </table>
                    <p>Login to LaunchPad to review their application and CV.</p>
                    <p>— The LaunchPad Team</p>
                </div> `


        })
        console.log(`Application received email sent to ${employer.email}`)
    } catch (error) {
        console.log('Error sending application received email:', error)
    }
}


//=========================
//Application Accepted Email - goes to Tunde
//===============================

export const sendApplicationAcceptedEmail = async ( applicant, job) =>{
    try{
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: applicant.email,
            subject: `Congratulations! Your application for ${job.title} was accepted`,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00b4d8;">Congratulations ${applicant.name}! 🎉</h2>
                    <p>Your application has been accepted.</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Title</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.company}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.location}</td>
                        </tr>
                    </table>
                    <p>The employer will reach out to you soon with next steps.</p>
                    <p style="color: #00b4d8;">This is your first step into tech. Keep going!</p>
                    <p>— The LaunchPad Team</p>
                </div>
            `
        })
        console.log(`Acceptance email sent to ${applicant.email}`)
    } catch (error) {
        console.log('Error sending acceptance email:', error)
    }
}


// =====================
// Application Rejected Email — goes to Tunde
// =====================
export const sendApplicationRejectedEmail = async (applicant, job) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: applicant.email,
            subject: `Update on your application for ${job.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a2e;">Application Update</h2>
                    <p>Hi ${applicant.name},</p>
                    <p>Thank you for applying for <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
                    <p>After careful review, the employer has decided to move forward with other candidates at this time.</p>
                    <p>Do not be discouraged — keep applying. LaunchPad has more verified opportunities waiting for you.</p>
                    <p style="color: #00b4d8;">Your journey is just beginning. Keep going!</p>
                    <p>— The LaunchPad Team</p>
                </div>
            `
        })
        console.log(`Rejection email sent to ${applicant.email}`)
    } catch (error) {
        console.log('Error sending rejection email:', error)
    }
}

// =====================
// Job Approved Email — goes to Employer
// =====================
export const sendJobApprovedEmail = async (employer, job) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: employer.email,
            subject: `Your job listing "${job.title}" has been approved ✅`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00b4d8;">Job Listing Approved ✅</h2>
                    <p>Hi ${employer.name},</p>
                    <p>Your job listing has been reviewed and approved by our team.</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Title</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.company}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.location}</td>
                        </tr>
                    </table>
                    <p>Your listing is now live and visible to all applicants on LaunchPad.</p>
                    <p>— The LaunchPad Team</p>
                </div>
            `
        })
        console.log(`Job approved email sent to ${employer.email}`)
    } catch (error) {
        console.log('Error sending job approved email:', error)
    }
}

// =====================
// Job Rejected Email — goes to Employer
// =====================
export const sendJobRejectedEmail = async (employer, job) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: employer.email,
            subject: `Your job listing "${job.title}" was not approved`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a2e;">Job Listing Not Approved</h2>
                    <p>Hi ${employer.name},</p>
                    <p>Unfortunately your job listing has been reviewed and could not be approved at this time.</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Title</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.title}</td>
                        </tr>
                    </table>
                    <p>Please review your listing and make sure it meets our guidelines before resubmitting.</p>
                    <p>— The LaunchPad Team</p>
                </div>
            `
        })
        console.log(`Job rejected email sent to ${employer.email}`)
    } catch (error) {
        console.log('Error sending job rejected email:', error)
    }
}

// =====================
// Account Verified Email — goes to Employer
// =====================
export const sendAccountVerifiedEmail = async (employer) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: employer.email,
            subject: `Your LaunchPad account has been verified ✅`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00b4d8;">Account Verified ✅</h2>
                    <p>Hi ${employer.name},</p>
                    <p>Your employer account has been reviewed and verified by the LaunchPad team.</p>
                    <p>You can now post job listings that will be visible to thousands of Nigerian tech students and fresh graduates.</p>
                    <p style="color: #00b4d8;">Welcome to the LaunchPad employer community!</p>
                    <p>— The LaunchPad Team</p>
                </div>
            `
        })
        console.log(`Account verified email sent to ${employer.email}`)
    } catch (error) {
        console.log('Error sending account verified email:', error)
    }
}

// =====================
// Account Banned Email — goes to User
// =====================
export const sendAccountBannedEmail = async (user) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `Your LaunchPad account has been suspended`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #e63946;">Account Suspended</h2>
                    <p>Hi ${user.name},</p>
                    <p>Your LaunchPad account has been suspended due to a violation of our community guidelines.</p>
                    <p>If you believe this is a mistake, please contact our support team.</p>
                    <p>— The LaunchPad Team</p>
                </div>
            `
        })
        console.log(`Account banned email sent to ${user.email}`)
    } catch (error) {
        console.log('Error sending account banned email:', error)
    }
}

// =====================
// Job Pending Email — goes to Admin when employer posts a job
// =====================
export const sendJobPendingEmail = async (job, employer) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL,  // 
            subject: `New Job Listing Needs Approval — ${job.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a2e;">New Job Listing Pending Approval</h2>
                    <p>A new job listing has been submitted and needs your review.</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Title</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.company}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${job.location}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Employer Name</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${employer.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Employer Email</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${employer.email}</td>
                        </tr>
                    </table>
                    <p>Please login to LaunchPad admin panel to approve or reject this listing.</p>
                    <p>— The LaunchPad System</p>
                </div>
            `
        })
        console.log(`Job pending email sent to admin`)
    } catch (error) {
        console.log('Error sending job pending email:', error)
    }
}