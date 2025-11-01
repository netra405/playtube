// backend/controller/aiController.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";
import Short from "../model/shortModel.js";
import Playlist from "../model/playlistModel.js";

dotenv.config();

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Initialize Google GenAI client
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Prompt for generating keywords
    const prompt = `
You are a search assistant for a video streaming platform.
The user query is: "${input}"
Your job:
- Correct typos.
- Split into meaningful keywords.
- Return only comma-separated keywords (no explanation).
`;

    // Generate keywords using AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const keyword = (response.text || input).trim().replace(/[\n\r]+/g, "");

    const searchWords = keyword
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);

    // Helper for MongoDB regex queries
    const buildRegexQuery = (fields) => ({
      $or: searchWords.map((word) => ({
        $or: fields.map((field) => ({
          [field]: { $regex: word, $options: "i" },
        })),
      })),
    });

    // === Search Channels ===
    const matchedChannels = await Channel.find(buildRegexQuery(["name"])).select(
      "_id name avatar"
    );
    const channelIds = matchedChannels.map((c) => c._id);

    // === Search Videos ===
    const videos = await Video.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate("comments.author comments.replies.author");

    // === Search Shorts ===
    const shorts = await Short.find({
      $or: [
        buildRegexQuery(["title", "tags"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate("likes", "userName photoUrl");

    // === Search Playlists ===
    const playlists = await Playlist.find({
      $or: [
        buildRegexQuery(["title", "description"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
      });

    // === Send Response ===
    return res.status(200).json({
      keyword,
      channels: matchedChannels,
      videos,
      shorts,
      playlists,
    });
  } catch (error) {
    console.error("AI search error:", error);
    return res.status(500).json({ message: `Failed to search: ${error.message}` });
  }
};
