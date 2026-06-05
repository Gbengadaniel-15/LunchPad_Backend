import express from 'express'

import { getNotifications,
    getUnreadCount, 
    markAsRead,
    markAllAsRead,
    deleteNotification} from '../controllers/notificationController.js'
import { authMiddleware } from '../middleware/authMiddleware.js';


const router =express.Router()

// All notification routes are private — must be logged in
router.use(authMiddleware)

// Get all my notifications
router.get('/', getNotifications)

// Get unread notifications count
router.get('/unread', getUnreadCount)

// Mark all notifications as read
router.put('/read-all', markAllAsRead)

// Mark one notification as read
router.put('/:id', markAsRead)

// Delete one notification
router.delete('/:id', deleteNotification)

export default router