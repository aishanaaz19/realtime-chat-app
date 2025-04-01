import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore = create((set) => ({
    message: [],
    users: [],
    selecteduser: null,
    isusersloading: false,
    ismessagesloading: false,


    getUsers: async () => {
        set({ isusersloading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ isusersloading: true });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isusersloading: false });
        }
    },

   getMessages: async(userId) => {
   },
   sendMessage: async (messageData) => {
    const { selecteduser, messages } = get();
       try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
         set({ messages: [...messages, res.data] });
     } catch (error) {
            toast.error(error.response.data.message);
     }
    },

    //todo:optimize this one later
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
    
    //     } finally{
    //         set({ ismessagesloading: false });
    //     }
    //     }
    }
))