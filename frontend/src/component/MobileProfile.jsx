// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'

// import { FiLogOut } from "react-icons/fi";
// import { MdOutlineSwitchAccount } from "react-icons/md";
// import { FcGoogle } from "react-icons/fc";
// import { TiUserAddOutline } from "react-icons/ti";
// import { SiYoutubestudio } from "react-icons/si";

// import { GoVideo } from "react-icons/go";
// import {
//   FaHistory,
//   FaList,
//   FaThumbsUp,
// } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import { setUserData } from '../redux/userSlice';
// import axios from 'axios';
// import { serverUrl } from '../App';
// import { showCustomAlert } from './CustomAlert';
// import { signInWithPopup } from 'firebase/auth';
// import { auth, provider } from '../../utlis/firebase';

// const MobileProfile = () => {
//   const { userData } = useSelector(state => state.user)
//   const navigate = useNavigate()
//   const dispatch = useDispatch();

//   // Sign out
//   const handleSignout = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
//       dispatch(setUserData(null));
//       showCustomAlert("Sign Out Successfully");
//     } catch (err) {
//       console.log(err);
//       showCustomAlert("Sign Out error");
//     }
//   };

//   // Google Sign-In
//   const handleGoogleAuth = async () => {
//     try {
//       const response = await signInWithPopup(auth, provider);
//       const user = response.user;

//       const payload = {
//         userName: user.displayName,
//         email: user.email,
//         photoUrl: user.photoURL,
//       };

//       const result = await axios.post(
//         `${serverUrl}/api/auth/googleauth`,
//         payload,
//         { withCredentials: true }
//       );

//       dispatch(setUserData(result.data.user));
//       showCustomAlert("Google Authentication Successfully");
//     } catch (err) {
//       console.log(err);
//       showCustomAlert("Google Auth error");
//     }
//   };
//   return (


//     <div className="bg-[#0f0f0f] text-white h-screen w-full flex flex-col pt-3 p-3 sm:p-4 md:p-5 md:pt-5 md:rounded-xl md:max-w-md mx-auto overflow-y-auto">

//       {/* Top profile section */}
//       {userData && (
//         <div className="p-3 flex items-center gap-3 sm:gap-4 border-b border-gray-800">
//           {userData?.photoUrl && (
//             <img
//               className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover"
//               src={
//                 userData?.photoUrl?.startsWith("http")
//                   ? userData.photoUrl
//                   : `${serverUrl}${userData.photoUrl}`
//               }
//               alt="User"
//             />
//           )}
//           <div className="flex flex-col min-w-0">
//             <span className="font-semibold text-sm sm:text-base md:text-lg truncate">{userData?.userName}</span>
//             <span className="text-gray-400 text-xs sm:text-sm md:text-base truncate">{userData?.email}</span>
//             <p
//               className="text-sm sm:text-base md:text-base text-blue-400 cursor-pointer hover:underline truncate"
//               onClick={() => {
//                 userData?.channel ? navigate("/viewchannel") : navigate("/createchannel");
//               }}
//             >
//               {userData?.channel ? "View Channel" : "Create Channel"}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Auth buttons */}
//       <div className="flex flex-wrap gap-2 p-3 border-b border-gray-800 overflow-x-auto md:overflow-x-hidden">
//         <button
//           onClick={handleGoogleAuth}
//           className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
//         >
//           <FcGoogle className="text-lg sm:text-xl" /> Sign In with Google
//         </button>
//         <button
//           onClick={() => navigate("/signup")}
//           className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
//         >
//           <TiUserAddOutline className="text-lg sm:text-xl" /> Create Account
//         </button>
//         <button
//           onClick={() => navigate("/signin")}
//           className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
//         >
//           <MdOutlineSwitchAccount className="text-lg sm:text-xl" /> Sign In
//         </button>
//         {/* Show these buttons only if user is logged in */}
//         {userData && (
//           <div className="flex flex-wrap gap-2 p-3 border-b border-gray-800 overflow-x-auto md:overflow-x-hidden">
//             <button className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all">
//               <SiYoutubestudio className="text-lg sm:text-xl text-orange-400" /> PT Studio
//             </button>
//             <button
//               onClick={handleSignout}
//               className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
//             >
//               <FiLogOut className="text-lg sm:text-xl" /> Sign Out
//             </button>
//           </div>
//         )}

//       </div>

//       {/* Menu Items */}
//       <div className="flex flex-col mt-4 md:mt-6 space-y-2">
//         <ProfileMenuItem icon={<FaHistory />} text={"History"} />
//         <ProfileMenuItem icon={<FaList />} text={"Playlists"} />
//         <ProfileMenuItem icon={<GoVideo />} text={"Saved Videos"} />
//         <ProfileMenuItem icon={<FaThumbsUp />} text={"Liked Videos"} />
//         {userData && (
//           <ProfileMenuItem icon={<SiYoutubestudio />} text={"PT Studio"} />
//         )}
//       </div>
//     </div>


//   )
// }

// function ProfileMenuItem({ icon, text, onClick }) {
//   return (
//     <button onClick={onClick} className='w-full rounded-2xl flex items-center gap-3 p-4 active:bg-[#272727] text-left'>
//       <span className='text-lg'>{icon}</span>
//       <span className='text-sm'>{text}</span>
//     </button>
//   )
// }

// export default MobileProfile



import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";

import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { GoVideo } from "react-icons/go";
import { FaHistory, FaList, FaThumbsUp } from "react-icons/fa";

import { auth, provider } from "../../utlis/firebase";
import { serverUrl } from "../App";
import { showCustomAlert } from "./CustomAlert";
import { setUserData } from "../redux/userSlice";

const MobileProfile = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sign out
  const handleSignout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      showCustomAlert("Signed out successfully");
    } catch (err) {
      console.log(err);
      showCustomAlert("Sign out error");
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

      const result = await axios.post(`${serverUrl}/api/auth/googleauth`, payload, {
        withCredentials: true,
      });

      dispatch(setUserData(result.data.user));
      showCustomAlert("Google sign-in successful");
    } catch (err) {
      console.log(err);
      showCustomAlert("Google Auth error");
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white h-[80vh] w-full flex flex-col pt-3 p-3 sm:p-4 md:p-5 md:pt-5 md:rounded-xl md:max-w-md mx-auto overflow-y-auto">
      
      {/* Top profile section */}
      {userData ? (
        <div className="p-3 flex items-center gap-3 sm:gap-4 border-b border-gray-800">
          {userData.photoUrl && (
            <img
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover"
              src={userData.photoUrl.startsWith("http") ? userData.photoUrl : `${serverUrl}${userData.photoUrl}`}
              alt="User"
            />
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm sm:text-base md:text-lg truncate">{userData.userName}</span>
            <span className="text-gray-400 text-xs sm:text-sm md:text-base truncate">{userData.email}</span>
            <p
              className="text-sm sm:text-base md:text-base text-blue-400 cursor-pointer hover:underline truncate"
              onClick={() => {
                if (!userData) return showCustomAlert("Please sign in first!");
                navigate(userData.channel ? "/viewchannel" : "/createchannel");
              }}
            >
              {userData.channel ? "View Channel" : "Create Channel"}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 border-b border-gray-800 text-center text-gray-400">
          You are not signed in
        </div>
      )}

      {/* Auth / action buttons */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-gray-800 overflow-x-auto md:overflow-x-hidden">
        {!userData && (
          <>
            <button
              onClick={handleGoogleAuth}
              className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
            >
              <FcGoogle className="text-lg sm:text-xl" /> Sign In with Google
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
            >
              <TiUserAddOutline className="text-lg sm:text-xl" /> Create Account
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
            >
              <MdOutlineSwitchAccount className="text-lg sm:text-xl" /> Sign In
            </button>
          </>
        )}

        {userData && (
          <>
            <button
              className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
              onClick={() => showCustomAlert("PT Studio clicked")}
            >
              <SiYoutubestudio className="text-lg sm:text-xl text-orange-400" /> PT Studio
            </button>
            <button
              onClick={handleSignout}
              className="bg-gray-800 px-3 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-gray-700 transition-all"
            >
              <FiLogOut className="text-lg sm:text-xl" /> Sign Out
            </button>
          </>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex flex-col mt-4 md:mt-6 space-y-2">
        <ProfileMenuItem icon={<FaHistory />} text={"History"} />
        <ProfileMenuItem icon={<FaList />} text={"Playlists"} />
        <ProfileMenuItem icon={<GoVideo />} text={"Saved Videos"} />
        <ProfileMenuItem icon={<FaThumbsUp />} text={"Liked Videos"} />
        {userData && <ProfileMenuItem icon={<SiYoutubestudio />} text={"PT Studio"} />}
      </div>
    </div>
  );
};

// Menu item component
function ProfileMenuItem({ icon, text, onClick }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl flex items-center gap-3 p-4 active:bg-[#272727] text-left">
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
}

export default MobileProfile;
