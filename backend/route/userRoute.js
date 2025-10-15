import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createChannel, getCurrentUser } from "../controller/userController.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()

userRouter.get("/getuser",isAuth,getCurrentUser)
userRouter.post("/createChannel", isAuth, upload.fields([
   { name: "avatar", maxCount: 1},
    {name: "banner", maxCount: 1}

]) , createChannel)

export default userRouter