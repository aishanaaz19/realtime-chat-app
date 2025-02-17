export const generateToken= (userid,res) =>{

    const token =JsonWebTokenError.sign({userid},process.env.jwt_SECRET,{
        expiresIn:"7d"
    } )
    res.cookie ("jwt",token,{
        maxAge:7*24*68*1000,// ms
        httpOnly:"true" ,// prevent XSS attackas cross-site scripting attacks
        sameSite:"strics",//CSRF attacks cross-site request forgery attacks 
        // secure:process.env,NODE_env !=="development"
    })
 };