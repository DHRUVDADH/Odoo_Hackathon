const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Item title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Tops",
        "Dresses",
        "Outerwear",
        "Bottoms",
        "Shoes",
        "Accessories",
        "Bags",
        "Jewelry",
      ],
    },
    size: {
      type: String,
      required: [true, "Size is required"],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["Like New", "Excellent", "Very Good", "Good", "Fair", "Poor"],
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    color: {
      type: String,
      trim: true,
      default: "",
    },
    material: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "active",
        "sold",
        "expired",
        "flagged",
        "redeemed", // Added to allow marking items as redeemed
      ],
      default: "pending",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      length: Number,
      shoulders: Number,
      sleeve: Number,
      inseam: Number,
    },
    isSwapOnly: {
      type: Boolean,
      default: false,
    },
    swapPreferences: {
      categories: [
        {
          type: String,
          enum: [
            "Tops",
            "Dresses",
            "Outerwear",
            "Bottoms",
            "Shoes",
            "Accessories",
            "Bags",
            "Jewelry",
          ],
        },
      ],
      sizes: [
        {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
        },
      ],
      conditions: [
        {
          type: String,
          enum: ["Like New", "Excellent", "Very Good", "Good", "Fair", "Poor"],
        },
      ],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    location: {
      type: String,
      default: "",
    },
    shippingInfo: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      shippingCost: {
        type: Number,
        default: 0,
      },
      freeShipping: {
        type: Boolean,
        default: false,
      },
    },
    expiryDate: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
      },
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
itemSchema.index({
  title: "text",
  description: "text",
  brand: "text",
  tags: "text",
});

// Index for filtering
itemSchema.index({ category: 1, status: 1, price: 1 });
itemSchema.index({ owner: 1, status: 1 });
itemSchema.index({ status: 1, createdAt: -1 });

// Virtual for like count
itemSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Check if item is expired
itemSchema.methods.isExpired = function () {
  return new Date() > this.expiryDate;
};

// Update status to expired if past expiry date
itemSchema.methods.checkExpiry = function () {
  if (this.isExpired() && this.status === "active") {
    this.status = "expired";
    return true;
  }
  return false;
};

module.exports = mongoose.model("Item", itemSchema);
