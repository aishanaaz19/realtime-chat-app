import React, { useState } from "react";
import axios from "axios";

const ChatbotBox = () => {
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState([]);

  const sendToBot = async () => {
    if (!userInput.trim()) return;
    setChat([...chat, { sender: "user", text: userInput }]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userInput,
      });

      setChat((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
      setUserInput("");
    } catch (error) {
      console.error("Bot error:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded" >
      <div className="h-64 overflow-y-auto mb-4">
        {chat.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded ${msg.sender === "user" ? "bg-blue-100" : "bg-green-100"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Type your question..."
        />
        <button onClick={sendToBot} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotBox;
