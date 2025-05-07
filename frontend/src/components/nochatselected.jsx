import { MessageSquare, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md text-center space-y-6 relative">
        {/* Animated background elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-purple-100/50 dark:bg-purple-900/20 blur-xl"></div>
        
        {/* Main card */}
        <div className="relative z-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
          {/* Icon with animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full opacity-70 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-float" />
                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-spin-slow" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            Welcome to ChatSphere!
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Select a conversation from the sidebar to start chatting, or create a new connection to begin your messaging journey.
          </p>

          {/* Decorative elements */}
          <div className="mt-6 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-700 opacity-70"
                style={{
                  animation: `pulse 2s infinite ${i * 0.3}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NoChatSelected;