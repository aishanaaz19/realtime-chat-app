import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            unique: true, 
            required: true 
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
        friends: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }]
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;