import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

// ------------------ SIGN UP ------------------
export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    let photoUrl;

    // Upload image to Cloudinary if provided
    if (req.file) {
      photoUrl = await uploadOnCloudinary(req.file.path);
    }

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    // Validate email domain (example: only allow common domains)
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
    const emailDomain = email.split("@")[1];
    if (!allowedDomains.includes(emailDomain)) {
      return res.status(400).json({ success: false, message: "Email domain not allowed" });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@#$%^&*!)",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      photoUrl,
    });

    // Generate token
    const token = genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `signUp error: ${error.message}` });
  }
};

// ------------------ SIGN IN ------------------
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format on login
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ success: false, message: "Incorrect Password" });
    }

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Sign in successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `signIn error: ${error.message}` });
  }
};

// ------------------ SIGN OUT ------------------
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Sign out successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: `signOut error: ${error.message}` });
  }
};


export const googleAuth = async (req,res)=>{
  try {
    
    const {userName, email, photoUrl} = req.body;
    let googlePhoto = photoUrl

    if (photoUrl) {
      try {
        
        googlePhoto = await uploadOnCloudinary(photoUrl)

      } catch (error) {
        console.log("Cloudinary upload failed")
      }
    }
    const user = await User.findOne({email})
    if (!user) {
      await User.create({
        userName,
        email,
        photoUrl:googlePhoto
      })
    } else{
      if (!user.photoUrl && googlePhoto) {
        user.photoUrl = googlePhoto
        await user.save()
      }
    }

     // Generate token
    const token = genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
     return res.status(201).json(user)


  } catch (error) {
     return res.status(500).json({ success: false, message: `GoogleAuth error: ${error.message}` });
  }
}