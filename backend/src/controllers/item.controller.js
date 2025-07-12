const Item = require("../models/Item");
const User = require("../models/User");
const {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  POINTS_SYSTEM,
} = require("../../constants");

// Create new item
const createItem = async (req, res) => {
  try {
    console.log("Create item request received");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Request headers:", req.headers);

    const {
      title,
      description,
      category,
      size,
      condition,
      brand,
      color,
      material,
      price,
      originalPrice,
      tags,
      isSwapOnly,
      swapPreferences,
      location,
      measurements,
      shippingInfo,
    } = req.body;

    // Create item data object
    const itemData = {
      title,
      description,
      category,
      size,
      condition,
      brand: brand || "",
      color: color || "",
      material: material || "",
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      owner: req.user._id,
      tags: tags ? JSON.parse(tags) : [],
      isSwapOnly: isSwapOnly === "true",
      location: location || "",
    };

    // Add optional fields if provided
    if (swapPreferences) {
      itemData.swapPreferences = JSON.parse(swapPreferences);
    }

    if (measurements) {
      itemData.measurements = JSON.parse(measurements);
    }

    if (shippingInfo) {
      itemData.shippingInfo = JSON.parse(shippingInfo);
    }

    // Handle image uploads (if any)
    if (req.files && req.files.length > 0) {
      console.log("Processing uploaded files:", req.files.length);
      itemData.images = req.files.map((file) => {
        console.log("File:", file);
        return {
          url: file.url || file.path, // Cloudinary URL
          publicId: file.publicId || file.public_id || file.filename, // Cloudinary public ID
        };
      });
    } else {
      console.log("No files uploaded");
      itemData.images = []; // Ensure images array is always present
    }

    console.log("Item data to create:", itemData);

    // Create the item
    const item = await Item.create(itemData);

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.itemsListed": 1, points: POINTS_SYSTEM.LIST_ITEM },
    });

    // Populate owner information
    await item.populate("owner", "firstName lastName username avatar");

    console.log("Item created successfully:", item._id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.ITEM_CREATED,
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Create item error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    // Send more specific error messages
    if (error.name === "ValidationError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.name === "CastError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid data format",
      });
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Get all items with filters
const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      size,
      condition,
      minPrice,
      maxPrice,
      search,
      status = "active",
    } = req.query;

    // Build filter object
    const filter = { status };

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ],
      };
    }

    // Combine filters
    const finalFilter = { ...filter, ...searchQuery };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get items with pagination
    const items = await Item.find(finalFilter)
      .populate("owner", "firstName lastName username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Item.countDocuments(finalFilter);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ITEMS_FETCHED,
      data: {
        items,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Get item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id).populate(
      "owner",
      "firstName lastName username avatar bio location"
    );

    if (!item) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.ITEM_NOT_FOUND,
      });
    }

    // Increment view count (if not the owner)
    if (req.user && item.owner._id.toString() !== req.user._id.toString()) {
      await Item.findByIdAndUpdate(id, { $inc: { views: 1 } });
      item.views += 1;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ITEM_FETCHED,
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Get item by ID error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if item exists and user owns it
    const item = await Item.findById(id);
    if (!item) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.ITEM_NOT_FOUND,
      });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    // Handle image uploads (if any)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.secure_url || file.url || file.path,
        publicId: file.publicId || file.public_id || file.filename,
      }));
      updateData.images = [...(item.images || []), ...newImages];
    }

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("owner", "firstName lastName username avatar");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ITEM_UPDATED,
      data: {
        item: updatedItem,
      },
    });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists and user owns it
    const item = await Item.findById(id);
    if (!item) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.ITEM_NOT_FOUND,
      });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    // Delete the item
    await Item.findByIdAndDelete(id);

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.itemsListed": -1 },
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ITEM_DELETED,
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Get user's items
const getUserItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { owner: userId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(filter)
      .populate("owner", "firstName lastName username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(filter);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ITEMS_FETCHED,
      data: {
        items,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get user items error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Like/unlike item
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.ITEM_NOT_FOUND,
      });
    }

    const isLiked = item.likes.includes(userId);

    if (isLiked) {
      // Unlike
      await Item.findByIdAndUpdate(id, {
        $pull: { likes: userId },
      });
    } else {
      // Like
      await Item.findByIdAndUpdate(id, {
        $addToSet: { likes: userId },
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: isLiked
        ? SUCCESS_MESSAGES.ITEM_UNLIKED
        : SUCCESS_MESSAGES.ITEM_LIKED,
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// ADMIN: Get all pending items
const getPendingItems = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await Item.find({ status: "pending" })
      .populate("owner", "firstName lastName username avatar email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Item.countDocuments({ status: "pending" });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Pending items fetched",
      data: {
        items,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get pending items error:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

// ADMIN: Approve item
const approveItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: ERROR_MESSAGES.ITEM_NOT_FOUND });
    }
    item.status = "approved";
    item.adminNotes = "";
    await item.save();
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Item approved", data: { item } });
  } catch (error) {
    console.error("Approve item error:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

// ADMIN: Reject item
const rejectItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const item = await Item.findById(id);
    if (!item) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: ERROR_MESSAGES.ITEM_NOT_FOUND });
    }
    item.status = "rejected";
    item.adminNotes = reason || "Rejected by admin";
    await item.save();
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Item rejected", data: { item } });
  } catch (error) {
    console.error("Reject item error:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getUserItems,
  toggleLike,
  getPendingItems,
  approveItem,
  rejectItem,
};
