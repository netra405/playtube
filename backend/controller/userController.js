import Channel from "../model/channelModel.js"
import User from "../model/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import Video from "../model/videoModel.js"
import Short from "../model/shortModel.js"




export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User is not found" })
    }
    return res.status(200).json(user)


  } catch (error) {
    res.status(500).json({ message: `getCurrentUser error ${error}` })
  }
}



export const createChannel = async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);
    console.log("🖼 FILES:", req.files);
    console.log("👤 USER ID:", req.userId);

    const { name, description, category } = req.body;
    const userId = req.userId;

    if (!name || !description || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingChannel = await Channel.findOne({ owner: userId });
    if (existingChannel) {
      return res
        .status(400)
        .json({ message: "User already has a channel." });
    }

    const nameExists = await Channel.findOne({ name });
    if (nameExists) {
      return res
        .status(400)
        .json({ message: "Channel name already taken." });
    }

    let avatar = "";
    let banner = "";

    if (req.files?.avatar?.[0]) {
      avatar = await uploadOnCloudinary(req.files.avatar[0].path);
    }
    if (req.files?.banner?.[0]) {
      banner = await uploadOnCloudinary(req.files.banner[0].path);
    }

    const channel = await Channel.create({
      name,
      description,
      category,
      avatar,
      banner,
      owner: userId
    });

    await User.findByIdAndUpdate(userId, {
      channel: channel._id,
      userName: name,
      photoUrl: avatar
    });

    return res.status(201).json({
      success: true,
      message: "Channel created successfully.",
      channel
    });
  } catch (error) {
    console.error("❌ Create Channel Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating channel.",
      error: error.message
    });
  }
};


export const updateChannel = async (req, res) => {
  try {

    const { name, description, category } = req.body;
    const userId = req.userId;
    const channel = await Channel.findOne({ owner: userId })
    if (!channel) {
      return res.status(404).json({ message: "Channel is not found." })
    }
    if (name && name !== channel.name) {

      const nameExists = await Channel.findOne({ name })
      if (nameExists) {
        return res.status(400).json({ message: "Channel name already taken" })
      }
      channel.name = name
    }

    if (description !== undefined) {
      channel.description = description
    }
    if (category !== undefined) {
      channel.category = category
    }

    if (req.files?.avatar) {
      const avatar = await uploadOnCloudinary(req.files.avatar[0].path)
      channel.avatar = avatar
    }
    if (req.files?.banner) {
      const banner = await uploadOnCloudinary(req.files.banner[0].path)
      channel.banner = banner
    }
    const uupdatedChannel = await channel.save()

    await User.findByIdAndUpdate(userId, {
      userName: name || undefined,
      photoUrl: channel.avatar || undefined
    }, { new: true })

    return res.status(200).json(updateChannel)


  } catch (error) {
    return res.status(500).json({ message: `Update channel error ${error}` })
  }
}



export const getChannelData = async (req, res) => {
  try {
    const userId = req.userId
    const channel = await Channel.findOne({ owner: userId }).populate("owner").populate("videos").populate("shorts")

    if (!channel) {
      return req.status(404).json({ message: "Channel is not found" })
    }

    return res.status(200).json(channel)
  } catch (error) {
    return res.status(500).json({ message: `Failed to get channel error ${error}` })
  }
}

export const toggleSubscribe = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.userId;

    if (!channelId) {
      return res.status(400).json({ message: "ChannelId is required" })
    }
    const channel = await Channel.findById(channelId)
    if (!channel) {
      return res.status(404).json({ message: "Channel is not found" })
    }
    const isSubscribed = channel?.subscribers?.includes(userId)

    if (isSubscribed) {
      channel?.subscribers.pull(userId)
    } else {
      channel?.subscribers.push(userId)
    }
    await channel.save()

    const updatedChannel = await Channel.findById(channelId).populate("owner").populate("videos").populate("shorts")
    return res.status(200).json(updatedChannel)
  } catch (error) {
    return res.status(500).json({ message: `Failed to toggleSubscribers ${error}` })
  }
}

export const getAllChannelData = async (req, res) => {
  try {
    console.log("📡 Fetching all channels...");

    const channels = await Channel.find()
      .populate("owner")
      .populate("videos")
      .populate("shorts")
      .populate("subscribers")
      .populate({
        path: "communityPosts",
        populate: [
          {
            path: "channel",
            model: "Channel",
          },
          {
            path: "comments.author",
            model: "User",
            select: "userName photoUrl",
          },
          {
            path: "comments.replies.author",
            model: "User",
            select: "userName photoUrl",
          },
        ],
      })
      .populate({
        path: "playlists",
        populate: {
          path: "videos",
          model: "Video",
          populate: {
            path: "channel",
            model: "Channel",
          },
        },
      });


    if (!channels || channels.length === 0) {
      return res.status(404).json({ message: "No channels found" });
    }

    return res.status(200).json(channels);
  } catch (error) {
    console.error("❌ Error fetching channels:", error);
    return res
      .status(500)
      .json({ message: `Failed to get all channels: ${error.message}` });
  }
};


export const getSubscribedData = async (req, res) => {
  try {
    const userId = req.userId;

    const subscribedChannels = await Channel.find({ subscribers: userId })
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
      })
      .populate({
        path: "shorts",
        populate: { path: "channel", select: "name avatar" },
      })
      .populate({
        path: "playlists",
        populate: [
          { path: "channel", select: "name avatar" },
          { path: "videos", populate: { path: "channel", select: "name avatar" } }
        ]
      })
      .populate({
        path: "communityPosts",
        populate: [
          { path: "channel", select: "name avatar" },
          { 
            path: "comments.author", // populates the author of each comment
            model: "User",
            select: "userName photoUrl email"
          },
          { 
            path: "comments.replies.author", // populates the author of each reply
            model: "User",
            select: "userName photoUrl email"
          }
        ]
      });

    if (!subscribedChannels || subscribedChannels.length === 0) {
      return res.status(404).json({ message: "No subscribed channels found" });
    }

    // Flatten all subscribed channel contents
    const videos = subscribedChannels.flatMap((ch) => ch.videos || []);
    const shorts = subscribedChannels.flatMap((ch) => ch.shorts || []);
    const playlists = subscribedChannels.flatMap((ch) => ch.playlists || []);
    const posts = subscribedChannels.flatMap((ch) => ch.communityPosts || []);

    return res.status(200).json({
      subscribedChannels,
      videos,
      shorts,
      playlists,
      posts,
    });
  } catch (error) {
    console.error("Error fetching subscribed data:", error);
    return res.status(500).json({
      message: `Server error while fetching subscribed content: ${error.message}`,
    });
  }
};

export const addHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { contentId, contentType } = req.body;

    // ✅ Fix spelling + correct contentType values
    if (!["Video", "Short"].includes(contentType)) {
      return res.status(400).json({ message: "Invalid contentType" });
    }

    let content;
    if (contentType === "Video") {
      content = await Video.findById(contentId);
    } else {
      content = await Short.findById(contentId);
    }

    if (!content) {
      return res.status(404).json({ message: `${contentType} not found` });
    }

    // Remove previous entry (if exists)
    await User.findByIdAndUpdate(userId, {
      $pull: { history: { contentId, contentType } },
    });

    // Add new one with timestamp
    await User.findByIdAndUpdate(userId, {
      $push: {
        history: { contentId, contentType, watchedAt: new Date() },
      },
    });

    res.status(200).json({ message: "Added to history" });
  } catch (error) {
    console.log("addHistory error:", error);
    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};


export const getHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate({
        path: "history.contentId",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      })
      .select("history");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sortedHistory = [...user.history].sort(
      (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
    );

    res.status(200).json(sortedHistory);
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
