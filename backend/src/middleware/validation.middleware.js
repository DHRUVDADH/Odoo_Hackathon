const { validationResult } = require("express-validator");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../../constants");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors: errorMessages,
    });
  }

  next();
};

// Custom validation for ObjectId
const isValidObjectId = (value) => {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(value);
};

// Custom validation for file uploads
const validateFileUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "No files uploaded",
    });
  }

  const { UPLOAD_LIMITS } = require("../../constants");

  // Check file count
  if (req.files.length > UPLOAD_LIMITS.MAX_FILES) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Maximum ${UPLOAD_LIMITS.MAX_FILES} files allowed`,
    });
  }

  // Check each file
  for (const file of req.files) {
    // Check file size
    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `File ${file.originalname} is too large. Maximum size is ${
          UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024)
        }MB`,
      });
    }

    // Check file type
    if (!UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `File ${
          file.originalname
        } has invalid type. Allowed types: ${UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.join(
          ", "
        )}`,
      });
    }
  }

  next();
};

// Pagination validation
const validatePagination = (req, res, next) => {
  const { PAGINATION } = require("../../constants");

  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;

  if (page < 1) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Page number must be greater than 0",
    });
  }

  if (limit < 1 || limit > PAGINATION.MAX_LIMIT) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Limit must be between 1 and ${PAGINATION.MAX_LIMIT}`,
    });
  }

  req.pagination = { page, limit };
  next();
};

// Search query validation
const validateSearchQuery = (req, res, next) => {
  const { SEARCH } = require("../../constants");
  const query = req.query.q?.trim();

  if (
    query &&
    (query.length < SEARCH.MIN_QUERY_LENGTH ||
      query.length > SEARCH.MAX_QUERY_LENGTH)
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Search query must be between ${SEARCH.MIN_QUERY_LENGTH} and ${SEARCH.MAX_QUERY_LENGTH} characters`,
    });
  }

  next();
};

// Rate limiting error handler
const handleRateLimitError = (req, res) => {
  return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
    success: false,
    message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
  });
};

module.exports = {
  handleValidationErrors,
  isValidObjectId,
  validateFileUpload,
  validatePagination,
  validateSearchQuery,
  handleRateLimitError,
};
