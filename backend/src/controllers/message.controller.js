import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// GET all messages between logged-in user and the selected user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Sorted by oldest to newest
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// SEND a new message with optional media
export const sendMessage = async (req, res) => {
  try {
    const { text, image, video, document } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl = null;
    let videoUrl = null;
    let documentUrl = null;
    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        resource_type: "image",
      });
      imageUrl = uploaded.secure_url;
    }
    if (video) {
      const uploaded = await cloudinary.uploader.upload(video, {
        resource_type: "video",
      });
      videoUrl = uploaded.secure_url;
    }
    if (document) {
      const uploaded = await cloudinary.uploader.upload(document, {
        resource_type: "raw",
      });
      documentUrl = uploaded.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
      document: documentUrl,
    });
    const populatedMessage = {
      ...newMessage._doc,
      senderName: req.user.fullName || req.user.username || "Someone",
    };
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
