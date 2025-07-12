const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    preferences: {
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
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        swapRequests: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
      },
    },
    stats: {
      itemsListed: { type: Number, default: 0 },
      itemsSold: { type: Number, default: 0 },
      swapsCompleted: { type: Number, default: 0 },
      positiveReviews: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
