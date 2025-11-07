import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const GetCurrentUser = () => {

    const dispatch = useDispatch()
    const {channelData} = useSelector(state => state.user)

 useEffect(()=>{
    const fetchUser = async ()=>{
        try {
            const result = await axios.get(serverUrl + "/api/user/getuser", {withCredentials:true})
            dispatch(setUserData(result.data))
            console.log(result.data)
        } catch (error) {
            console.log(error)
             dispatch(setUserData(null))
        }
    }
    fetchUser()
 },[channelData])
}

export default GetCurrentUser

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setUserData } from "../redux/userSlice";
// import { serverUrl } from "../App";

// const GetCurrentUser = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`${serverUrl}/api/user/getuser`, {
//           withCredentials: true,
//         });

//         if (res.data && res.data._id) {
//           dispatch(setUserData(res.data));
//         } else {
//           dispatch(setUserData(null));
//         }
//       } catch (error) {
//         dispatch(setUserData(null));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [dispatch]);

//   return { loading };
// };

// export default GetCurrentUser;
