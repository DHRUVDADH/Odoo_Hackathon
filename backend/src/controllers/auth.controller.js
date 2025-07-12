const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} = require("../../constants");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message:
          existingUser.email === email
            ? ERROR_MESSAGES.DUPLICATE_EMAIL
            : ERROR_MESSAGES.DUPLICATE_USERNAME,
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_CREATED,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("stats");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, location, phone, preferences } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (phone !== undefined) updateData.phone = phone;
    if (preferences)
      updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_UPDATED,
      data: { user },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const user = await User.findById(req.user._id);
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  try {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { token },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  refreshToken,
};
