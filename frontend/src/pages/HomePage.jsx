import { usechatstore } from "../store/usechatstore.js";

import Sidebar from "../components/sidebar.jsx";
import NoChatSelected from "../components/nochatselected.jsx";
// import ChatContainer from "../components/chatcointainer.jsx";

const HomePage = () => {
  const { selectedUser } = usechatstore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage