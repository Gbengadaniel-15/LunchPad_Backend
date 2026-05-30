const express = require("express");

const router = express.Router();

const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createNotification);

router.get("/", authMiddleware, getNotifications);

router.put("/:id", authMiddleware, markAsRead);

module.exports = router;
