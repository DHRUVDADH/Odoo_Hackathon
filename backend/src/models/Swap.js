const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    offeredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: [500, "Message cannot exceed 500 characters"],
      default: "",
    },
    counterOffer: {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      message: {
        type: String,
        maxlength: [500, "Counter offer message cannot exceed 500 characters"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    shippingInfo: {
      requester: {
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String,
      },
      recipient: {
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String,
      },
    },
    tracking: {
      requesterTracking: {
        carrier: String,
        trackingNumber: String,
        shippedAt: Date,
        deliveredAt: Date,
      },
      recipientTracking: {
        carrier: String,
        trackingNumber: String,
        shippedAt: Date,
        deliveredAt: Date,
      },
    },
    timeline: [
      {
        action: {
          type: String,
          enum: [
            "created",
            "accepted",
            "rejected",
            "counter_offered",
            "shipped",
            "delivered",
            "completed",
            "cancelled",
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
      },
    ],
    ratings: {
      requesterRating: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: [500, "Rating comment cannot exceed 500 characters"],
        },
        createdAt: Date,
      },
      recipientRating: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: [500, "Rating comment cannot exceed 500 characters"],
        },
        createdAt: Date,
      },
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ recipient: 1, status: 1 });
swapSchema.index({ requestedItem: 1, status: 1 });
swapSchema.index({ offeredItem: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });

// Check if swap is expired
swapSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Add timeline entry
swapSchema.methods.addTimelineEntry = function (action, userId, message = "") {
  this.timeline.push({
    action,
    userId,
    message,
    timestamp: new Date(),
  });
};

// Update status and add timeline entry
swapSchema.methods.updateStatus = function (newStatus, userId, message = "") {
  this.status = newStatus;
  this.addTimelineEntry(newStatus, userId, message);
};

// Check if both items are shipped
swapSchema.methods.bothItemsShipped = function () {
  return (
    this.tracking.requesterTracking.shippedAt &&
    this.tracking.recipientTracking.shippedAt
  );
};

// Check if both items are delivered
swapSchema.methods.bothItemsDelivered = function () {
  return (
    this.tracking.requesterTracking.deliveredAt &&
    this.tracking.recipientTracking.deliveredAt
  );
};

// Pre-save middleware to add initial timeline entry
swapSchema.pre("save", function (next) {
  if (this.isNew) {
    this.addTimelineEntry("created", this.requester, "Swap request created");
  }
  next();
});

module.exports = mongoose.model("Swap", swapSchema);
