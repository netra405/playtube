import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"


export const SignUp = async (req, res)=>{
    try {
        
        const { userName , email , password } = req.body
        let photoUrl
        if (req.file) {
            photoUrl = await uploadOnCloudinary(req.file.path)
        }
        const existUser = await User.findOne({email})
        if (existUser) {
            return res.status(400).json({message:"User is already exist"})
        }
        if(!validator.isEmail(email)){
              return res.status(400).json({message:"Invalid Email"})
        }
        if (password.length < 8) {
              return res.status(400).json({message:"Enter Strong Password"})
        }
        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            userName,
            email,
            password:hashPassword,
            photoUrl
        })
        let token = await genToken(user._id)

        res.cookie("token", token{
            httpOnly:true,
            secure: false,
            samesite:"Strict",
            maxAge:7 * 24 * 60 * 60 * 1000 
        })
        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message:`singUp error ${error}`})
    }
}

export const signIn = async (req,res)=>{
    try {
         const { email , password } = req.body
         const user = await User.findOne({email})
         if (!user) {
            return res.status(400).json({message: "User is not Found"})
         }
         const matchPassword = await bcrypt.compare(password, user.password)
         if (!matchPassword) {
            return res.status(400).json({message:"Incorrect Password"})
         }

        let token = await genToken(user._id)

        res.cookie("token", token{
            httpOnly:true,
            secure: false,
            samesite:"Strict",
            maxAge:7 * 24 * 60 * 60 * 1000 
        })
        return res.status(200).json(user)



    } catch (error) {
         return res.status(500).json({message:`singIn error ${error}`})
    }
}

export const signOut = async (req,res)=>{
    try {
        
        await res.clearCookie("token")
        return res.status(200).json({message:"SignOut Successfully"})

    } catch (error) {
        return res.status(500).json({message:`singOut error ${error}`})
    }
}