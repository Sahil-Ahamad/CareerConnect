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
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/userController");

// Search Users
router.get("/search", protect, searchUsers);

// Get Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put("/profile", protect, updateProfile);

// Follow User
router.post("/:id/follow", protect, followUser);

// Unfollow User
router.post("/:id/unfollow", protect, unfollowUser);
// Get Followers
router.get("/:id/followers", protect, getFollowers);

// Get Following
router.get("/:id/following", protect, getFollowing);
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