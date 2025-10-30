import express from "express"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import { addComment, addReply, createVideo, getAllVideos, getViews, toggleDisLikes, toggleLikes, toggleSave } from "../controller/videoController.js"
import { addComment1, addReply1, createShort, getAllShorts, getViews1, toggleDisLikes1, toggleLikes1, toggleSave1 } from "../controller/shortController.js"
import { createPlaylist, toggleSavePlaylist } from "../controller/playlistController.js"
import { addCommentForPost, addReplyForPost, CreatePost, getAllPosts, toggleLikesForPost } from "../controller/postController.js"


const contentRouter = express.Router()

contentRouter.post("/create-video", isAuth, upload.fields([
    {name:"video", maxCount:1},
    {name:"thumbnail", maxCount:1}
]), createVideo)
contentRouter.get("/getallvideos", isAuth, getAllVideos)
contentRouter.put("/video/:videoId/toggle-like", isAuth, toggleLikes)
contentRouter.put("/video/:videoId/toggle-dislike", isAuth, toggleDisLikes)
contentRouter.put("/video/:videoId/toggle-save", isAuth, toggleSave)
contentRouter.put("/video/:videoId/add-view", getViews)
contentRouter.post("/video/:videoId/add-comment", isAuth, addComment)
contentRouter.post("/video/:videoId/:commentId/add-reply", isAuth, addReply)



contentRouter.post("/create-short", isAuth, upload.single("shortUrl"), createShort)
contentRouter.get("/getallshorts", isAuth, getAllShorts)

contentRouter.put("/short/:shortId/toggle-like", isAuth, toggleLikes1)
contentRouter.put("/short/:shortId/toggle-dislike", isAuth, toggleDisLikes1)
contentRouter.put("/short/:shortId/toggle-save", isAuth, toggleSave1)
contentRouter.put("/short/:shortId/add-view", getViews1)
contentRouter.post("/short/:shortId/add-comment", isAuth, addComment1)
contentRouter.post("/short/:shortId/:commentId/add-reply", isAuth, addReply1)


contentRouter.post("/create-playlist", isAuth , createPlaylist)
contentRouter.post("/playlist/toggle-save", isAuth , toggleSavePlaylist)


contentRouter.post("/create-post", isAuth , upload.single("image"), CreatePost)
contentRouter.get("/getPosts", getAllPosts)
contentRouter.post("/post/toggle-like", isAuth , toggleLikesForPost)
contentRouter.post("/post/add-comment", isAuth, addCommentForPost);
contentRouter.post("/post/add-reply", isAuth , addReplyForPost)

export default contentRouter