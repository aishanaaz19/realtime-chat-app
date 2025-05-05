import jwt from "jsonwebtoken";

export const generateToken= (userId,res) =>{
    const token =jwt.sign({userId},process.env.jwt_SECRET,{
        expiresIn:"7d"
    } )
    res.cookie ("jwt",token,{
        maxAge:7*24*68*1000,// ms
        httpOnly:true ,// prevent XSS attackas cross-site scripting attacks
        sameSite:"strict",//CSRF attacks cross-site request forgery attacks 
        secure: process.env.NODE_ENV !=="development",
    });

    return token;
 };