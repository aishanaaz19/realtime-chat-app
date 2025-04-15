import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [previewImg, setPreviewImg] = useState(authUser?.profilePic || null);
  const [username, setUsername] = useState(authUser?.username || "");
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const fileInputRef = useRef(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess && !isUpdatingProfile) {
      const timer = setTimeout(() => {
        navigate("/"); // Redirect to homepage after 1.5 seconds
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isUpdatingProfile, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImg(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        username,
        fullName,
        profilePic: previewImg
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary/10 p-6 text-center">
            <h1 className="text-3xl font-bold text-primary">Your Profile</h1>
            <p className="text-base-content/80 mt-2">
              Manage your account information
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="bg-success/20 text-success px-6 py-3 text-center">
              Profile updated successfully! Redirecting...
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="relative rounded-full p-1 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <img
                    src={previewImg || "/profile.png"}
                    alt="Profile"
                    className="size-32 md:size-40 rounded-full object-cover shadow-lg"
                  />
                  <button
                    onClick={triggerFileInput}
                    disabled={isUpdatingProfile || isSuccess}
                    className={`absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform ${
                      isUpdatingProfile || isSuccess ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile || isSuccess}
                />
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-6 max-w-md mx-auto">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-base-200 rounded-lg border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={isUpdatingProfile || isSuccess}
                />
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-base-200 rounded-lg border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={isUpdatingProfile || isSuccess}
                />
              </div>

              {/* Email Field (readonly) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="px-4 py-3 bg-base-200 rounded-lg border border-base-300">
                  {authUser?.email}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-base-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-base-300">
                  <span className="text-base-content/70">Member Since</span>
                  <span className="font-medium">
                    {new Date(authUser?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-base-content/70">Account Status</span>
                  <span className="badge badge-success">Active</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isUpdatingProfile || isSuccess || (!username && !fullName && !previewImg)}
                className={`btn btn-primary px-8 rounded-full ${
                  isUpdatingProfile || isSuccess ? "opacity-80" : ""
                }`}
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isSuccess ? (
                  "Saved!"
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;