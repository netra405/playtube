import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import VideoCard from './VideoCard'

// Lazily get video duration and release the element immediately
const getVideoDuration = async (url) => {
  return new Promise((resolve) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    video.src = url

    video.onloadedmetadata = () => {
      const totalSeconds = Math.floor(video.duration)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`)

      // Release the WebMediaPlayer immediately
      video.src = ""
      video.load()
    }

    video.onerror = () => resolve("0:00")
  })
}

const AllVideosPage = () => {
  const { allVideosData } = useSelector((state) => state.content)
  const [durations, setDurations] = useState({})

  useEffect(() => {
    let isMounted = true

    const fetchDurations = async () => {
      if (Array.isArray(allVideosData) && allVideosData.length > 0) {
        for (const video of allVideosData) {
          const duration = await getVideoDuration(video.videoUrl)
          if (isMounted) {
            setDurations((prev) => ({
              ...prev,
              [video._id]: duration,
            }))
          }
        }
      }
    }

    fetchDurations()

    return () => {
      isMounted = false
    }
  }, [allVideosData])

  return (
    <div className='flex flex-wrap gap-6 md:justify-start mb-12 items-center justify-center'>
      {allVideosData?.map((video) => (
        <VideoCard
          key={video?._id}
          duration={durations[video?._id] || "0:00"}
          thumbnail={video?.thumbnail}
          title={video?.title}
          channelLogo={video?.channel?.avatar}
          channelName={video?.channel?.name}
          id={video?._id}
          views={video?.views}
        />
      ))}
    </div>
  )
}

export default AllVideosPage
