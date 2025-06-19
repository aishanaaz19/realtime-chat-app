import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { encryptMessage, decryptMessage } from "../utils/encryption"; 

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
      const decryptedMessages = res.data.map(msg => ({
        ...msg,
        text: decryptMessage(msg.text) || "[Failed to decrypt]",
      }));

      set((state) => {
        const existingIds = new Set(state.messages.map(m => m._id));
        const newMessages = decryptedMessages.filter(msg => !existingIds.has(msg._id));
        return { messages: [...state.messages, ...newMessages] };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const socket = useAuthStore.getState().socket;
    const currentUser = useAuthStore.getState().authUser;

    try {
      const encryptedText = encryptMessage(messageData.text);
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        ...messageData,
        text: encryptedText,
      });

      // Decrypt message before adding to state (so UI can show it properly)
      const decryptedMessage = {
        ...res.data,
        text: decryptMessage(res.data.text),
      };

      set({ messages: [...messages, decryptedMessage] });

      if (socket && currentUser && selectedUser) {
        socket.emit("sendMessage", {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          message: res.data, // send encrypted over socket
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

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const currentUser = useAuthStore.getState().authUser;

    if (!socket || !currentUser) {
      console.log("Socket or user missing");
      return;
    }

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      console.log("🟢 New message received:", newMessage);

      const { selectedUser, messages } = get();
      const isCurrentChat =
        selectedUser &&
        ((selectedUser._id === newMessage.senderId && newMessage.receiverId === currentUser._id) ||
         (selectedUser._id === newMessage.receiverId && newMessage.senderId === currentUser._id));

      const decryptedMessage = {
        ...newMessage,
        text: decryptMessage(newMessage.text),
      };

      if (isCurrentChat) {
        const alreadyExists = messages.some((msg) => msg._id === newMessage._id);
        if (!alreadyExists) {
          set((state) => ({
            messages: [...state.messages, decryptedMessage],
          }));
        }
      }

      const isFromSomeoneElse = newMessage.senderId !== currentUser._id;
      const isToThisUser = newMessage.receiverId === currentUser._id;

      if (!isCurrentChat && isFromSomeoneElse && isToThisUser) {
        toast(`${newMessage.senderName || "Someone"} sent you a message 💬`);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
}));
