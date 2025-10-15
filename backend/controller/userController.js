import Channel from "../model/channelModel.js"
import User from "../model/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"



export const getCurrentUser = async (req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(404).json({message:"User is not found"})
        }
        return res.status(200).json(user)


    } catch (error) {
        res.status(500).json({message:`getCurrentUser error ${error}`})
    }
}



export const createChannel = async (req, res) => {
     try {
        const {name, description, category} = req.body;
        const userId = req.userId;
        const existingChannel = await Channel.findOne({owner:userId})
        if (existingChannel) {
            return res.status(400).json({message:"User already  have a channel."})
        }
        const nameExists = await Channel.findOne({name})
        if (nameExists) {
            return res.status(400).json({message:"Channel name already taken"})
        }
        let avatar
        let banner
        if (req.files?.avatar) {
            avatar = await uploadOnCloudinary(req.files.avatar[0].path)
        }
        if (req.files?.banner) {
            banner = await uploadOnCloudinary(req.files.banner[0].path)
        }
        const channel = await Channel.create({
            name,
            description,
            category,
            avatar,
            banner,
            owner:userId
        })
        await User.findByIdAndUpdate(userId , {
            channel: channel._id,
            userName:name,
            photoUrl:avatar
        })

        return res.status(201).json(channel)
     } catch (error) {
        return res.status(500).json({message:`Create channel error ${error}`})
     }

}

