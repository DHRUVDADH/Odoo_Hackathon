const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../../constants");

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    if (!user.isActive) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      });
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = requireRole("admin");

// Check if user is moderator or admin
const requireModerator = requireRole("admin", "moderator");

// Check if user owns the resource or is admin
const requireOwnership = (resourceModel, resourceIdField = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdField];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Resource not found",
        });
      }

      // Check if user owns the resource or is admin
      const isOwner = resource.owner?.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.FORBIDDEN,
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  };
};

module.exports = {
  verifyToken,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireModerator,
  requireOwnership,
};
