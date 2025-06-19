import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  blockedUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  addToBlockedList: (userId) => set((state) => {
    const currentBlocked = Array.isArray(state.authUser.blockedUsers) 
      ? state.authUser.blockedUsers 
      : [];
      
    return {
      authUser: {
        ...state.authUser,
        blockedUsers: [...currentBlocked, userId]
      }
    };
  }),

  unblockUser: async (userId) => {
    try {
      await axiosInstance.post('/users/unblock', { userId });
      set(state => ({
        authUser: {
          ...state.authUser,
          blockedUsers: state.authUser.blockedUsers.filter(id => id !== userId)
        }
      }));
    } catch (error) {
      throw error;
    }
  },
  
  removeFromBlockedList: (userId) => {
    set(state => ({
      authUser: {
        ...state.authUser,
        blockedUsers: state.authUser.blockedUsers.filter(user => {
          if (typeof user === "object" && user._id) {
            return user._id !== userId;
          }
          return user !== userId;
        }),
      }
    }));
  },

  connectSocket: () => {
  const { authUser, socket } = get();
  
  // Return early if user is not authenticated or if socket is already connected
  if (!authUser || (socket && socket.connected)) return;

  // Establish socket connection
  const newSocket = io(BASE_URL, {
    query: {
      userId: authUser._id,
    },
  });

  // Once the socket is connected, set it to the store
  newSocket.on("connect", () => {
    console.log("Socket connected:", newSocket.id);
    set({ socket: newSocket });
  });

  // Listen for online users
  newSocket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });

  // Handle any connection errors
  newSocket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });
},

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
},

}));