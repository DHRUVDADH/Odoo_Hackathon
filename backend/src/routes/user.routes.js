const express = require("express");
const router = express.Router();

// TODO: Implement user routes
// - Get user by ID
// - Get user items
// - Get user swaps
// - Update user preferences
// - Get user stats

router.get("/:id", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User routes - to be implemented",
  });
});

module.exports = router;
