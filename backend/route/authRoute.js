import express from "express"
import upload from "../middleware/multer.js"
import { googleAuth, signIn, signOut, signUp } from "../controller/authController.js";

const authRouter = express.Router()

authRouter.post("/signup", upload.single("photoUrl"), signUp)
authRouter.post("/signin",  signIn)
authRouter.get("/signout",  signOut)
authRouter.post("/googleauth", upload.single("photoUrl", googleAuth))

export default authRouter