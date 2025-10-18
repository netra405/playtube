import mongoose from "mongoose";

// Reply Schema
const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Comment Schema
const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  replies: [replySchema]
}, { timestamps: true });

// Video Schema
const videoSchema = new mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  videoUrl: {
    type: String,
    default: ""
  },
  thumbnail: {
    type: String,
    required: true
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  saveBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [commentSchema]
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

export default Video;
