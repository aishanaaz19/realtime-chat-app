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
        bio: {
            type: String,
            default: "",
            maxlength: 100
        },
        friends: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }],
        lastActive: { 
            type: Date, 
            default: Date.now 
        },
        isOnline: { 
            type: Boolean, 
            default: false 
        },
        blockedUsers: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }],
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;