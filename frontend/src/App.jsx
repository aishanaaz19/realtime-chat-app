import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import ForgotPassword from "./pages/ForgotPassword";
import BlockedUsers from "./pages/BlockedUsers";
import { Routes, Route, Navigate } from "react-router-dom";
import { useChatStore } from "./store/usechatstore";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";




const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser, onlineUsers });

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, []);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      {!isLandingPage() && <Navbar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <LandingPage />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/blocked-users" element={<BlockedUsers />} />
      </Routes>

      <Toaster />
    </div>
  );
  function isLandingPage() {
    return window.location.pathname === '/' && !authUser;
  }
};
export default App;