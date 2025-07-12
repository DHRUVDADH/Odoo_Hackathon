const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const { UPLOAD_LIMITS } = require("../../constants");

// Check if Cloudinary credentials are configured
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary Configuration Check:");
console.log("Cloud Name:", cloudName ? "Set" : "Missing");
console.log("API Key:", apiKey ? "Set" : "Missing");
console.log("API Secret:", apiSecret ? "Set" : "Missing");

let storage;

if (cloudName && apiKey && apiSecret) {
  console.log("✅ Using Cloudinary storage");
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  // Configure Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "rewear-items",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto" },
      ],
    },
  });
} else {
  console.log("⚠️  Cloudinary credentials missing, using local storage");
  console.error("❌ Cloudinary credentials are missing! Please check your .env file.");
  console.error("Required environment variables:");
  console.error("- CLOUDINARY_CLOUD_NAME");
  console.error("- CLOUDINARY_API_KEY");
  console.error("- CLOUDINARY_API_SECRET");
  
  // Fallback to local storage
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
}

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Configure multer with storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE,
    files: UPLOAD_LIMITS.MAX_FILES,
  },
  fileFilter: fileFilter,
});

// Middleware for handling multiple image uploads
const uploadImages = upload.array("images", UPLOAD_LIMITS.MAX_FILES);

// Wrapper middleware to handle errors
const handleImageUpload = (req, res, next) => {
  console.log("Upload middleware called");
  console.log("Request headers:", req.headers);

  uploadImages(req, res, (err) => {
    console.log("Upload callback executed");
    console.log("Error:", err);
    console.log("Files after upload:", req.files);

    if (err instanceof multer.MulterError) {
      console.log("Multer error:", err.code);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is 5MB.",
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: `Too many files. Maximum ${UPLOAD_LIMITS.MAX_FILES} files allowed.`,
        });
      }
      return res.status(400).json({
        success: false,
        message: "File upload error",
      });
    } else if (err) {
      console.log("Other error:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      console.log("Processing files:", req.files.length);
      req.files = req.files.map((file) => {
        console.log("Processing file:", file.originalname);
        
        // Handle both Cloudinary and local storage
        if (cloudName && apiKey && apiSecret) {
          // Cloudinary storage
          return {
            url: file.path, // Cloudinary URL
            publicId: file.filename, // Cloudinary public ID
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          };
        } else {
          // Local storage
          return {
            url: `/uploads/${file.filename}`,
            publicId: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          };
        }
      });
    } else {
      console.log("No files in req.files");
    }

    console.log("Upload middleware completed, calling next()");
    next();
  });
};

module.exports = {
  uploadImages,
  handleImageUpload,
};
