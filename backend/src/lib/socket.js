import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js"; 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"]
  },
});

const userSocketMap = {}; 

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    // Add user to socket map and mark as online
    userSocketMap[userId] = socket.id;
    socket.join(userId);
    
    // Update user status in database
    User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastActive: new Date()
    }).catch(err => console.error("Status update error:", err));
    
    // Notify all clients about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Message handling
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId,
        ...message,
      });
    }
    
    // Update lastActive for both users
    const updatePromises = [
      User.findByIdAndUpdate(senderId, { lastActive: new Date() }),
      User.findByIdAndUpdate(receiverId, { lastActive: new Date() })
    ];
    
    Promise.all(updatePromises)
      .catch(err => console.error("Activity update error:", err));
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    
    if (userId) {
      // Remove from socket map
      delete userSocketMap[userId];
      
      // Update user status in database
      User.findByIdAndUpdate(userId, {
        isOnline: false
      }).catch(err => console.error("Status update error:", err));
      
      // Notify all clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };