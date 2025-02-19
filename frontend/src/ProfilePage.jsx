import { useAuthStore } from "./store/useAuthStore";
import {camera} from lucide-react;

const ProfilePage = () => {
    const {authuser, isupdating, updateprofile }=authuser()

    const handleImageUpload = async (e) => {}; 


    return (
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                     <div className="text-centre">
                        <h1 className="text-2xl font-semibold ">profile</h1>
                        <p className="mt-2">Your profile information</p>
                     </div>

             {/* avatar upload section */}

             <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <img 
                    //src={authUser.profilepic "/avtar.png"}
                    alt="profile"
                    className="size-32 rounded-full object-cover border-4"
                    />
                    <label
                    htmlfor="avatar-upload"
                    className={'
                        absolute bottom-0 right-0
                        bg-base-content hover:scale-105
                        p-2 rounded-full cursor-pointer
                        transition-all duration-200
                        ${isupdatingprofile ? "anime-pilse pointer-events-none" : ""}
                    '}

                >
                <camera className="w-5 h-5 text-base-200" />
                <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onchange={handleimageupload}
                disabled={isupdatingprofile}
                />
                </label>
                </div>
                <p className="text-sm txt-zinc-400">
                    {isupdatingprofile ? "uploading..." : "click the camera icon to update your photo"}
                     </p>
             </div>
            </div>
            </div>
            </div>
    );
};
export default ProfilePage;
