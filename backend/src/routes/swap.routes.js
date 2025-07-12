const express = require("express");
const router = express.Router();
const Swap = require("../models/Swap");
const Item = require("../models/Item");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth.middleware");

// TODO: Implement swap routes
// - Create swap request
// - Get swap by ID
// - Get user's swaps
// - Accept/reject swap
// - Update swap status
// - Add tracking info
// - Rate swap

// POST /request - Create a swap request
router.post("/request", verifyToken, async (req, res) => {
  const { requestedItemId, offeredItemId } = req.body;
  const requesterId = req.user._id;

  try {
    const requestedItem = await Item.findById(requestedItemId).populate(
      "owner"
    );
    const offeredItem = await Item.findById(offeredItemId).populate("owner");
    if (!requestedItem || !offeredItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    if (
      requestedItem.status !== "approved" ||
      offeredItem.status !== "approved"
    ) {
      return res.status(400).json({
        success: false,
        message: "Both items must be approved and available for swap.",
      });
    }
    // Prevent swapping with self
    if (requestedItem.owner._id.toString() === requesterId.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot swap with yourself." });
    }

    // Calculate point difference
    const difference = requestedItem.price - offeredItem.price;
    // If difference > 0, requester must pay the difference
    // If difference < 0, recipient (owner of requested item) must pay the absolute difference
    // If difference == 0, no points need to be exchanged
    if (difference > 0) {
      if (req.user.points < difference) {
        return res.status(400).json({
          success: false,
          message: `You need at least ${difference} points to swap for this item.`,
        });
      }
    } else if (difference < 0) {
      if (requestedItem.owner.points < Math.abs(difference)) {
        return res.status(400).json({
          success: false,
          message: `The other user needs at least ${Math.abs(
            difference
          )} points to swap for your item.`,
        });
      }
    }
    // Create swap request
    const swap = await Swap.create({
      requestedItem: requestedItem._id,
      offeredItem: offeredItem._id,
      requester: requesterId,
      recipient: requestedItem.owner._id, // Correct: recipient is the owner of the requested item
      status: "pending",
      // Optionally, store the point difference and who pays
      // pointDifference: difference,
      // payer: difference > 0 ? requesterId : (difference < 0 ? requestedItem.owner._id : null),
    });
    res.json({ success: true, swap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Accept a swap request
router.post("/:id/accept", verifyToken, async (req, res) => {
  const swapId = req.params.id;
  try {
    const swap = await Swap.findById(swapId)
      .populate("requestedItem")
      .populate("offeredItem")
      .populate("requester")
      .populate("recipient");
    if (!swap) {
      return res
        .status(404)
        .json({ success: false, message: "Swap not found" });
    }
    // Only recipient can accept
    if (swap.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the recipient can accept this swap.",
      });
    }
    if (swap.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Swap is not pending." });
    }
    // Calculate point difference
    const difference = swap.requestedItem.price - swap.offeredItem.price;
    // Transfer points
    if (difference > 0) {
      // Requester pays difference to recipient
      if (swap.requester.points < difference) {
        return res.status(400).json({
          success: false,
          message: `Requester does not have enough points.`,
        });
      }
      await User.findByIdAndUpdate(swap.requester._id, {
        $inc: { points: -difference },
      });
      await User.findByIdAndUpdate(swap.recipient._id, {
        $inc: { points: difference },
      });
    } else if (difference < 0) {
      // Recipient pays difference to requester
      if (swap.recipient.points < Math.abs(difference)) {
        return res.status(400).json({
          success: false,
          message: `Recipient does not have enough points.`,
        });
      }
      await User.findByIdAndUpdate(swap.recipient._id, {
        $inc: { points: difference },
      });
      await User.findByIdAndUpdate(swap.requester._id, {
        $inc: { points: -difference },
      });
    }
    // Swap item ownership
    const oldRequesterId = swap.requester._id;
    const oldRecipientId = swap.recipient._id;
    await Item.findByIdAndUpdate(swap.requestedItem._id, {
      owner: oldRequesterId,
      status: "approved", // Allow item to be swapped again
    });
    await Item.findByIdAndUpdate(swap.offeredItem._id, {
      owner: oldRecipientId,
      status: "approved", // Allow item to be swapped again
    });
    // Update swap status
    swap.status = "accepted";
    swap.timeline.push({
      action: "accepted",
      userId: req.user._id,
      timestamp: new Date(),
    });
    await swap.save();
    res.json({ success: true, message: "Swap accepted and completed.", swap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reject a swap request
router.post("/:id/reject", verifyToken, async (req, res) => {
  const swapId = req.params.id;
  try {
    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res
        .status(404)
        .json({ success: false, message: "Swap not found" });
    }
    // Only recipient can reject
    if (swap.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the recipient can reject this swap.",
      });
    }
    if (swap.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Swap is not pending." });
    }
    swap.status = "rejected";
    swap.timeline.push({
      action: "rejected",
      userId: req.user._id,
      timestamp: new Date(),
    });
    await swap.save();
    res.json({ success: true, message: "Swap rejected.", swap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /swaps?role=recipient&status=pending - Get swaps for the logged-in user as recipient
router.get("/", verifyToken, async (req, res) => {
  try {
    const { role, status } = req.query;
    let filter = {};
    if (role === "recipient") {
      filter = { recipient: req.user._id };
    } else if (role === "requester") {
      filter = { requester: req.user._id };
    }
    if (status) {
      filter = { ...filter, status };
    }
    const swaps = await Swap.find(filter)
      .populate("requestedItem")
      .populate("offeredItem")
      .populate("requester", "username avatar")
      .populate("recipient", "username avatar");
    res.json({ success: true, swaps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
