import User from "../models/user.model.js";
import mongoose from "mongoose";

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
    const user = await User.findById(req.user._id).populate("friends", "username fullName profilePic bio isOnline lastActive")
    res.json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Failed to get friends" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const blockerId = req.user._id;

    await User.findByIdAndUpdate(blockerId, {
      $addToSet: { blockedUsers: userId }
    });
    await User.findByIdAndUpdate(blockerId, {
      $pull: { friends: userId }
    });

    const user = await User.findById(userId).select('_id fullName username profilePic');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Blocking failed' });
  }
};

export const blocked = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('blockedUsers', '_id fullName username profilePic');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.blockedUsers || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blocked users' });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const unblockerId = req.user._id;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // 1. Remove from blocked list
    const updatedUser = await User.findByIdAndUpdate(
      unblockerId,
      { $pull: { blockedUsers: userId } },
      { new: true }
    ).populate('blockedUsers', '_id fullName username profilePic');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Add back to friends list
    await User.findByIdAndUpdate(
      unblockerId,
      { $addToSet: { friends: userId } }
    );

    // 3. Get unblocked user details
    const unblockedUser = await User.findById(userId)
      .select('_id fullName username profilePic');

    res.status(200).json({
      success: true,
      user: unblockedUser,
      blockedUsers: updatedUser.blockedUsers // Return updated blocked list
    });
  } catch (error) {
    console.error('Unblock error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error unblocking user',
      error: error.message
    });
  }
};

export const blockStatus =  async (req, res) => {
  const selectedUserId = req.params.id;
  const currentUserId = req.user._id;
  const selectedUser = await User.findById(selectedUserId);
  const hasBlockedYou = selectedUser.blockedUsers.includes(currentUserId);
  res.json({ hasBlockedYou });
};

