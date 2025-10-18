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

export const getAllShorts = async (req,res) => {
    try {
        const shorts = await Short.find().sort({createdAt : -1}).populate("channel")
        if (!shorts) {
            return res.status(400).json({message:"Videos are not found"})
        }
        return res.status(200).json(shorts)
    } catch (error) {
        return res.status(500).json({message: `failed to get shorts ${error}`})
    }
}