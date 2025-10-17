import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import CustomAlert, { showCustomAlert } from "./component/CustomAlert";
import Shorts from "./Pages/Shorts/Shorts";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import MobileProfile from "./component/MobileProfile";
import ForgetPassword from "./Pages/ForgetPassword";
import CreateChannel from "./Pages/Channel/CreateChannel";
import ViewChannel from "./Pages/Channel/ViewChannel";
import GetChannelData from "./customHooks/GetChannelData";
import UpdateChannel from "./Pages/Channel/UpdateChannel";
import { useSelector } from "react-redux";
import CreatePage from "./Pages/CreatePage";

export const serverUrl = "http://localhost:8000";

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

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="/shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/mobilepro"
            element={
              <ProtectRoute userData={userData}>
                <MobileProfile />
              </ProtectRoute>
            }
          />
          <Route
            path="/viewchannel"
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/updatechannel"
            element={
              <ProtectRoute userData={userData}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />

            <Route
            path="/create"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />
        </Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route
          path="/createchannel"
          element={
            <ProtectRoute userData={userData}>
              <CreateChannel />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
