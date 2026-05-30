const Notification = require("../models/notification");


// CREATE NOTIFICATION
exports.createNotification = async (req, res) => {
  try {

    const { userId, message } = req.body;

    const notification = await Notification.create({
      user: userId,
      message,
    });

    res.status(201).json(notification);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET USER NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// MARK AS READ
exports.markAsRead = async (req, res) => {
  try {

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json(notification);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
