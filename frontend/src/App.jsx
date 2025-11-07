
// import React from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// import Home from "./Pages/Home";
// import SignUp from "./Pages/SignUp";
// import SignIn from "./Pages/SignIn";
// import CustomAlert, { showCustomAlert } from "./component/CustomAlert";
// import Shorts from "./Pages/Shorts/Shorts";
// import MobileProfile from "./component/MobileProfile";
// import ForgetPassword from "./Pages/ForgetPassword";
// import CreateChannel from "./Pages/Channel/CreateChannel";
// import ViewChannel from "./Pages/Channel/ViewChannel";
// import UpdateChannel from "./Pages/Channel/UpdateChannel";
// import CreatePage from "./Pages/CreatePage";
// import CreateVideo from "./Pages/Videos/CreateVideo";
// import CreateShort from "./Pages/Shorts/CreateShort";
// import CreatePlaylist from "./Pages/Playlist/CreatePlaylist";
// import CreatePost from "./Pages/Post/CreatePost";
// import GetCurrentUser from "./customHooks/GetCurrentUser";
// import GetChannelData from "./customHooks/GetChannelData";
// import GetAllContentData from "./customHooks/GetAllContentData";
// import PlayVideo from "./Pages/Videos/PlayVideo";
// import PlayShort from "./Pages/Shorts/PlayShort";
// import ChannelPage from "./Pages/Channel/ChannelPage";
// import LikedContent from "./Pages/LikedContent";
// import SavedContent from "./Pages/SavedContent";
// import SavedPlaylist from "./Pages/Playlist/SavedPlaylist";
// import Subscription from "./Pages/Subscription";
// import GetSubscribedData from "./customHooks/GetSubscribedData";
// import GetHistory from "./customHooks/GetHistory";
// import HistoryContent from "./Pages/HistoryContent";

// export const serverUrl = "http://localhost:8000";

// // ProtectRoute Component
// const ProtectRoute = ({ userData, children }) => {
//   if (!userData) {
//     showCustomAlert("Please sign up or sign in first to use this feature!");
//     return <Navigate to="/signin" replace />;
//   }
//   return children;
// };



// const App = () => {
//   // custom hooks that fetch/store initial data
//   GetCurrentUser();
//   GetChannelData();
//   GetAllContentData();
//   GetSubscribedData()
//   GetHistory()

//   const { userData } = useSelector((state) => state.user);

//   return (
//     <>
//       <CustomAlert />
//       <Routes>
//         {/* Public routes */}
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/forgetpass" element={<ForgetPassword />} />

//         {/* Direct play video route */}
//         <Route
//           path="/playvideo/:videoId"
//           element={
//             <ProtectRoute userData={userData}>
//               <PlayVideo key={window.location.pathname} />
//             </ProtectRoute>
//           }
//         />

//         {/* Home layout with nested routes */}
//         <Route path="/" element={<Home />}>
//           <Route
//             path="channelpage/:channelId"
//             element={
//               <ProtectRoute userData={userData}>
//                 <ChannelPage key={window.location.pathname} />
//               </ProtectRoute>
//             }
//           >
//             {/* nested playvideo under a channel (optional) */}
//             <Route
//               path="playvideo/:videoId"
//               element={
//                 <ProtectRoute userData={userData}>
//                   <PlayVideo />
//                 </ProtectRoute>
//               }
//             />
//           </Route>

//           <Route
//             path="shorts"
//             element={
//               <ProtectRoute userData={userData}>
//                 <Shorts />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="playshort/:shortId"
//             element={
//               <ProtectRoute userData={userData}>
//                 <PlayShort />
//               </ProtectRoute>
//             }
//           />
//           <Route path="mobilepro" element={<MobileProfile />} />
//           <Route
//             path="viewchannel"
//             element={
//               <ProtectRoute userData={userData}>
//                 <ViewChannel />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="updatechannel"
//             element={
//               <ProtectRoute userData={userData}>
//                 <UpdateChannel />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="create"
//             element={
//               <ProtectRoute userData={userData}>
//                 <CreatePage />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="createvideo"
//             element={
//               <ProtectRoute userData={userData}>
//                 <CreateVideo />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="createshort"
//             element={
//               <ProtectRoute userData={userData}>
//                 <CreateShort />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="createplaylist"
//             element={
//               <ProtectRoute userData={userData}>
//                 <CreatePlaylist />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="createpost"
//             element={
//               <ProtectRoute userData={userData}>
//                 <CreatePost />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="createchannel"
//             element={
//               <ProtectRoute userData={userData}>
//                 <CreateChannel />
//               </ProtectRoute>
//             }
//           />

//           <Route
//             path="likedcontent"
//             element={
//               <ProtectRoute userData={userData}>
//                 <LikedContent />
//               </ProtectRoute>
//             }
//           />

//           <Route
//             path="savedcontent"
//             element={
//               <ProtectRoute userData={userData}>
//                 <SavedContent />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="savedplaylist"
//             element={
//               <ProtectRoute userData={userData}>
//                 <SavedPlaylist />
//               </ProtectRoute>
//             }
//           />
//           <Route
//             path="subscription"
//             element={
//               <ProtectRoute userData={userData}>
//                 <Subscription />
//               </ProtectRoute>
//             }
//           />
//             <Route
//             path="history"
//             element={
//               <ProtectRoute userData={userData}>
//                 <HistoryContent />
//               </ProtectRoute>
//             }
//           />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   );
// };

// export default App;
// // ...existing code...



import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import ForgetPassword from "./Pages/ForgetPassword";

import Shorts from "./Pages/Shorts/Shorts";
import MobileProfile from "./component/MobileProfile";

import CreateChannel from "./Pages/Channel/CreateChannel";
import ViewChannel from "./Pages/Channel/ViewChannel";
import UpdateChannel from "./Pages/Channel/UpdateChannel";
import ChannelPage from "./Pages/Channel/ChannelPage";

import CreatePage from "./Pages/CreatePage";
import CreateVideo from "./Pages/Videos/CreateVideo";
import CreateShort from "./Pages/Shorts/CreateShort";
import CreatePlaylist from "./Pages/Playlist/CreatePlaylist";
import CreatePost from "./Pages/Post/CreatePost";

import PlayVideo from "./Pages/Videos/PlayVideo";
import PlayShort from "./Pages/Shorts/PlayShort";

import LikedContent from "./Pages/LikedContent";
import SavedContent from "./Pages/SavedContent";
import SavedPlaylist from "./Pages/Playlist/SavedPlaylist";
import Subscription from "./Pages/Subscription";
import HistoryContent from "./Pages/HistoryContent";

import CustomAlert, { showCustomAlert } from "./component/CustomAlert";

// Custom hooks
import GetCurrentUser from "./customHooks/GetCurrentUser";
import GetChannelData from "./customHooks/GetChannelData";
import GetAllContentData from "./customHooks/GetAllContentData";
import GetSubscribedData from "./customHooks/GetSubscribedData";
import GetHistory from "./customHooks/GetHistory";
import GetRecommendedContent from "./customHooks/GetRecommendedContent";

// server URL
export const serverUrl = "http://localhost:8000";

// ✅ Protected Route (like YouTube)
const ProtectRoute = ({ userData, children }) => {
  const location = useLocation();
  if (!userData) {
    showCustomAlert("Please sign in to continue.");
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  // Fetch essential data on app load
  GetCurrentUser();
  GetChannelData();
  GetAllContentData();
  GetSubscribedData();
  GetHistory();
  GetRecommendedContent()

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <CustomAlert />
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />

        {/* 🔒 Protected Video Access (direct link) */}
        <Route
          path="/playvideo/:videoId"
          element={
            <ProtectRoute userData={userData}>
              <PlayVideo key={window.location.pathname} />
            </ProtectRoute>
          }
        />

        {/* 🔓 Home (main layout) */}
        <Route path="/" element={<Home />}>
          {/* Channel Page */}
          <Route
            path="channelpage/:channelId"
            element={
              <ProtectRoute userData={userData}>
                <ChannelPage key={window.location.pathname} />
              </ProtectRoute>
            }
          >
            {/* nested route inside channel */}
            <Route
              path="playvideo/:videoId"
              element={
                <ProtectRoute userData={userData}>
                  <PlayVideo />
                </ProtectRoute>
              }
            />
          </Route>

          {/* Shorts */}
          <Route
            path="shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />
          <Route
            path="playshort/:shortId"
            element={
              <ProtectRoute userData={userData}>
                <PlayShort />
              </ProtectRoute>
            }
          />

          {/* Profile */}
          <Route
            path="mobilepro"
            element={
              <ProtectRoute userData={userData}>
                <MobileProfile />
              </ProtectRoute>
            }
          />

          {/* Channel Creation and Update */}
          <Route
            path="createchannel"
            element={
              <ProtectRoute userData={userData}>
                <CreateChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="viewchannel"
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="updatechannel"
            element={
              <ProtectRoute userData={userData}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />

          {/* Create Pages */}
          <Route
            path="create"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />
          <Route
            path="createvideo"
            element={
              <ProtectRoute userData={userData}>
                <CreateVideo />
              </ProtectRoute>
            }
          />
          <Route
            path="createshort"
            element={
              <ProtectRoute userData={userData}>
                <CreateShort />
              </ProtectRoute>
            }
          />
          <Route
            path="createplaylist"
            element={
              <ProtectRoute userData={userData}>
                <CreatePlaylist />
              </ProtectRoute>
            }
          />
          <Route
            path="createpost"
            element={
              <ProtectRoute userData={userData}>
                <CreatePost />
              </ProtectRoute>
            }
          />

          {/* Saved / Liked / Subscriptions / History */}
          <Route
            path="likedcontent"
            element={
              <ProtectRoute userData={userData}>
                <LikedContent />
              </ProtectRoute>
            }
          />
          <Route
            path="savedcontent"
            element={
              <ProtectRoute userData={userData}>
                <SavedContent />
              </ProtectRoute>
            }
          />
          <Route
            path="savedplaylist"
            element={
              <ProtectRoute userData={userData}>
                <SavedPlaylist />
              </ProtectRoute>
            }
          />
          <Route
            path="subscription"
            element={
              <ProtectRoute userData={userData}>
                <Subscription />
              </ProtectRoute>
            }
          />
          <Route
            path="history"
            element={
              <ProtectRoute userData={userData}>
                <HistoryContent />
              </ProtectRoute>
            }
          />
        </Route>

        {/* 🔁 Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;

