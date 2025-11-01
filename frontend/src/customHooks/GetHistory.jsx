import axios from 'axios'
import React from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setShortHistory, setVideoHistory } from '../redux/userSlice'
import { useEffect } from 'react'

const GetHistory = () => {
   const dispatch = useDispatch()

 useEffect(()=>{
    const fetchHistory = async ()=>{
        try {
            const result = await axios.get(serverUrl + "/api/user/gethistory", {withCredentials:true})
            const history = result.data
            const Videos = history.filter((v)=>v.contentType ===  "Video")
            const Shorts = history.filter((v)=>v.contentType ===  "Short")
            dispatch(setVideoHistory(Videos))
            dispatch(setShortHistory(Shorts))
            console.log({Videos , Shorts})
        } catch (error) {
            console.log(error)
               dispatch(setVideoHistory(null))
            dispatch(setShortHistory(null))
        }
    }
    fetchHistory()
 },[])
}

export default GetHistory
