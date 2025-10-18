import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";



export const createVideo = async (req, res) => {
    try {
        const { title, description, tags, channelId} = req.body;
        if (!title || !req.files.video || !req.files.thumbnail || !channelId) {
            return res.status(400).json({message:"title, videoUrl, thumbnail, channelId is required"})
        }
        const channelDate = await Channel.findById(channelId)
        if (!channelDate) {
            return res.status(400).json({message:"Channel is not found by Id"})
        }
        const uploadVideo = await uploadOnCloudinary(req.files.video[0].path);
        const uploadThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path)

        let parsedTag = []
        if (tags) {
            try {
                parsedTag = JSON.parse(tags)
            
        } catch (error) {
            parsedTag = []
        }
        }

        const newVideo = await Video.create({
            title,
            channel:channelDate._id,
            description,
            tags: parsedTag,
            videoUrl:uploadVideo,
            thumbnail:uploadThumbnail
        })

        await Channel.findByIdAndUpdate(channelDate._id, 
            {$push: {videos : newVideo._id}},
            {new:true}
        )

        return res.status(201).json(newVideo)
      

    } catch (error) {
        return res.status(500).json({message:`Failed to create video ${error}`})
    }
}


export const getAllVideos = async (req,res) => {
    try {
        const videos = await Video.find().sort({createdAt : -1})
        if (!videos) {
            return res.status(400).json({message:"Videos are not found"})
        }
        return res.status(200).json(videos)
    } catch (error) {
        return res.status(500).json({message: `failed to get videos ${error}`})
    }
}