// express
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import errorMiddleware from './middleware/errorMiddleware.js'

//import routes

import adminRoutes from './routes/adminRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import authRoutes from './routes/authRoutes.js'
import notiicationRoutes from './routes/notificationRoutes.js'
import savedJobRoutes from './routes/savedJobRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'



//middleware

const app = express()

app.use (cors());
app.use (helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) =>{
    res.json({message: 'launchpad Api is running'})
})


// use the routes
// app.use('/api/auth', authRoutes)

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/notifications', notiicationRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/saved-job', savedJobRoutes)



// error handler 
app.use(errorMiddleware)

//export 
export default app