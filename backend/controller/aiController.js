// // backend/controller/aiController.js
// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";
// import Channel from "../model/channelModel.js";
// import Video from "../model/videoModel.js";
// import Short from "../model/shortModel.js";
// import Playlist from "../model/playlistModel.js";

// dotenv.config();

// export const searchWithAi = async (req, res) => {
//   try {
//     const { input } = req.body;
//     if (!input) {
//       return res.status(400).json({ message: "Search query is required" });
//     }

//     // Initialize Google GenAI client
//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });

//     // Prompt for generating keywords
//     const prompt = `
// You are a search assistant for a video streaming platform.
// The user query is: "${input}"
// Your job:
// - Correct typos.
// - Split into meaningful keywords.
// - Return only comma-separated keywords (no explanation).
// `;

//     // Generate keywords using AI
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     const keyword = (response.text || input).trim().replace(/[\n\r]+/g, "");

//     const searchWords = keyword
//       .split(",")
//       .map((w) => w.trim())
//       .filter(Boolean);

//     // Helper for MongoDB regex queries
//     const buildRegexQuery = (fields) => ({
//       $or: searchWords.map((word) => ({
//         $or: fields.map((field) => ({
//           [field]: { $regex: word, $options: "i" },
//         })),
//       })),
//     });

//     // === Search Channels ===
//     const matchedChannels = await Channel.find(buildRegexQuery(["name"])).select(
//       "_id name avatar"
//     );
//     const channelIds = matchedChannels.map((c) => c._id);

//     // === Search Videos ===
//     const videos = await Video.find({
//       $or: [
//         buildRegexQuery(["title", "description", "tags"]),
//         { channel: { $in: channelIds } },
//       ],
//     })
//       .populate("channel", "name avatar")
//       .populate("comments.author comments.replies.author");

//     // === Search Shorts ===
//     const shorts = await Short.find({
//       $or: [
//         buildRegexQuery(["title", "tags"]),
//         { channel: { $in: channelIds } },
//       ],
//     })
//       .populate("channel", "name avatar")
//       .populate("likes", "userName photoUrl");

//     // === Search Playlists ===
//     const playlists = await Playlist.find({
//       $or: [
//         buildRegexQuery(["title", "description"]),
//         { channel: { $in: channelIds } },
//       ],
//     })
//       .populate("channel", "name avatar")
//       .populate({
//         path: "videos",
//         populate: { path: "channel", select: "name avatar" },
//       });

//     // === Send Response ===
//     return res.status(200).json({
//       keyword,
//       channels: matchedChannels,
//       videos,
//       shorts,
//       playlists,
//     });
//   } catch (error) {
//     console.error("AI search error:", error);
//     return res.status(500).json({ message: `Failed to search: ${error.message}` });
//   }
// };


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

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are a search assistant for a video streaming platform.
The user query is: "${input}"
Your job:
- Correct typos.
- Split into meaningful keywords.
- Return only comma-separated keywords (no explanation).
`;

    // === AI request with retry logic ===
    const generateKeywords = async (retries = 2) => {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        const text = response.text?.trim();
        return text && text.length > 0 ? text : input;
      } catch (err) {
        if (err.status === 503 && retries > 0) {
          console.warn("Gemini overloaded, retrying in 2s...");
          await new Promise((res) => setTimeout(res, 2000));
          return generateKeywords(retries - 1);
        }
        console.error("AI error:", err.message);
        return input; // fallback to user input
      }
    };

    const keyword = (await generateKeywords()).replace(/[\n\r]+/g, "");
    const searchWords = keyword
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);

    // Helper function for MongoDB regex query
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

    // === Return Results ===
    return res.status(200).json({
      keyword,
      channels: matchedChannels,
      videos,
      shorts,
      playlists,
    });
  } catch (error) {
    console.error("AI search error:", error);
    return res
      .status(500)
      .json({ message: `Failed to search: ${error.message}` });
  }
};






export const filterCategoryWithAi = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const categories = [
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
    ];

    const prompt = `
You are a video content category classifier for a YouTube-like app.

User query: "${input}"

Choose the most relevant 1–3 categories from this list:
${categories.join(", ")}

Rules:
- Return only category names exactly as listed.
- Comma-separated if multiple.
- No explanations, no punctuation, no extra text.

Examples:
"arijit sing songs" -> Music
"pubg gameplay" -> Gaming
"netflix series" -> TV Shows
"latest nepal news" -> News
"funny cats" -> Comedy, Pets
"how to code in javascript" -> Education, Science & Tech

Now give only the category names:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // 🧹 Clean and format AI output
    const keywordText = response.text.trim();
    const cleanText = keywordText
      .replace(/[^a-zA-Z, ]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    let keywords = cleanText.split(",").map((k) => k.trim()).filter(Boolean);
    if (!keywords.length) keywords.push(input); // fallback

    console.log("🔍 AI predicted categories:", keywords);

    // 🔎 Build MongoDB search filters
    const videoConditions = [];
    const shortConditions = [];
    const channelConditions = [];

    keywords.forEach((kw) => {
      const regex = { $regex: kw, $options: "i" };

      videoConditions.push(
        { title: regex },
        { description: regex },
        { tags: regex },
        { category: regex }
      );

      shortConditions.push(
        { title: regex },
        { tags: regex },
        { description: regex },
        { category: regex }
      );

      channelConditions.push(
        { name: regex },
        { category: regex },
        { type: regex }, // ✅ channel type match
        { description: regex },
        { tags: regex }
      );
    });

    // 🧠 Fetch videos, shorts, and channels
    const videos = await Video.find({ $or: videoConditions })
      .populate("channel", "name avatar category type description")
      .populate("comments.author", "userName photoUrl")
      .populate("comments.replies.author", "userName photoUrl");

    const shorts = await Short.find({ $or: shortConditions })
      .populate("channel", "name avatar category type description")
      .populate("likes", "userName photoUrl");

    const channels = await Channel.find({ $or: channelConditions })
      .populate("owner", "userName photoUrl")
      .populate("subscribers", "userName photoUrl")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar category type" },
      })
      .populate({
        path: "shorts",
        populate: { path: "channel", select: "name avatar category type" },
      });

    // ✅ Send combined response
    return res.status(200).json({
      videos,
      shorts,
      channels,
      keywords,
    });
  } catch (error) {
    console.error("❌ Filter error:", error);
    return res
      .status(500)
      .json({ message: `Failed to filter: ${error.message}` });
  }
};
