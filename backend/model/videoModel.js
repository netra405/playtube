// import mongoose from "mongoose";

// // Reply Schema
// const replySchema = new mongoose.Schema({
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// // Comment Schema
// const commentSchema = new mongoose.Schema({
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   replies: [replySchema]
// }, { timestamps: true });

// // Video Schema
// const videoSchema = new mongoose.Schema({
//   channel: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Channel",
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     default: ""
//   },
//   videoUrl: {
//     type: String,
//     default: ""
//   },
//   thumbnail: {
//     type: String,
//     required: true
//   },
//   tags: [String],
//   views: {
//     type: Number,
//     default: 0
//   },
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   }],
//   dislikes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   }],
//   saveBy: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   }],
//   comments: [commentSchema]
// }, { timestamps: true });

// const Video = mongoose.model("Video", videoSchema);

// export default Video;



import mongoose from "mongoose";

// Reply Schema
const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

// Video Schema
const videoSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    videoUrl: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true, // allows efficient tag searching
    },
    category: {
      type: String,
      default: "Uncategorized",
      index: true,
      enum: [
        "Music",
        "Gaming",
        "Movies",
        "TV Shows",
        "News",
        "Trending",
        "Entertainment",
        "Education",
        "Science & Tech",
        "Travel",
        "Fashion",
        "Cooking",
        "Sports",
        "Pets",
        "Art",
        "Comedy",
        "Vlogs",
        "Others",
      ],
    },
    type: {
      type: String,
      default: "General", // e.g., “Vlog”, “Tutorial”, “Short”, etc.
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saveBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Full-text search optimization (recommended for AI + filters)
videoSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  category: "text",
  type: "text",
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
