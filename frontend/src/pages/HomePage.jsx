<<<<<<< HEAD
import { usechatstore } from "..store/usechatstore";

import sidebar from "../components/sidebar";
import nochatselected from "../components/nochatselected";
import chatcointainer from "../components/chatcointainer";

const homepage = () => {
    const { selectedUser } = usechatstore();

    return (
        <div className="flex items-center justify-center pt-20 px-4">
            <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                <div className="flex h-full rounded-lg overflow-hidden">
                    <sidebar />

                    {!selectedUser ? <nochatselected /> : <chatcointainer/>}
                </div>
            </div>
        </div>
    )
};
export default homepage;
=======
import React from 'react'

const HomePage = () => {
  return (
    <div>HomePage</div>
  )
}

export default HomePage
>>>>>>> 287dd3650691ad6d1f31ad97d6a4c7fbdf96fbbd
