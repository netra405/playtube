// ...existing code...
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { SiYoutubeshorts } from "react-icons/si"
import { GoVideo } from "react-icons/go"
import ShortCard from '../component/ShortCard'
import VideoCard from '../component/VideoCard'


const getVideoDuration = (url, callback) => {
  const video = document.createElement("video")
  video.preload = "metadata"
  video.src = url

  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`)
  }

  video.onerror = () => {
    callback("0:00")
  }
}


const LikedContent = () => {
  const [likedVideo, setLikedVideo] = useState([])
  const [likedShort, setLikedShort] = useState([])
  const [loading, setLoading] = useState(true)
  const [duration, setDuration] = useState({}) // <-- should be object, not string
  
    useEffect(() => {
      if (Array.isArray(likedVideo) && likedVideo.length > 0) {
        likedVideo.forEach((video) => {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDuration((prev) => ({
              ...prev,
              [video._id]: formattedTime,
            }))
          })
        })
      }
    }, [likedVideo])

  useEffect(() => {
    const fetchLikedContent = async () => {
      setLoading(true)
      try {
        const resVideo = await axios.get(`${serverUrl}/api/content/likedvideo`, { withCredentials: true })
        const videos = Array.isArray(resVideo.data) ? resVideo.data : (resVideo.data?.videos ?? [])
        setLikedVideo(videos)

        const resShort = await axios.get(`${serverUrl}/api/content/likedshort`, { withCredentials: true })
        const shorts = Array.isArray(resShort.data) ? resShort.data : (resShort.data?.shorts ?? [])
        setLikedShort(shorts)

        console.log('liked videos:', videos)
        console.log('liked shorts:', shorts)
      } catch (error) {
        console.error('Failed to fetch liked content:', error)
        setLikedVideo([])
        setLikedShort([])
      } finally {
        setLoading(false)
      }
    }
    fetchLikedContent()
  }, [])

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px] text-white">
      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && likedShort.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[10px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
            Liked Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {likedShort.map((short) => (
              <div key={short?._id} className="flex-shrink-0">
                <ShortCard
                  shortUrl={short?.shortUrl}
                  title={short?.title}
                  channelName={short?.channel?.name ?? short?.channel?.owner?.userName}
                  views={short?.views}
                  id={short?._id}
                  avatar={short?.channel?.avatar ?? short?.channel?.owner?.photoUrl}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && likedVideo.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[10px] border-b border-gray-300 pb-2 flex items-center gap-2"><GoVideo className="w-7 h-7 text-orange-600"/>Liked Videos</h2>
             <div className="flex flex-wrap gap-6">
            {likedVideo.map((video) => (
              <div key={video?._id} className="flex-shrink-0">
                <VideoCard
                key={video._id}
                thumbnail={video.thumbnail}
                duration={duration[video._id] || "0:00"}
                channelLogo={video.channel?.avatar}
                title={video.title}
                channelName={video.channel?.name}
                views={video.views}
                id={video._id}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && likedShort.length === 0 && likedVideo.length === 0 && (
        <p className="text-gray-400 mt-6">You haven't liked any videos or shorts yet.</p>
      )}
    </div>
  )
}

export default LikedContent
// ...existing code...