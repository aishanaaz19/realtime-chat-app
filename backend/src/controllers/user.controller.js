import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const searchUserByUsername = async (req, res) => {
  const { username } = req.query; // Extract the username query parameter
  try {
    if (!username) {
      return res.status(400).json({ message: "Username query parameter is required." });
    }
    const user = await User.findOne({ 
      username: new RegExp(username, "i")
    }).select("username fullName profilePic _id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return the user details if found
    res.json(user);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addFriend = async (req, res) => {
  const userId = req.user._id; // Get from auth middleware
  const { friendId } = req.body;
  if (!friendId || friendId === userId) {
    return res.status(400).json({ message: "Invalid friend ID" });
  }
  try {
    const user = await User.findById(userId);
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }
    user.friends.push(friendId);
    await user.save();
    res.status(200).json({ message: "Friend added!" });
  } catch (err) {
    console.error("Add friend error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "username fullName profilePic");
    res.json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Failed to get friends" });
  }
};


