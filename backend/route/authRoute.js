import express from "express";
import upload from "../middleware/multer.js";
import { signUp, signIn, signOut, googleAuth, sendOtp, verifyOtp, resetPassword } from "../controller/authController.js";

const router = express.Router();

// Regular signup with optional photo upload
router.post("/signup", upload.single("photoUrl"), signUp);

// Email/password login
router.post("/signin", signIn);

// Sign out
router.get("/signout", signOut);

// Google authentication (no multer because Google sends URL, not file)
router.post("/googleauth", googleAuth);
router.post("/sendotp",sendOtp)
router.post("/verifyotp", verifyOtp)
router.post("/resetpassword", resetPassword)

export default router;
