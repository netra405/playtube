// import User from "../model/userModel.js";
// import genToken from "../config/token.js";
// import bcrypt from "bcryptjs";
// import validator from "validator";
// import sendMail from "../config/sendMail.js";

// // ------------------ SIGN UP ------------------
// export const signUp = async (req, res) => {
//   try {
//     const { userName, email, password } = req.body;
//     let photoUrl;

//     if (req.file) {
//       photoUrl = req.file.path; // optional: can use Cloudinary if you want
//     }

//     // Check if user exists
//     const existUser = await User.findOne({ email });
//     if (existUser) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Invalid Email" });
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@#$%^&*!)",
//       });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       userName,
//       email,
//       password: hashPassword,
//       photoUrl,
//     });

//     const token = genToken(user._id);

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(201).json({ success: true, message: "User registered", user });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ------------------ SIGN IN ------------------
// export const signIn = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const matchPassword = await bcrypt.compare(password, user.password);
//     if (!matchPassword) return res.status(400).json({ success: false, message: "Incorrect password" });

//     const token = genToken(user._id);
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({ success: true, message: "Sign in successful", user });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ------------------ SIGN OUT ------------------
// export const signOut = async (req, res) => {
//   try {
//     res.clearCookie("token");
//     return res.status(200).json({ success: true, message: "Sign out successful" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ------------------ GOOGLE AUTH ------------------
// export const googleAuth = async (req, res) => {
//   try {
//     const { userName, email, photoUrl } = req.body;

//     if (!email) return res.status(400).json({ success: false, message: "Email required" });

//     let user = await User.findOne({ email });

//     if (!user) {
//       // New user
//       user = await User.create({
//         userName: userName || "Google User",
//         email,
//         photoUrl: photoUrl || null, // save actual Google photo
//       });
//     } else {
//       // Update photo if changed
//       if (photoUrl && user.photoUrl !== photoUrl) {
//         user.photoUrl = photoUrl;
//         await user.save();
//       }
//     }

//     const token = genToken(user._id);

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({ success: true, message: "Google auth successful", user });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email })
//     if (!user) {
//       res.status(404).json({ success: false, message: "User not found" });
//     }

//     const otp = Math.floor(1000 + Math.random() * 9000).toString()
//     user.resetOtp = otp,
//       user.otpExpires = Date.now() + 5 * 60 * 1000,
//       user.isOtpVerifed = false

//     await user.save()

//     await sendMail(email, otp)
//     return res.status(200).json({ message: "OTP send successfully" })

//   } catch (error) {
//     return res.status(500).json({ message: `Otp send error ${error}` })
//   }
// }

// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const user = await User.findOne({ email })
//     if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "Invalid Otp" })
//     }

//     user.resetOtp = undefined,
//       user.otpExpires = undefined,
//       user.isOtpVerifed = true

//       await user.save()
//        return res.status(200).json({ message: "OTP verified successfully" })
//   } catch (error) {
//        return res.status(500).json({ message: `Otp verification error ${error}` })
//   }
// }

// export const resetPassword = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({email})

//     if (!user || !user.isOtpVerifed) {
//       return res.status(400).json({message:"Otp verification required"})
//     }
//     const hashPassword = await bcrypt.hash(password,10)
//     user.password = hashPassword,
//     user.isOtpVerifed = false
//     await user.save()

//       return res.status(200).json({ message: "Password reset successfully" })
//   } catch (error) {
//      return res.status(500).json({ message: `Password reset error ${error}` })
//   }
// }





import User from "../model/userModel.js";
import genToken from "../config/token.js"
import bcrypt from "bcryptjs";
import validator from "validator";
import sendMail from "../config/sendMail.js";

// ------------------ SIGN UP ------------------
export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const photoUrl = req.file ? `/public/${req.file.filename}` : "";

    // Check if user exists
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ success: false, message: "User already exists" });

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Invalid Email" });

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@#$%^&*!)",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ userName, email, password: hashPassword, photoUrl });
    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ success: true, message: "User registered", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Sign in successful", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------ SIGN OUT ------------------
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Sign out successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// -------google auth
export const googleAuth = async (req, res) => {
  try {
    const { userName, email, photoUrl } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new Google user properly using `new User()` and save
      user = new User({
        userName: userName || "Google User",
        email,
        photoUrl: photoUrl || "",
      });
      await user.save(); // <-- Important! Must await save()
      console.log("🟢 New Google user created:", user);
    } else {
      // Update photo if changed
      if (photoUrl && user.photoUrl !== photoUrl) {
        user.photoUrl = photoUrl;
        await user.save();
        console.log("🟡 Existing user's photo updated");
      }
    }

    // Generate JWT token
    const token = genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google auth successful",
      user,
    });
  } catch (error) {
    console.error("❌ Google Auth Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ------------------ SEND OTP ------------------
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerifed = false;

    await user.save();
    await sendMail(email, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `OTP send error: ${error.message}` });
  }
};

// ------------------ VERIFY OTP ------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.resetOtp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerifed = true;
    await user.save();

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `OTP verification error: ${error.message}` });
  }
};

// ------------------ RESET PASSWORD ------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerifed) return res.status(400).json({ success: false, message: "OTP verification required" });

    user.password = await bcrypt.hash(password, 10);
    user.isOtpVerifed = false;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `Password reset error: ${error.message}` });
  }
};
