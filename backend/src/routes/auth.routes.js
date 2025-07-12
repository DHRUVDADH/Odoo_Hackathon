const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const {
  handleValidationErrors,
} = require("../middleware/validation.middleware");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required and must be less than 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required and must be less than 50 characters"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be less than 50 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be less than 50 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),
  body("phone")
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Routes
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  authController.register
);
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authController.login
);
router.post("/logout", verifyToken, authController.logout);
router.get("/profile", verifyToken, authController.getProfile);
router.put(
  "/profile",
  verifyToken,
  updateProfileValidation,
  handleValidationErrors,
  authController.updateProfile
);
router.put(
  "/change-password",
  verifyToken,
  changePasswordValidation,
  handleValidationErrors,
  authController.changePassword
);
router.post("/refresh-token", verifyToken, authController.refreshToken);

module.exports = router;
