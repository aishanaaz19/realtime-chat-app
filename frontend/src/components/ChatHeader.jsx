import { useState } from "react";
import { useChatStore } from "../store/usechatstore";
import UserProfileModal from "./UserProfile";
import { ChevronDown, X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const [showProfile, setShowProfile] = useState(false);

  if (!selectedUser) return null;

  const handleCloseChat = () => {
    setSelectedUser(null); // This will clear the selected user
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-900">
      <button
        onClick={() => setShowProfile(true)}
        className="flex items-center gap-3 group flex-1" // Added flex-1 to take available space
      >
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {selectedUser.fullName}
            </h2>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedUser.status || "Online"}
          </p>
        </div>
      </button>

      {/* Close button (X) */}
      <button
        onClick={handleCloseChat}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-2"
        aria-label="Close chat"
      >
        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      <UserProfileModal 
        user={selectedUser} 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
};

export default ChatHeader;