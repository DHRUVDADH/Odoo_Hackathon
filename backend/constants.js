const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

const ITEM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  SOLD: 'sold',
  EXPIRED: 'expired',
  FLAGGED: 'flagged',
};

const SWAP_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const ITEM_CONDITION = {
  LIKE_NEW: 'Like New',
  EXCELLENT: 'Excellent',
  VERY_GOOD: 'Very Good',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
};

const ITEM_CATEGORIES = {
  TOPS: 'Tops',
  DRESSES: 'Dresses',
  OUTERWEAR: 'Outerwear',
  BOTTOMS: 'Bottoms',
  SHOES: 'Shoes',
  ACCESSORIES: 'Accessories',
  BAGS: 'Bags',
  JEWELRY: 'Jewelry',
};

const ITEM_SIZES = {
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
  FREE_SIZE: 'Free Size',
};

const POINTS_SYSTEM = {
  LIST_ITEM: 10,
  COMPLETE_SWAP: 25,
  RECEIVE_POSITIVE_REVIEW: 5,
  GIVE_POSITIVE_REVIEW: 3,
  DAILY_LOGIN: 1,
  REFER_FRIEND: 50,
};

const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 6,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
};

const NOTIFICATION_TYPES = {
  SWAP_REQUEST: 'swap_request',
  SWAP_ACCEPTED: 'swap_accepted',
  SWAP_REJECTED: 'swap_rejected',
  ITEM_APPROVED: 'item_approved',
  ITEM_REJECTED: 'item_rejected',
  NEW_MESSAGE: 'new_message',
  POINTS_EARNED: 'points_earned',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  ITEM_NOT_FOUND: 'Item not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation failed',
  DUPLICATE_EMAIL: 'Email already exists',
  DUPLICATE_USERNAME: 'Username already exists',
  INVALID_TOKEN: 'Invalid or expired token',
  FILE_TOO_LARGE: 'File size too large',
  INVALID_FILE_TYPE: 'Invalid file type',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
};

const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  ITEM_CREATED: 'Item created successfully',
  ITEM_UPDATED: 'Item updated successfully',
  ITEM_DELETED: 'Item deleted successfully',
  SWAP_CREATED: 'Swap request created successfully',
  SWAP_UPDATED: 'Swap updated successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_RESET: 'Password reset email sent',
  EMAIL_VERIFIED: 'Email verified successfully',
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  ITEM_STATUS,
  SWAP_STATUS,
  ITEM_CONDITION,
  ITEM_CATEGORIES,
  ITEM_SIZES,
  POINTS_SYSTEM,
  UPLOAD_LIMITS,
  PAGINATION,
  SEARCH,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
}; 