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

// export const serverUrl = "http://localhost:8000";

// // ✅ ProtectRoute Component
// const ProtectRoute = ({ userData, children }) => {
//   if (!userData) {
//     showCustomAlert("Please sign up first to use this feature!");
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// const App = () => {
//   // ✅ Call hooks INSIDE component body
//   GetCurrentUser();
//   GetChannelData();

//   const { userData } = useSelector((state) => state.user);

//   return (
//     <>
//       <CustomAlert />
//       <Routes>
//         <Route path="/" element={<Home />} />

//         <Route
//           path="/shorts"
//           element={
//             <ProtectRoute userData={userData}>
//               <Shorts />
//             </ProtectRoute>
//           }
//         />

//         <Route
//           path="/mobilepro"
//           element={
           
//               <MobileProfile />
          
//           }
//         />


//         <Route
//           path="/viewchannel"
//           element={
//             <ProtectRoute userData={userData}>
//               <ViewChannel />
//             </ProtectRoute>
//           }
//         />

//         <Route
//           path="/updatechannel"
//           element={
//             <ProtectRoute userData={userData}>
//               <UpdateChannel />
//             </ProtectRoute>
//           }
//         />

//         <Route
//           path="/create"
//           element={
//             <ProtectRoute userData={userData}>
//               <CreatePage />
//             </ProtectRoute>
//           }
//         />

//         <Route
//           path="/createvideo"
//           element={
//             <ProtectRoute userData={userData}>
//               <CreateVideo />
//             </ProtectRoute>
//           }
//         />

//         <Route
//           path="/createshort"
//           element={
//             <ProtectRoute userData={userData}>
//               <CreateShort />
//             </ProtectRoute>
//           }
//         />

//         <Route
//           path="/createplaylist"
//           element={
//             <ProtectRoute userData={userData}>
//               <CreatePlaylist />
//             </ProtectRoute>
//           }
//         />

//         <Route
//           path="/createpost"
//           element={
//             <ProtectRoute userData={userData}>
//               <CreatePost />
//             </ProtectRoute>
//           }
//         />

//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/forgetpass" element={<ForgetPassword />} />

//         <Route
//           path="/createchannel"
//           element={
//             <ProtectRoute userData={userData}>
//               <CreateChannel />
//             </ProtectRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// };

// export default App;





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
  GetCurrentUser();
  GetChannelData();
  GetAllContentData()

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <CustomAlert />
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />

        {/* Home layout with nested routes */}
        <Route path="/" element={<Home />}>
          {/* Nested routes inside Home */}
          <Route
            path="shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
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
        </Route>
      </Routes>
    </>
  );
};

export default App;

