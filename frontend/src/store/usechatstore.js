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

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
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

  subscribeToMessages: () => {
    const { selectedUser } = get();  // Get selectedUser from state
    const socket = useAuthStore.getState().socket;
    const currentUser = useAuthStore.getState().user;

    console.log("Selected User:", selectedUser);  // Debugging: Check selectedUser
    console.log("Socket:", socket);  // Debugging: Check socket
    console.log("Current User:", currentUser);  // Debugging: Check currentUser

    if (!socket || !currentUser || !selectedUser) {
      console.log("Missing socket, currentUser, or selectedUser.");
      return;  // Return early if any of the variables are missing
    }

    socket.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage);  // Log the new message

      const isFromSelectedUser = selectedUser?._id === newMessage.senderId;
      const isFromSelf = newMessage.senderId === currentUser._id;

      if (!isFromSelf && !isFromSelectedUser) {
        toast(`${newMessage.senderName || "Someone"} sent you a message 💬`);
      }

      // If the message is from the current chat, update messages
      if (isFromSelectedUser) {
        set((state) => ({
          messages: [...state.messages, newMessage],  // Always use latest state
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Set the selected user
  setSelectedUser: (selectedUser) => {
    console.log("Setting selected user:", selectedUser); // Debugging
    set({ selectedUser });

    // Ensure socket and selectedUser are available before subscribing
    const socket = useAuthStore.getState().socket;
    if (selectedUser && socket) {
      get().subscribeToMessages();  // Subscribe when both are available
    } else {
      console.log("Socket or selected user is missing. Can't subscribe.");
    }
  },
}));
