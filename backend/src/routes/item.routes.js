const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");
const { handleImageUpload } = require("../middleware/upload.middleware");

// Test endpoint for debugging
router.post("/test-upload", handleImageUpload, (req, res) => {
  console.log("Test upload endpoint called");
  console.log("Files:", req.files);
  console.log("Body:", req.body);

  res.json({
    success: true,
    message: "Test upload successful",
    files: req.files || [],
    body: req.body,
  });
});

// Public routes
router.get("/", itemController.getItems);
router.get("/:id", itemController.getItemById);

// Protected routes (require authentication)
router.post("/", verifyToken, handleImageUpload, itemController.createItem);
router.put("/:id", verifyToken, handleImageUpload, itemController.updateItem);
router.delete("/:id", verifyToken, itemController.deleteItem);
router.post("/:id/like", verifyToken, itemController.toggleLike);

// Redeem item with points
router.post("/:id/redeem", verifyToken, itemController.redeemItem);

// User's items
router.get("/user/:userId", itemController.getUserItems);

// Admin-only routes (temporarily allow all authenticated users)
router.get("/admin/pending", verifyToken, itemController.getPendingItems);
router.patch("/admin/:id/approve", verifyToken, itemController.approveItem);
router.patch("/admin/:id/reject", verifyToken, itemController.rejectItem);

module.exports = router;
