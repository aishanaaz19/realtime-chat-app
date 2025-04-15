import { useRef, useState } from "react";
import { useChatStore } from "../store/usechatstore.js";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null); // base64
  const [mediaType, setMediaType] = useState(""); // "image", "video", "doc"
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const MAX_FILE_SIZE_MB = 30;

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isDoc =
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type.includes("presentation") ||
      file.type.includes("officedocument");

    // Validate file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("File size should be less than 30MB");
      return;
    }

    if (!isImage && !isVideo && !isDoc) {
      toast.error("Unsupported file type");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      setMediaType(isImage ? "image" : isVideo ? "video" : isDoc ? "document" : "");
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !mediaPreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: mediaType === "image" ? mediaPreview : null,
        video: mediaType === "video" ? mediaPreview : null,
        document: mediaType === "doc" ? mediaPreview : null,
      });

      setText("");
      setMediaPreview(null);
      setMediaType("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const removeImage = () => {
    setMediaPreview(null);
    setMediaType("");
  };

  return (
    <div className="p-4 w-full relative">
      {mediaPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaType === "video" ? (
              <video src={mediaPreview} controls className="w-32 h-20 rounded-lg border" />
            ) : mediaType === "image" ? (
              <img src={mediaPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
            ) : (
              <a
                href={mediaPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 underline"
              >
                View Attachment
              </a>
            )}

            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          {/* Emoji Picker Button */}
          <button
            type="button"
            className="btn btn-circle text-zinc-400"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={20} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* File Input (shared by both image and attachment buttons) */}
          <input
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
            className="hidden"
            ref={fileInputRef}
            onChange={handleMediaChange}
          />

          {/* Media Button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle text-zinc-400`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          {/* Attachment Button */}
          <button
            type="button"
            className="hidden sm:flex btn btn-circle text-zinc-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="sm:flex btn btn-circle text-zinc-400"
          disabled={!text.trim() && !mediaPreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
