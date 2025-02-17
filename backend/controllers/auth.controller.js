
import {generateToken} from "../lib/utils.js";
import User from "../models/user.modal.js";
import bcrypt from "bcryptjs";


export const signup= async (req,res) => {
   const{fullname,email,password}=req.body ;
   
    try {

        if(!fullName|| !email || !password){
            return res.status(400).json[{message:"all fields are required"}];
        }
        if (password.length<6){
            return res.stetus(400).json[{message:"password must be at lest 6 character"}];
        }

        const user =await user.findOne ({email})

        if(user) {
            return res.status(400).json({message:"Email already exists"});
        } 

        const salt= await bcrypt.genSalt(10)
        const hashedpassword= await bcrypt.hash(password,salt);

        const newUser= new user({
            fullName,
            email,
            password:hashedpassword,
        });
        if(newUser){
            //generate jwt token here 
    
        generateToken(newUser._id,res)
        await newUser.save();

        res.stetus(201).json({
            _id:newUser._id,
            fullName:newUser,fullNme,
            email: newUser.email,
            profilePic: newUser.profilePic, 

        });
    
        } else{
            res.stetus(400).json({message:"invalid user data"});  
        } 
    }
    catch (error) {
        console.log("Error in signup controller",error.messege);
        res.stetus(500).json({message:"Internal server Error "});
    }
};

export const login =(req, res)=>{
    res,send ("logout route");
};
export const logout=(req, res) =>{
    res,send("logout route");
};