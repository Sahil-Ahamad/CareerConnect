const Post = require("../models/Post");

// Create Post
const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user.id,
      text: req.body.text,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like / Unlike Post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.id
      );

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post unliked",
        likes: post.likes.length,
      });
    }

    post.likes.push(req.user.id);

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post liked",
      likes: post.likes.length,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = {
      user: req.user.id,
      text,
    };

    post.comments.push(comment);

    await post.save();

    await post.populate("comments.user", "name profilePicture");

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  addComment,
};