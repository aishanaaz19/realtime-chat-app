// src/components/FriendsList.jsx

import { useEffect, useState } from "react";
import axios from "axios";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    const res = await axios.get("/api/users/friends");
    setFriends(res.data);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="p-4 bg-base-200 rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">Friends List</h2>
      <ul className="space-y-2">
        {friends.map((friend) => (
          <li key={friend._id} className="p-2 bg-base-300 rounded">
            {friend.fullName} (@{friend.username})
          </li>
        ))}
      </ul>
    </div>
  );
}
