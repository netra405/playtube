import express from "express"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import { createVideo, getAllVideos } from "../controller/videoController.js"
import { createShort, getAllShorts } from "../controller/shortController.js"

const contentRouter = express.Router()

contentRouter.post("/create-video", isAuth, upload.fields([
    {name:"video", maxCount:1},
    {name:"thumbnail", maxCount:1}
]), createVideo)
contentRouter.get("/getallvideos", isAuth, getAllVideos)


contentRouter.post("/create-short", isAuth, upload.single("shortUrl"), createShort)
contentRouter.get("/getallshorts", isAuth, getAllShorts)

export default contentRouter