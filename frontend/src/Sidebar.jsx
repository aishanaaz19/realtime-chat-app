import React from "react";
import { userrect } from React
import { usechatstore } from "./store/usechatstore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
    const { getUsers, users, selectUsers, isUsersLoading}=usechatstore()

    const onlineUsers = [];

    useEffect( () => {
        getUsers()
    }, [getUsers])

    if(isUsersLoading) return <SidebarSkeleton />

    return (
        <aside className="h-full w-20 lg:w-72 border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span  className="font-medium hidden lg:block">Contacts</span>
                    </div>
                    {/* TODO: Online filter toggle */}
                    </div>

                    <div className="overflow-y-auto w-full py-3">
                         {users.map((user) => (
                            <button
                            key={user._id}
                            onClick={() => selectdUsers(user)}
                            className={`
                                w-full p-3 flex items-center gap-3
                                hover:bg-base-300 transition-colors
                                ${selectedUsers?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                                `}

                                >
                                    <div className="relative mx-auto lg:mx-0">
                                        <img
                                        src={user.profilePic || "/avatar.png"}
                                        alt={user.name}
                                        className="size-12 object-cover rounded-full"
                                        />
                                        {onlineUsers.includes(user._id) && (
                                            <span
                                            className="absolute bottom-0 right-0 size-3 bg-green-500
                                            rounded-full ring-2 ring-zinc-900"
                                            />
                                         )}
                                    </div>


                                    {/* User info - only visible on larger screens */}
                                    <div className="hidden lg:block text-left min-w-0">
                                        <div className="font-medium truncate">{user.fullName}</div>
                                        <div className="text-sm text-zinc-400">
                                            {onlineUsers.includes(user.id) ? "Online" : "Offline"}
                                            </div>
                                    </div>
                                </button>
                            ))}
                            </div>
                            </aside>
                            )
                        };
export default Sidebar;