const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter"],
      default: "student",
    },

    bio: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    graduationYear: {
      type: Number,
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
        followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);