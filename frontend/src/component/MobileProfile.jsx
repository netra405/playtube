import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';
import { showCustomAlert } from './CustomAlert';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utlis/firebase';

const MobileProfile = () => {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch();

  // Sign out
  const handleSignout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      showCustomAlert("Sign Out Successfully");
    } catch (err) {
      console.log(err);
      showCustomAlert("Sign Out error");
    }
  };

  // Google Sign-In
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const payload = {
        userName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      };

      const result = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        payload,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data.user));
      showCustomAlert("Google Authentication Successfully");
    } catch (err) {
      console.log(err);
      showCustomAlert("Google Auth error");
    }
  };
  return (


    <div className="bg-[#0f0f0f] text-white h-full w-full flex flex-col pt-3 p-3 md:p-5 md:pt-5 md:rounded-xl md:max-w-md mx-auto overflow-y-auto">

  {/* Top profile section */}
  {userData && (
    <div className="p-3 flex items-center gap-4 border-b border-gray-800">
      {userData?.photoUrl && (
        <img
          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
          src={
            userData?.photoUrl?.startsWith("http")
              ? userData.photoUrl
              : `${serverUrl}${userData.photoUrl}`
          }
          alt=""
        />
      )}
      <div className="flex flex-col">
        <span className="font-semibold text-base md:text-lg">{userData?.userName}</span>
        <span className="text-gray-400 text-sm md:text-base">{userData?.email}</span>
        <p
          className="text-sm md:text-base text-blue-400 cursor-pointer hover:underline"
          onClick={() => {
            userData?.channel ? navigate("/viewchannel") : navigate("/createchannel");
          }}
        >
          {userData?.channel ? "View Channel" : "Create Channel"}
        </p>
      </div>
    </div>
  )}

  {/* Auth buttons */}
  <div className="flex flex-wrap gap-2 p-3 border-b border-gray-800 overflow-x-auto md:overflow-hidden">
    <button
      onClick={handleGoogleAuth}
      className="bg-gray-800 px-3 py-2 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
    >
      <FcGoogle className="text-lg md:text-xl" /> Sign In with Google
    </button>
    <button
      onClick={() => navigate("/signup")}
      className="bg-gray-800 px-3 py-2 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
    >
      <TiUserAddOutline className="text-lg md:text-xl" /> Create Account
    </button>
    <button
      onClick={() => navigate("/signin")}
      className="bg-gray-800 px-3 py-2 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
    >
      <MdOutlineSwitchAccount className="text-lg md:text-xl" /> Sign In
    </button>
    <button className="bg-gray-800 px-3 py-2 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all">
      <SiYoutubestudio className="text-lg md:text-xl text-orange-400" /> PT Studio
    </button>
    <button
      onClick={handleSignout}
      className="bg-gray-800 px-3 py-2 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
    >
      <FiLogOut className="text-lg md:text-xl" /> Sign Out
    </button>
  </div>

  {/* Menu Items */}
  <div className="flex flex-col mt-4 md:mt-6 space-y-2">
    <ProfileMenuItem icon={<FaHistory />} text={"History"} />
    <ProfileMenuItem icon={<FaList />} text={"Playlists"} />
    <ProfileMenuItem icon={<GoVideo />} text={"Saved Videos"} />
    <ProfileMenuItem icon={<FaThumbsUp />} text={"Liked Videos"} />
    <ProfileMenuItem icon={<SiYoutubestudio />} text={"PT Studio"} />
  </div>
</div>

  )
}

function ProfileMenuItem({ icon, text, onClick }) {
  return (
    <button onClick={onClick} className='w-full rounded-2xl flex items-center gap-3 p-4 active:bg-[#272727] text-left'>
      <span className='text-lg'>{icon}</span>
      <span className='text-sm'>{text}</span>
    </button>
  )
}

export default MobileProfile
