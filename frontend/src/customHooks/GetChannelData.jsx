import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setAllChannelData, setChannelData } from "../redux/userSlice";

const GetChannelData = () => {
  const dispatch = useDispatch();

  // ✅ Fetch current user's channel
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/getchannel`, {
          withCredentials: true,
        });
        dispatch(setChannelData(result.data));
        console.log("Current channel:", result.data);
      } catch (error) {
        console.error("Error fetching current channel:", error);
        dispatch(setChannelData(null));
      }
    };
    fetchChannel();
  }, [dispatch]);

  // ✅ Fetch all channels
  useEffect(() => {
    const fetchAllChannels = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/allchannel`, {
          withCredentials: true,
        });
        dispatch(setAllChannelData(result.data));
        console.log("Fetched channels:", result.data);
      } catch (error) {
        console.error("Error fetching all channels:", error);
        dispatch(setAllChannelData(null));
      }
    };
    fetchAllChannels();
  }, [dispatch]);

  // ✅ Return nothing (used as data loader)
  return null;
};

export default GetChannelData;
