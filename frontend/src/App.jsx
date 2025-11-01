



// // ...existing code...
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

// export const serverUrl = "http://localhost:8000";

// // ProtectRoute Component
// const ProtectRoute = ({ userData, children }) => {
//   if (!userData) {
//     showCustomAlert("Please sign up first to use this feature!");
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// const App = () => {
//   // custom hooks that fetch/store initial data
//   GetCurrentUser();
//   GetChannelData();
//   GetAllContentData();

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

//            <Route
//             path="likedcontent"
//             element={
//               <ProtectRoute userData={userData}>
//                 <LikedContent />
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


// ...existing code...
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import CustomAlert, { showCustomAlert } from "./component/CustomAlert";
import Shorts from "./Pages/Shorts/Shorts";
import MobileProfile from "./component/MobileProfile";
import ForgetPassword from "./Pages/ForgetPassword";
import CreateChannel from "./Pages/Channel/CreateChannel";
import ViewChannel from "./Pages/Channel/ViewChannel";
import UpdateChannel from "./Pages/Channel/UpdateChannel";
import CreatePage from "./Pages/CreatePage";
import CreateVideo from "./Pages/Videos/CreateVideo";
import CreateShort from "./Pages/Shorts/CreateShort";
import CreatePlaylist from "./Pages/Playlist/CreatePlaylist";
import CreatePost from "./Pages/Post/CreatePost";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import GetChannelData from "./customHooks/GetChannelData";
import GetAllContentData from "./customHooks/GetAllContentData";
import PlayVideo from "./Pages/Videos/PlayVideo";
import PlayShort from "./Pages/Shorts/PlayShort";
import ChannelPage from "./Pages/Channel/ChannelPage";
import LikedContent from "./Pages/LikedContent";
import SavedContent from "./Pages/SavedContent";
import SavedPlaylist from "./Pages/Playlist/SavedPlaylist";
import Subscription from "./Pages/Subscription";
import GetSubscribedData from "./customHooks/GetSubscribedData";
import GetHistory from "./customHooks/GetHistory";
import HistoryContent from "./Pages/HistoryContent";

export const serverUrl = "http://localhost:8000";

// ProtectRoute Component
const ProtectRoute = ({ userData, children }) => {
  if (!userData) {
    showCustomAlert("Please sign up first to use this feature!");
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  // custom hooks that fetch/store initial data
  GetCurrentUser();
  GetChannelData();
  GetAllContentData();
  GetSubscribedData()
  GetHistory()

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <CustomAlert />
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />

        {/* Direct play video route */}
        <Route
          path="/playvideo/:videoId"
          element={
            <ProtectRoute userData={userData}>
              <PlayVideo key={window.location.pathname} />
            </ProtectRoute>
          }
        />

        {/* Home layout with nested routes */}
        <Route path="/" element={<Home />}>
          <Route
            path="channelpage/:channelId"
            element={
              <ProtectRoute userData={userData}>
                <ChannelPage key={window.location.pathname} />
              </ProtectRoute>
            }
          >
            {/* nested playvideo under a channel (optional) */}
            <Route
              path="playvideo/:videoId"
              element={
                <ProtectRoute userData={userData}>
                  <PlayVideo />
                </ProtectRoute>
              }
            />
          </Route>

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
          <Route path="mobilepro" element={<MobileProfile />} />
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
          <Route
            path="createchannel"
            element={
              <ProtectRoute userData={userData}>
                <CreateChannel />
              </ProtectRoute>
            }
          />

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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
// ...existing code...