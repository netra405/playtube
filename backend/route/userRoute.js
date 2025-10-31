import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createChannel, getAllChannelData, getChannelData, getCurrentUser, getSubscribedData, toggleSubscribe, updateChannel } from "../controller/userController.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()

userRouter.get("/getuser",isAuth,getCurrentUser)
userRouter.post("/createchannel", isAuth, upload.fields([
   { name: "avatar", maxCount: 1},
    {name: "banner", maxCount: 1}

]) , createChannel)
userRouter.get("/getchannel", isAuth, getChannelData)
userRouter.post("/updatechannel", isAuth, upload.fields([
   { name: "avatar", maxCount: 1},
    {name: "banner", maxCount: 1}

]) , updateChannel)
userRouter.get("/allchannel", isAuth , getAllChannelData)
userRouter.post("/togglesubscribe", isAuth, toggleSubscribe)
userRouter.get("/subscribed-data", isAuth, getSubscribedData)

export default userRouter