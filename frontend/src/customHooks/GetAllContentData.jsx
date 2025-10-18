import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setAllShortsData, setAllVideosData } from '../redux/contentSlice'

const GetAllContentData = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAllVideos = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/content/getallvideos", { withCredentials: true })
                dispatch(setAllVideosData(result.data))
                console.log(result.data)
            } catch (error) {
                console.log(error)
                dispatch(setAllVideosData(null))
            }
        }
        fetchAllVideos()
    }, [])


     useEffect(() => {
        const fetchAllShorts = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/content/getallshorts", { withCredentials: true })
                dispatch(setAllShortsData(result.data))
                console.log(result.data)
            } catch (error) {
                console.log(error)
                dispatch(setAllShortsData(null))
            }
        }
        fetchAllShorts()
    }, [])


}



export default GetAllContentData
