import mongoose from "mongoose"

const replySchema = new mongoose.Schema({

      auuthor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
    },
    message: {
        type:String,
          required:true
    },
    createAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date
    }


},{_id:true})

const commentSchema = new mongoose.Schema({


    auuthor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
    },
    message: {
        type:String,
          required:true
    },
    replies:{
        replySchema
    },
    createAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date
    }



}, {_id:true})

const postSchema = new mongoose.Schema({

    channel: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Channel",
            required: true
    },
    content: {
        type:String,
        required:true
    },
    image:{
         type:String,
    },
    likes:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments: {
        commentSchema
    }



},{timestamps:true})

const Post = mongoose.Model("Post", postSchema)

export default Post