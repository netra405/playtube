import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";


import { GoogleGenerativeAI } from "@google/generative-ai";

export const createVideo = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;

    if (!title || !req.files?.video || !req.files?.thumbnail || !channelId) {
      return res.status(400).json({
        message: "title, videoUrl, thumbnail, and channelId are required",
      });
    }

    // ✅ Verify channel
    const channelData = await Channel.findById(channelId);
    if (!channelData)
      return res.status(400).json({ message: "Channel not found by Id" });

    // ✅ Upload video and thumbnail to Cloudinary
    const uploadVideo = await uploadOnCloudinary(req.files.video[0].path);
    const uploadThumbnail = await uploadOnCloudinary(
      req.files.thumbnail[0].path
    );

    // ✅ Parse tags (can come as JSON or comma-separated string)
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(",").map((t) => t.trim());
      }
    }

    // ✅ Initialize AI for automatic category detection
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an intelligent video classifier for a video streaming platform.
Based on the title, description, and tags, predict:
- The category (Music, Gaming, Vlogs, Education, Science & Tech, Travel, Comedy, etc.)
- The content type (Vlog, Tutorial, Review, Travel, News, etc.)
Return ONLY in this exact format:
Category: <category>
Type: <type>

Title: ${title}
Description: ${description}
Tags: ${parsedTags.join(", ")}
`;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text().trim();

    // ✅ Extract AI results
    const categoryMatch = aiText.match(/Category:\s*(.*)/i);
    const typeMatch = aiText.match(/Type:\s*(.*)/i);

    const category = categoryMatch ? categoryMatch[1].trim() : "Others";
    const type = typeMatch ? typeMatch[1].trim() : "General";

    // ✅ Create video with AI metadata
    const newVideo = await Video.create({
      title,
      description,
      channel: channelData._id,
      videoUrl: uploadVideo,
      thumbnail: uploadThumbnail,
      tags: parsedTags,
      category,
      type,
    });

    // ✅ Add video reference to channel
    await Channel.findByIdAndUpdate(
      channelData._id,
      { $push: { videos: newVideo._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Video uploaded successfully with AI category detection",
      video: newVideo,
    });
  } catch (error) {
    console.error("Error creating video:", error);
    return res.status(500).json({
      message: `Failed to create video: ${error.message}`,
    });
  }
};




// export const createVideo = async (req, res) => {
//     try {
//         const { title, description, tags, channelId} = req.body;
//         if (!title || !req.files.video || !req.files.thumbnail || !channelId) {
//             return res.status(400).json({message:"title, videoUrl, thumbnail, channelId is required"})
//         }
//         const channelDate = await Channel.findById(channelId)
//         if (!channelDate) {
//             return res.status(400).json({message:"Channel is not found by Id"})
//         }
//         const uploadVideo = await uploadOnCloudinary(req.files.video[0].path);
//         const uploadThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path)

//         let parsedTag = []
//         if (tags) {
//             try {
//                 parsedTag = JSON.parse(tags)
            
//         } catch (error) {
//             parsedTag = []
//         }
//         }

//         const newVideo = await Video.create({
//             title,
//             channel:channelDate._id,
//             description,
//             tags: parsedTag,
//             videoUrl:uploadVideo,
//             thumbnail:uploadThumbnail
//         })

//         await Channel.findByIdAndUpdate(channelDate._id, 
//             {$push: {videos : newVideo._id}},
//             {new:true}
//         )

//         return res.status(201).json(newVideo)
      

//     } catch (error) {
//         return res.status(500).json({message:`Failed to create video ${error}`})
//     }
// }


export const getAllVideos = async (req,res) => {
    try {
        const videos = await Video.find().sort({createdAt : -1}).populate("channel comments.author comments.replies.author")
        if (!videos) {
            return res.status(400).json({message:"Videos are not found"})
        }
        return res.status(200).json(videos)
    } catch (error) {
        return res.status(500).json({message: `failed to get videos ${error}`})
    }
}

export const toggleLikes = async (req, res) => {
    try {
        const {videoId} = req.params;
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({message: "Video is not found"})

        }
        if (video.likes.includes(userId)) {
            video.likes.pull(userId)
        } else {
            video.likes.push(userId)
            video.dislikes.pull(userId)
        }

        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({message:`failed to like video ${error}`})
    }
}

export const toggleDisLikes = async (req, res) => {
    try {
        const {videoId} = req.params;
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({message: "Video is not found"})

        }
        if (video.dislikes.includes(userId)) {
            video.dislikes.pull(userId)
        } else {
            video.dislikes.push(userId)
            video.likes.pull(userId)
        }

        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({message:`failed to dislike video ${error}`})
    }
}

export const toggleSave = async (req, res) =>{
    try {
         const {videoId} = req.params;
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({message: "Video is not found"})

        }

         if (video.saveBy.includes(userId)) {
            video.saveBy.pull(userId)
        } else {
            video.saveBy.push(userId)
        }

         await video.populate("comments.author", "userName photoUrl")
         await video.populate("channel")
         await video.populate("comments.replies.author", "userName photoUrl")
        await video.save()
        return res.status(200).json(video)
    } catch (error) {
         return res.status(500).json({message:`failed to save video ${error}`})
    }
}


    
export const getViews = async (req, res) =>{
    try {
        const {videoId} = req.params;
        const video = await Video.findByIdAndUpdate(videoId, {
            $inc : {views : 1}
        }, {new:true})

            if (!video) {
            return res.status(400).json({message: "Video is not found"})

        }
         return res.status(200).json(video)
    } catch (error) {
         return res.status(500).json({message:`Error adding view ${error}`})
    }
}

export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { message } = req.body;
        const userId = req.userId;

        const video = await Video.findById(videoId);
        if (!video) return res.status(400).json({ message: "Video not found" });

        video.comments.push({ author: userId, message });
        await video.save();

        const populatedVideo = await Video.findById(videoId)
            .populate({
                path: "comments.author", // ✅ corrected
                select: "userName photoUrl email"
            })
            .populate({
                path: "comments.replies.author",
                select: "userName photoUrl email"
            });

        return res.status(200).json(populatedVideo);
    } catch (error) {
        return res.status(500).json({ message: `Error adding comment: ${error}` });
    }
};

export const addReply = async (req, res) => {
    try {
        const { videoId, commentId } = req.params;
        const { message } = req.body;
        const userId = req.userId;

        const video = await Video.findById(videoId);
        if (!video) return res.status(400).json({ message: "Video not found" });

        const comment = video.comments.id(commentId);
        if (!comment) return res.status(400).json({ message: "Comment not found" });

        comment.replies.push({ author: userId, message });
        await video.save();

        const populatedVideo = await Video.findById(videoId)
            .populate({
                path: "comments.author",
                select: "userName photoUrl email"
            })
            .populate({
                path: "comments.replies.author",
                select: "userName photoUrl email"
            });

        return res.status(200).json(populatedVideo);
    } catch (error) {
        return res.status(500).json({ message: `Error adding reply: ${error}` });
    }
};


export const getLikedVideos = async (req, res)=> {
    try {
        const userId = req.userId;
        const likedVideo = await Video.find({likes: userId})
        .populate("channel", "name avatar")
        .populate("likes", "userName")
        if (!likedVideo) {
            return res.status(400).json({message:"Failed to get liked Video"})
        }
        res.status(200).json(likedVideo)
    } catch (error) {
             return res.status(500).json({ message: `Error to find liked Videos: ${error}` });
    }
}


export const getSavedVideos = async (req, res) => {
  try {
    const userId = req.userId;
    const savedVideos = await Video.find({ saveBy: userId })
      .populate("channel", "name avatar") // ✅ populate channel's name and avatar
      .populate({
        path: "comments",
        populate: {
          path: "author",  // make sure comments have author info
          select: "userName photoUrl"
        }
      })
      .populate("likes", "userName");

    res.status(200).json(savedVideos);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching saved videos: ${error}` });
  }
};




