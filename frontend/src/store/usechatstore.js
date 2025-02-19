import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const usechatstore = creat((set) => ({
    message: [],
    users: []
    selecteduser: null,
    isusersloading: false,
    ismessagesloading: false,


    getuser: async () => {
        set({ isusersloading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ isusersloading: true });
        } catch (error) {
            toast.error(error.rsponse.data.message);
        } finally {
            set({ isusersloading: false });
        }
    },

    getmessages: async(userId) => {
        set({ ismessagesloading: true });
        try {
            const res = await axiosInstance.get('/messages/${userId}');
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
    
        } finally{
            set({ ismessagesloading: false });
        }
        }
    }
))