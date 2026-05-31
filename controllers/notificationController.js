
import Notification from '../models/notification.js';


//Create Notification
export const createNotification = async (req, res, next) => {
  try {

    const notification = await Notification.create({
      user: req.body.user,
      title: req.body.title,
      message: req.body.message
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });

  } catch (error) {
    next(error);
  }
};


//Get Notifications

export const getNotifications = async (req, res, next) => {
  try {

    const notifications = await Notification.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications
    });

  } catch (error) {
    next(error);
  }
};


//Mark Notification as Read

export const markAsRead = async (req, res, next) => {
  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        data: null
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    next(error);
  }
};



//Delete Notification

export const deleteNotification = async (req, res, next) => {
  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        data: null
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: null
    });

  } catch (error) {
    next(error);
  }
};
