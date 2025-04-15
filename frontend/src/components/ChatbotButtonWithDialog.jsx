import { useState } from "react";

const ChatbotButtonWithDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
    setPrompt("");
    setResponse("");
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.response || "No response");
    } catch (error) {
      setResponse("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleDialog}
        className="fixed bottom-6 left-6 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 z-50"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 bg-white border border-gray-200 shadow-2xl rounded-xl p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg text-gray-800">Ask AI 🤖</h2>
            <button
              onClick={toggleDialog}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>
          </div>

          <textarea
            className="w-full h-20 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your question..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={handleSend}
            disabled={isLoading}
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Thinking..." : "Send"}
          </button>

          {response && (
            <div className="mt-3 p-2 bg-gray-100 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
              {response}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotButtonWithDialog;
