const User = require("../models/User");

// Get Logged-in User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Logged-in User Profile
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.profilePicture = req.file.path;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.resume = req.file.path;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchQuery = q.trim();

    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { skills: { $regex: searchQuery, $options: "i" } },
        { college: { $regex: searchQuery, $options: "i" } },
        { branch: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Follow User
const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // Prevent following yourself
    if (targetUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const userToFollow = await User.findById(targetUserId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent duplicate follows
    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user",
      });
    }

    currentUser.following.push(targetUserId);
    userToFollow.followers.push(req.user.id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: "User followed successfully",
      following: currentUser.following,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Unfollow User
const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const userToUnfollow = await User.findById(targetUserId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check whether the user is actually following them
    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user",
      });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user.id
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      following: currentUser.following,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Followers
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name email profilePicture bio skills college branch");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.followers.length,
      followers: user.followers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Following
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("following", "name email profilePicture bio skills college branch");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.following.length,
      following: user.following,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  uploadResume,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};