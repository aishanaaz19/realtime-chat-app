
import {generateToken} from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup= async (req,res) => {
   const{fullname,email,password}=req.body ;
   
    try {

        if(!fullName|| !email || !password){
            return res.status(400).json[{message:"all fields are required"}];
        }
        if (password.length<6){
            return res.status(400).json[{message:"password must be at lest 6 character"}];
        }

        const user =await user.findOne ({email})

        if(user) {
            return res.status(400).json({message:"Email already exists"});
        } 

        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt);

        const newUser= new User({
            fullName,
            email,
            password:hashedPassword,
        });
        if(newUser){
            //generate jwt token here 
    
        generateToken(newUser._id,res)
        await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser,fullNme,
            email: newUser.email,
            profilePic: newUser.profilePic, 

        });
    
        } else{
            res.status(400).json({message:"invalid user data"});  
        } 
    }
    catch (error) {
        console.log("Error in signup controller",error.messege);
        res.status(500).json({message:"Internal server Error "});
    }
};

export const login =(req, res)=>{
    res.send ("login route");
};
export const logout=(req, res) =>{
    res.send("logout route");
};