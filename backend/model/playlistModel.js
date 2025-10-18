import mongoose from "mongoose"


const playlistSchema = new mongoose.Schema({

    channel: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Channel",
            required: true
    },
    title: {
        type:String,
        required:true
    },
    description: {
        type: String,
        default: ""
    },
    saveBy:[
            { 
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
    ],
     videos:[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Video"
        }],

},{timestamps:true})

const Playlist = mongoose.model("Playlist", playlistSchema)

export default Playlist