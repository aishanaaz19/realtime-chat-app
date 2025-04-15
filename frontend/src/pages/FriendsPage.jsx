import SearchUser from "@/components/SearchBar";
import FriendsList from "@/components/FriendsList";
import axios from "axios";

export default function FriendsPage() {
  const handleAddFriend = async (friendId) => {
    try {
      await axios.post("/api/users/add-friend", { friendId });
      alert("Friend added!");
    } catch (err) {
      alert("Error adding friend");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <SearchUser onAddFriend={handleAddFriend} />
      <FriendsList />
    </div>
  );
}
