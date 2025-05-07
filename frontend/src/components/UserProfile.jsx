import { X, Clock, Check, MessageSquare, Ban } from "lucide-react";
import { useChatStore } from "@/store/usechatstore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UserProfileModal = ({ user, isOpen, onClose }) => {
  const { setSelectedUser, blockUser } = useChatStore();
  const navigate = useNavigate();
  
  // Simplified online check - only show "Online" if status is explicitly 'online'
  const isOnline = user.status === 'online';

  const handleMessageClick = () => {
    setSelectedUser(user);
    onClose();
    navigate('/');
  };

  const handleBlockUser = async () => {
    if (window.confirm(`Block ${user.fullName}? They won't be able to message you.`)) {
      try {
        await blockUser(user._id);
        toast.success(`${user.fullName} has been blocked`);
        onClose();
        navigate('/'); // Redirect to home or chats page
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to block user");
        console.error("Blocking error:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 -mt-16">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md"
              />
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-800">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              {user.fullName}
            </h2>
            <p className="text-indigo-600 dark:text-indigo-400">
              @{user.username}
            </p>
            
            {/* Activity Status */}
            <div className={`mt-2 flex items-center gap-1 px-3 py-1 rounded-full ${
              isOnline 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-500 animate-pulse' : 'bg-green-500 animate-pulse'
              }`}></div>
              <span className="text-sm">
                {isOnline ? 'Online' : 'Online'}
              </span>
            </div>

            <p className="mt-3 text-gray-500 dark:text-gray-300 text-center max-w-xs">
              {user.bio || "Hey there! I'm using chatsphere."}
            </p>
          </div>

          {/* Show Last Seen only if offline */}
          {!isOnline && (
            <div className="mt-6 flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm">
                Last seen: Just now
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button 
              onClick={handleMessageClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Message</span>
            </button>
            <button 
              onClick={handleBlockUser}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Ban className="w-5 h-5" />
              <span>Block</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;