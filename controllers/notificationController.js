// controllers/notificationController.js
import Notification from '../models/notification.js'

// @desc    Get all my notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id    // ✅ recipient not user
    })
    .sort({ createdAt: -1 })     // newest first

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      count: notifications.length,
      data: notifications
    })

  } catch (error) {
    next(error)
  }
}

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread
// @access  Private
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    })

    res.status(200).json({
      success: true,
      message: 'Unread count retrieved successfully',
      data: { count }
    })

  } catch (error) {
    next(error)
  }
}

// @desc    Mark one notification as read
// @route   PUT /api/notifications/:id
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        data: null
      })
    }

    // only owner can mark as read
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this notification',
        data: null
      })
    }

    notification.isRead = true
    await notification.save()

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    })

  } catch (error) {
    next(error)
  }
}

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id },  // find all my notifications
      { isRead: true }              // mark all as read
    )

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: null
    })

  } catch (error) {
    next(error)
  }
}

// @desc    Delete one notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        data: null
      })
    }

    // only owner can delete
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this notification',
        data: null
      })
    }

    await notification.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: null
    })

  } catch (error) {
    next(error)
  }
}
