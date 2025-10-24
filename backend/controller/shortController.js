import Short from "../model/shortModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";



export const createShort = async (req, res) => {
    try {
        const {title, description, tags, channelId} = req.body;
        if (!title || !channelId) {
            return res.status(400).json({message:"Short title and channelId is required"})
        }
        let shortUrl
        if (req.file) {
            shortUrl = await uploadOnCloudinary(req.file.path)
        }

        const channelData = await Channel.findById(channelId)
        if (!channelData) {
            return res.status(400).json({message:"Channel is not found by  Id"})
        }
        const newShort = await Short.create({
            channel:channelData._id,
            title,
            description,
            shortUrl,
            tags:tags ? JSON.parse(tags) : []
        })
        await Channel.findByIdAndUpdate(channelData._id, {
            $push : {shorts : newShort._id}
        },{new:true})

        return res.status(201).json(newShort)

    } catch (error) {
        return res.status(500).json({message:`Failed to create short. ${error}`})
    }
}

export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find()
      .sort({ createdAt: -1 })
      .populate("channel")
      .populate("comments.author")
      .populate("comments.replies.author");

    if (!shorts || shorts.length === 0) {
      return res.status(400).json({ message: "Shorts not found" });
    }

    return res.status(200).json(shorts);
  } catch (error) {
    console.error("Error fetching shorts:", error);
    return res.status(500).json({ message: `Failed to get shorts: ${error.message}` });
  }
};



export const toggleLikes1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({message: "Short is not found"})

        }
        if (short.likes.includes(userId)) {
            short.likes.pull(userId)
        } else {
            short.likes.push(userId)
            short.dislikes.pull(userId)
        }

             await short.populate("comments.author", "userName photoUrl")
         await short.populate("channel")
         await short.populate("comments.replies.author", "userName photoUrl")
        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({message:`failed to like short ${error}`})
    }
}

export const toggleDisLikes1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({message: "Short is not found"})

        }
        if (short.dislikes.includes(userId)) {
            short.dislikes.pull(userId)
        } else {
            short.dislikes.push(userId)
        short.likes.pull(userId)
        }

              await short.populate("comments.author", "userName photoUrl")
         await short.populate("channel")
         await short.populate("comments.replies.author", "userName photoUrl")
        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({message:`failed to dislike short ${error}`})
    }
}

export const toggleSave1 = async (req, res) =>{
    try {
         const {shortId} = req.params;
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({message: "Short is not found"})

        }

         if (short.saveBy.includes(userId)) {
            short.saveBy.pull(userId)
        } else {
            short.saveBy.push(userId)
        }

             await short.populate("comments.author", "userName photoUrl")
         await short.populate("channel")
         await short.populate("comments.replies.author", "userName photoUrl")
        await short.save()
        return res.status(200).json(short)
    } catch (error) {
         return res.status(500).json({message:`failed to save short ${error}`})
    }
}

export const getViews1 = async (req, res) =>{
    try {
        const {shortId} = req.params;
        const short = await Short.findByIdAndUpdate(shortId, {
            $inc : {views : 1}
        }, {new:true})

            if (!short) {
            return res.status(400).json({message: "Short is not found"})

        }
              await short.populate("comments.author", "userName photoUrl")
         await short.populate("channel")
         await short.populate("comments.replies.author", "userName photoUrl")
         return res.status(200).json(short)
    } catch (error) {
         return res.status(500).json({message:`Error adding view ${error}`})
    }
}

export const addComment1 = async (req, res) => {
    try {
        const { shortId } = req.params;
        const { message } = req.body;
        const userId = req.userId;

        const short = await Short.findById(shortId);
        if (!short) return res.status(400).json({ message: "Short not found" });

        short.comments.push({ author: userId, message });
        
        await short.save();
         await short.populate("comments.author", "userName photoUrl")
         await short.populate("channel")
         await short.populate("comments.replies.author", "userName photoUrl")


        return res.status(200).json(short);
    } catch (error) {
        return res.status(500).json({ message: `Error adding comment: ${error}` });
    }
};

export const addReply1 = async (req, res) => {
    try {
        const { shortId, commentId } = req.params;
        const { message } = req.body;
        const userId = req.userId;

        const short = await Short.findById(shortId);
        if (!short) return res.status(400).json({ message: "Short not found" });

        const comment = short.comments.id(commentId);
        if (!comment) return res.status(400).json({ message: "Comment not found" });

        comment.replies.push({ author: userId, message });
        await short.save();

        await short.populate("comments.author", "userName photoUrl")
         await short.populate("channel")
         await short.populate("comments.replies.author", "userName photoUrl")

        return res.status(200).json(short);
    } catch (error) {
        return res.status(500).json({ message: `Error adding reply: ${error}` });
    }
};
