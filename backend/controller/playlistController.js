import Channel from "../model/channelModel.js";
import Playlist from "../model/playlistModel.js";
import Video from "../model/videoModel.js";

// ---------------- CREATE PLAYLIST ----------------
export const createPlaylist = async (req, res) => {
  try {
    const { title, description, channelId, videoIds = [] } = req.body;

    if (!title || !channelId) {
      return res
        .status(400)
        .json({ message: "To create a playlist, title and channelId are required." });
    }

    // Check if channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    // Find videos that belong to the same channel
    const videos = await Video.find({
      _id: { $in: videoIds },
      channel: channelId,
    });

    // ❌ FIX: Your original check had `if (!videos.length !== videoIds.length)`
    // which was always true. This is the correct way:
    if (videos.length !== videoIds.length) {
      return res
        .status(400)
        .json({ message: "Some videos are not found or do not belong to the channel." });
    }

    // Create playlist
    const playlist = await Playlist.create({
      title,
      description,
      channel: channelId,
      videos: videoIds,
    });

    // Push playlist into the channel
    await Channel.findByIdAndUpdate(channelId, {
      $push: { playlists: playlist._id },
    });

    return res.status(201).json(playlist);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to create playlist: ${error.message}` });
  }
};

// ---------------- TOGGLE SAVE PLAYLIST ----------------
export const toggleSavePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.userId;

    if (!playlistId || !userId) {
      return res.status(400).json({ message: "playlistId and userId are required." });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    if (playlist.saveBy.includes(userId)) {
      playlist.saveBy.pull(userId); // unsave
    } else {
      playlist.saveBy.push(userId); // save
    }

    await playlist.save();

    return res.status(200).json({
      message: "Playlist save state updated.",
      saveBy: playlist.saveBy, // important for frontend state
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


export const getSavedPlaylist = async (req, res)=> {
 try {
    const userId = req.userId;
    const savedPlaylist = await Playlist.find({ saveBy: userId })
    .populate("videos")
    .populate({
      path: "videos",
      populate: {path: "channel"}
    })
    

    res.status(200).json(savedPlaylist);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching saved shorts: ${error}` });
  }
}