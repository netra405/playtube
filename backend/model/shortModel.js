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

const shortSchema = new mongoose.Schema({

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
    shortUrl: {
         type: String,
        default: ""
    },
    tags: [{
        type: String
    }],

    views:{
        type:Number,
        default: 0
    },
    likes:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    dislikes:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    saveBy:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments: {
        commentSchema
    }



},{timestamps:true})

const Short = mongoose.model("Short", shortSchema)

export default Short