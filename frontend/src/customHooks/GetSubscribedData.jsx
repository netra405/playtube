import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import {
  setSubscribedChannels,
  setSubscribedPlaylists,
  setSubscribedPosts,
  setSubscribedShorts,
  setSubscribedVideos
} from '../redux/userSlice'

const GetSubscribedData = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchSubscribedData = async () => {
      try {
        console.log("Server URL is:", serverUrl)

        const result = await axios.get(`${serverUrl}/api/user/subscribed-data`, {
          withCredentials: true
        })

        const data = result.data
        console.log("Subscribed Data:", data)

        dispatch(setSubscribedChannels(data.subscribedChannels || []))
        dispatch(setSubscribedVideos(data.videos || []))
        dispatch(setSubscribedShorts(data.shorts || []))
        dispatch(setSubscribedPlaylists(data.playlists || []))
        dispatch(setSubscribedPosts(data.posts || []))
      } catch (error) {
        console.error("Error fetching subscribed data:", error)
      }
    }

    fetchSubscribedData()
  }, [dispatch])

  return null
}

export default GetSubscribedData
