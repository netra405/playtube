import User from "../model/userModel.js";
import genToken from "../config/token.js";
import bcrypt from "bcryptjs";
import validator from "validator";

// ------------------ SIGN UP ------------------
export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    let photoUrl;

    if (req.file) {
      photoUrl = req.file.path; // optional: can use Cloudinary if you want
    }

    // Check if user exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@#$%^&*!)",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      photoUrl,
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ success: true, message: "User registered", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------ SIGN IN ------------------
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Sign in successful", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------ SIGN OUT ------------------
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Sign out successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------ GOOGLE AUTH ------------------
export const googleAuth = async (req, res) => {
  try {
    const { userName, email, photoUrl } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    let user = await User.findOne({ email });

    if (!user) {
      // New user
      user = await User.create({
        userName: userName || "Google User",
        email,
        photoUrl: photoUrl || null, // save actual Google photo
      });
    } else {
      // Update photo if changed
      if (photoUrl && user.photoUrl !== photoUrl) {
        user.photoUrl = photoUrl;
        await user.save();
      }
    }

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Google auth successful", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
