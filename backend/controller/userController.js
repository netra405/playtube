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
export const updateChannel = async (req, res)=> {
    try {

          const {name, description, category} = req.body;
        const userId = req.userId;
        const channel = await Channel.findOne({owner:userId})
        if (!channel) {
            return res.status(404).json({message:"Channel is not found."})
        }
        if (name && name !== channel.name) {
        
            const nameExists = await Channel.findOne({name})
            if (nameExists) {
                return res.status(400).json({message:"Channel name already taken"})
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

         await User.findByIdAndUpdate(userId , {
            userName:name || undefined,
            photoUrl:channel.avatar || undefined
        }, {new:true})

        return res.status(200).json(updateChannel)

        
    } catch (error) {
         return res.status(500).json({message:`Update channel error ${error}`})
    }
}



export const getChannelData = async (req, res)=>{
    try {
        const userId = req.userId
        const channel = await Channel.findOne({owner:userId}).populate("owner")

        if (!channel) {
            return req.status(404).json({message:"Channel is not found"})
            }

            return res.status(200).json(channel)
    } catch (error) {
        return res.status(500).json({message:`Failed to get channel error ${error}`})
    }
}

