const express = require("express");
const router = express.Router();

// TODO: Implement item routes
// - Get all items (with filters)
// - Get item by ID
// - Create item
// - Update item
// - Delete item
// - Like/unlike item
// - Search items
// - Get user's items

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Item routes - to be implemented",
  });
});

module.exports = router;
