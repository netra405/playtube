// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../../utlis/firebase";
// import { serverUrl } from "../App";
// import { setUserData } from "../redux/userSlice";
// import { showCustomAlert } from "./CustomAlert";
// import { FiLogOut } from "react-icons/fi";
// import { MdOutlineSwitchAccount } from "react-icons/md";
// import { FcGoogle } from "react-icons/fc";
// import { TiUserAddOutline } from "react-icons/ti";
// import { SiYoutubestudio } from "react-icons/si";

// const Profile = () => {
//   const { userData } = useSelector((state) => state.user);
//   const navigate = useNavigate();
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
//     <div className="absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50 hidden md:block">
      
//       {/* Show user info if logged in */}
//       {userData && (
//         <div className="flex items-start gap-3 p-4 border-b border-gray-700">
//           <img
//             src={userData?.photoUrl}
//             alt="Profile"
//             className="w-12 h-12 rounded-full object-cover border border-gray-700"
//           />
//           <div>
//             <h4 className="font-semibold">{userData?.userName}</h4>
//             <p className="text-sm text-gray-400">{userData?.email}</p>
//           </div>
//         </div>
//       )}

//       {/* Buttons: Always show */}
//       <div className="flex flex-col py-2">
//         <button
//           onClick={handleGoogleAuth}
//           className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
//         >
//           <FcGoogle className="text-xl" /> Sign In with Google
//         </button>
//         <button
//           onClick={() => navigate("/signup")}
//           className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
//         >
//           <TiUserAddOutline className="text-xl" /> Create New Account
//         </button>
//         <button
//           onClick={() => navigate("/signin")}
//           className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
//         >
//           <MdOutlineSwitchAccount className="text-xl" /> Sign In with Other Account
//         </button>

//         {/* Show sign out and channel if logged in */}
//         {userData && (
//           <>
//             {userData?.channel && (
//               <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 mt-2">
//                 <SiYoutubestudio className="w-5 h-5 text-orange-400" /> PT Studio
//               </button>
//             )}
//             <button
//               onClick={handleSignout}
//               className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 mt-2"
//             >
//               <FiLogOut className="text-xl" /> Sign Out
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;



import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utlis/firebase";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { showCustomAlert } from "./CustomAlert";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
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
    <div className="absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50 hidden md:block">
      
      {/* Show user info if logged in */}
      {userData && (
        <div className="flex items-start gap-3 p-4 border-b border-gray-700">
          <img
            src={
              userData?.photoUrl?.startsWith("http") 
                ? userData.photoUrl 
                : `${serverUrl}${userData.photoUrl}`
            }
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border border-gray-700"
          />
          <div>
            <h4 className="font-semibold">{userData?.userName}</h4>
            <p className="text-sm text-gray-400">{userData?.email}</p>
            <p className="text-sm text-blue-400 cursor-pointer hover:underline" onClick={()=>{userData?.channel ? navigate("/viewchannel") : navigate("/createchannel")}}>{userData?.channel ? "view Channel" : "create channel"}</p>
          </div>
        </div>
      )}

      {/* Buttons: Always show */}
      <div className="flex flex-col py-2">
        <button
          onClick={handleGoogleAuth}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
        >
          <FcGoogle className="text-xl" /> Sign In with Google
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
        >
          <TiUserAddOutline className="text-xl" /> Create New Account
        </button>
        <button
          onClick={() => navigate("/signin")}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
        >
          <MdOutlineSwitchAccount className="text-xl" /> Sign In with Other Account
        </button>

        {/* Show sign out and channel if logged in */}
        {userData && (
          <>
            {userData?.channel && (
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 mt-2">
                <SiYoutubestudio className="w-5 h-5 text-orange-400" /> PT Studio
              </button>
            )}
            <button
              onClick={handleSignout}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 mt-2"
            >
              <FiLogOut className="text-xl" /> Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
