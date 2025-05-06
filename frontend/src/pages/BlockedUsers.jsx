import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';
import { UserX } from 'lucide-react'; // Import an unblock icon

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authUser, removeFromBlockedList } = useAuthStore();

  const fetchBlocked = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/blocked');
      setBlockedUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch blocked users:", error);
      // Fallback to locally stored blocked users if API fails
      if (authUser?.blockedUsers) {
        setBlockedUsers(authUser.blockedUsers);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId) => {
    if (window.confirm('Are you sure you want to unblock this user?')) {
      try {
        await axios.post('/api/users/unblock', { userId });
        removeFromBlockedList(userId);
        setBlockedUsers(blockedUsers.filter(user => user._id !== userId));
        toast.success('User unblocked successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to unblock user");
      }
    }
  };

  useEffect(() => {
    fetchBlocked();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading blocked users...</div>;
  }

  if (blockedUsers.length === 0) {
    return <div className="text-center py-8 text-gray-500">No blocked users</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Blocked Users</h2>
      <div className="space-y-3">
        {blockedUsers.map(user => (
          <div 
            key={user._id} 
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{user.fullName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleUnblock(user._id)}
              className="flex items-center space-x-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              title="Unblock user"
            >
              <UserX className="w-4 h-4" />
              <span className="text-sm">Unblock</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedUsers;