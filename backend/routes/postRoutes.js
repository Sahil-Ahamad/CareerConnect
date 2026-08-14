const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createPost,
  getAllPosts,
  likePost,
  addComment,
  deletePost,
  updatePost,
} = require("../controllers/postController");

router.get("/", protect, getAllPosts);
router.post("/", protect, createPost);
router.put("/:id/like", protect, likePost);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deletePost);
router.put("/:id", protect, updatePost);

module.exports = router;