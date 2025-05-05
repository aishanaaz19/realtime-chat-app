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
    console.log("Setting selected user:", selectedUser); // Debugging
    set({ selectedUser });

    const trySubscribe = (attempts = 5) => {
      const socket = useAuthStore.getState().socket;
      const user = useAuthStore.getState().authUser;

      if (selectedUser && socket && user) {
        get().subscribeToMessages(); // Proceed to subscribe
      } else if (attempts > 0) {
        console.log("Retrying subscribe in 200ms...");
        setTimeout(() => trySubscribe(attempts - 1), 200); // Retry subscription
      } else {
        console.error("Socket or user still missing after retries");
      }
    };

    trySubscribe(); // Initial subscription attempt
  },

  // Listen for new messages in real-time
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const currentUser = useAuthStore.getState().authUser;
  
    if (!socket || !currentUser) {
      console.log("Socket or user missing");
      return;
    }
  
    // Clean up previous listener to avoid duplicates
    socket.off("newMessage");
  
    socket.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage);
      const { selectedUser, messages } = get();
  
      // Only add the message if it's not already in the state
      if (!messages.some((msg) => msg._id === newMessage._id)) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
  
      // Show toast only if not from current chat and not from self
      const isFromSelectedUser = selectedUser?._id === newMessage.senderId;
      const isFromSelf = newMessage.senderId === currentUser._id;
  
      if (!isFromSelf && !isFromSelectedUser) {
        toast(`${newMessage.senderName || "Someone"} sent you a message 💬`);
      }
    });
  },
  

  // Unsubscribe from socket
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  // Clean up socket and state
  cleanup: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
    set({ messages: [], selectedUser: null });
  },
}));

