import React from 'react'
import { useSelector } from 'react-redux'

import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";

import { GoVideo } from "react-icons/go";
import {
  FaHistory,
  FaList,
  FaThumbsUp,
} from "react-icons/fa";

const MobileProfile = () => {
    const {userData} = useSelector(state=>state.user)
  return (

    
    <div className=' md:hidden bg-[#0f0f0f] text-white h-[100%] w-[100%] flex flex-col pt-[10px] p-[10px]'>

        {/* top profile section */}
       {userData && <div className='p-4 flex items-center gap-4 border-b border-gray-800'>
                {userData?.photoUrl && <img className='w-16 h-16 rounded-full object-cover' src={userData?.photoUrl} alt="" />}
                <div className='flex flex-col'>
                    <span className='font-semibold text-lg'>{userData?.userName}</span>
                    <span className='text-gray-400 text-sm'>{userData?.email}</span>
                    <p className='text-sm text-blue-400 cursor-pointer hover:underline'>{userData?.channel ? "view channel" : "create channel"}</p>
                </div>
        </div>}
            {/* auth buutton */}
            <div className='flex gap-2 p-4 border-b border-gray-800 overflow-auto'>
                <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'><FcGoogle className='text-xl'/>Sign In with Google Account</button>
                <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'><TiUserAddOutline className='text-xl'/>Create new Account</button>
                <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'><MdOutlineSwitchAccount className='text-xl'/>Sign In with your Account</button>
                <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'><SiYoutubestudio className='text-xl text-orange-400'/>PT Studio</button>
                <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'><FiLogOut className='text-xl'/>Sign Out</button>
            </div>

            <div className='flex flex-col mt-[20px]'>
                <ProfileMenuItem icon={<FaHistory/>} text={"History"}/>
                <ProfileMenuItem icon={<FaList/>} text={"Playlists"}/>
                <ProfileMenuItem icon={<GoVideo/>} text={"Save Videos"}/>
                <ProfileMenuItem icon={<FaThumbsUp/>} text={"Liked Videos"}/>
                <ProfileMenuItem icon={<SiYoutubestudio/>} text={"PT Studio"}/>
            </div>
    </div>
  )
}

function ProfileMenuItem ({icon, text, onClick}) {
    return(
        <button onClick={onClick} className='w-full rounded-2xl flex items-center gap-3 p-4 active:bg-[#272727] text-left'>
            <span className='text-lg'>{icon}</span>
            <span className='text-sm'>{text}</span>
        </button>
    )
}

export default MobileProfile
