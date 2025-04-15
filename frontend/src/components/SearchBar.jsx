import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useChatStore } from "@/store/usechatstore";

const SearchBar = () => {
  const { users: friends } = useChatStore();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/search?username=${value}`);
      const data = await response.json();

      // if backend returns array of users
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else if (data) {
        setSearchResults([data]);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      const response = await fetch(`/api/users/add-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // for cookies/auth
        body: JSON.stringify({ friendId }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Friend added successfully!");
        setSearchResults([]);
        setQuery("");
      } else {
        alert(result.message || "Error adding friend.");
      }
      useChatStore.getState().getFriends();
    } catch (err) {
      console.error("Failed to add friend:", err);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center border rounded-full px-3 py-1 bg-white shadow-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search users..."
          className="outline-none px-2 py-1 w-full bg-transparent text-sm"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {query && searchResults.length > 0 && (
        <div className="absolute mt-1 bg-white shadow-lg rounded-md w-full z-10 max-h-60 overflow-y-auto">
            {searchResults.map((user) => {
            const alreadyFriend = friends.some((f) => f._id === user._id);

            return (
                <div
                key={user._id}
                className="flex justify-between items-center p-2 hover:bg-gray-100"
                >
                <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.fullName}</p>
                </div>

                {!alreadyFriend ? (
                    <button
                    className="text-sm text-indigo-600 border border-indigo-600 px-2 py-1 rounded hover:bg-indigo-600 hover:text-white"
                    onClick={() => handleAddFriend(user._id)}
                    >
                    Add Friend
                    </button>
                ) : (
                    <span className="text-green-500 text-sm">Friend</span>
                )}
                </div>
            );
            })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
