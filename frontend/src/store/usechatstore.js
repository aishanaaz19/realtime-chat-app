import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Get friends list
  getFriends: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await fetch("/api/users/friends", {
        credentials: "include",
      });
      const friends = await response.json();
      set({ users: friends });
    } catch (err) {
      console.error("Failed to load friends", err);
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get chat messages with selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      // Only add messages we don't already have
      set((state) => {
        const existingIds = new Set(state.messages.map(m => m._id));
        const newMessages = res.data.filter(msg => !existingIds.has(msg._id));
        return { messages: [...state.messages, ...newMessages] };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send message + emit via socket
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const socket = useAuthStore.getState().socket;
    const currentUser = useAuthStore.getState().authUser;

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // Update local state
      set({ messages: [...messages, res.data] });

      // Emit socket message to receiver
      if (socket && currentUser && selectedUser) {
        socket.emit("sendMessage", {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          message: res.data,
        });
      }
    } catch (error) {
      console.error("Error in sending message", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Failed to send message.";
      toast.error(errMsg);
    }
  },

  // Set the selected user and resubscribe
  setSelectedUser: (selectedUser) => {
    console.log("Setting selected user:", selectedUser); 
    set({ selectedUser });
  },

  blockUser: async (userId) => {
    try {
      const res = await axiosInstance.post('/users/block', { userId });
      const user = res.data.user;
      useAuthStore.getState().addToBlockedList(user);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  

  unblockUser: async (userId) => {
    try {
      const response = await axiosInstance.post('/users/unblock', { userId });
      set(state => ({
        users: [...state.users, response.data.user],
      }));
      useAuthStore.getState().removeFromBlockedList(userId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Listen for new messages in real-time
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const currentUser = useAuthStore.getState().authUser;
  
    if (!socket || !currentUser) {
      console.log("Socket or user missing");
      return;
    }
  
    // Remove previous listener before adding a new one
    socket.off("newMessage"); // prevent duplicate binding

    socket.on("newMessage", (newMessage) => {
      console.log("🟢 New message received:", newMessage);
    
      const { selectedUser, messages } = get();
      const currentUser = useAuthStore.getState().authUser;
    
      const isCurrentChat =
        selectedUser &&
        ((selectedUser._id === newMessage.senderId && newMessage.receiverId === currentUser._id) ||
         (selectedUser._id === newMessage.receiverId && newMessage.senderId === currentUser._id));
    
      // If message belongs to currently opened chat
      if (isCurrentChat) {
        const alreadyExists = messages.some((msg) => msg._id === newMessage._id);
        if (!alreadyExists) {
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
        }
      }
    
      // Show toast only if message is NOT in currently opened chat
      const isFromSomeoneElse = newMessage.senderId !== currentUser._id;
      const isToThisUser = newMessage.receiverId === currentUser._id;
    
      if (!isCurrentChat && isFromSomeoneElse && isToThisUser) {
        toast(`${newMessage.senderName || "Someone"} sent you a message 💬`);
      }
    });
    
    
  },
  
  // Unsubscribe from socket
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

}));

