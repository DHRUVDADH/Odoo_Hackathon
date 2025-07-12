const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "swap_request",
        "swap_accepted",
        "swap_rejected",
        "swap_completed",
        "item_approved",
        "item_rejected",
        "new_message",
        "points_earned",
        "system_announcement",
        "item_liked",
        "item_viewed",
        "price_drop",
        "expiry_reminder",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    data: {
      // Flexible object to store additional data
      itemId: mongoose.Schema.Types.ObjectId,
      swapId: mongoose.Schema.Types.ObjectId,
      userId: mongoose.Schema.Types.ObjectId,
      points: Number,
      amount: Number,
      url: String,
      // Add more fields as needed
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isEmailSent: {
      type: Boolean,
      default: false,
    },
    isPushSent: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Mark as read
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
};

// Mark as unread
notificationSchema.methods.markAsUnread = function () {
  this.isRead = false;
  this.readAt = undefined;
};

// Check if notification is expired
notificationSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Static method to create notification
notificationSchema.statics.createNotification = function (
  recipientId,
  type,
  title,
  message,
  data = {}
) {
  return this.create({
    recipient: recipientId,
    type,
    title,
    message,
    data,
  });
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
  });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

// Static method to delete expired notifications
notificationSchema.statics.deleteExpired = function () {
  return this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};

module.exports = mongoose.model("Notification", notificationSchema);
