const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  uploadResume,
  searchUsers,
} = require("../controllers/userController");
router.get("/search", protect, searchUsers);
// Get Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put("/profile", protect, updateProfile);

// Upload Profile Picture
router.post(
  "/upload-profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture
);

// Upload Resume
router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;