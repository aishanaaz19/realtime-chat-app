import { useEffect, useState } from "react";
import { useChatStore } from "../store/usechatstore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Frown } from "lucide-react";

const Sidebar = () => {
  const { getFriends, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const filteredUsers = users.filter(user => {
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOnline && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 w-full p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="size-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold hidden lg:block text-gray-800 dark:text-gray-200">
              Contacts
            </span>
          </div>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full">
            {onlineUsers.length} online
          </span>
        </div>

        {/* Search Bar */}
        <div className="mt-4 hidden lg:block relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Online Filter */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <div className="relative">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Online only</span>
          </label>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full flex-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                ${selectedUser?._id === user._id ? "bg-indigo-50 dark:bg-indigo-900/30" : ""}
                border-b border-gray-100 dark:border-gray-800
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                />
                {onlineUsers.includes(user._id) ? (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                ) : (
                  <span className="absolute bottom-0 right-0 size-3 bg-gray-400 rounded-full ring-2 ring-white dark:ring-gray-900" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {user.fullName}
                </div>
                <div className="text-xs mt-1 flex items-center gap-1">
                  <span className={`inline-block size-2 rounded-full ${onlineUsers.includes(user._id) ? "bg-green-500" : "bg-gray-400"}`}></span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {onlineUsers.includes(user._id) ? "Active now" : "Last seen recently"}
                  </span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500 dark:text-gray-400">
            <Frown className="size-10 mb-3 opacity-50" />
            <p className="font-medium">No contacts found</p>
            <p className="text-sm mt-1">
              {searchQuery ? "Try a different search" : showOnlineOnly ? "No online users" : "Your contacts will appear here"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;