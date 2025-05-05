import {generateToken} from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup= async (req,res) => {
    const{ username,fullName,email,password }= req.body;  
     try {
         if(!username || !fullName || !email || !password){
             return res.status(400).json({message:"All fields are required"});
         }
         if (password.length<6){
             return res.status(400).json({message:"Password must be at lest 6 character"});
         }
         const existingUsername = await User.findOne({ username });
            if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }
         const user =await User.findOne({email}); 
         if(user) {
             return res.status(400).json({message:"Email already exists"});
         }  
         const salt= await bcrypt.genSalt(10);
         const hashedPassword= await bcrypt.hash(password,salt); 
         const newUser= new User({
             username,
             fullName,
             email,
             password:hashedPassword,
         });
         if(newUser){
            generateToken(newUser._id,res)
            await newUser.save();    
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,     
            });     
         } else {
             res.status(400).json({message:"invalid user data"});  
         } 
     }
     catch (error) {
         console.log("Error in signup controller", error.messege);
         res.status(500).json({message:"Internal server Error"});
     }
 };

export const login = async (req, res) => {
    const {username, password} = req.body
    try{
        const user = await User.findOne ({username})
        if (!user) {
            return res.status(400).json({message:"Invalid Credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({message:"Invalid Credentials"})
        }
        generateToken(user._id, res)
        res.status(200).json({
            _id:user._id,
            username: user.username,
            fullname: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Interval Server Error"});  
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"});
    }
    catch (error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Interval Server Error"}); 
    }
}

export const updateProfile = async (req,res) => {
    try {
        const {profilePic} = req.body;
        req.user._id
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log('Error in updating profile', error);
        res.status(500).json({ message: "Internal server error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const simpleForgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found with this email." });
      }  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();  
      res.json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Forgot Password Error:", error.message);
      res.status(500).json({ error: "Something went wrong." });
    }
  };