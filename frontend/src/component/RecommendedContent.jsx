import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import VideoCard from './VideoCard'
import ShortCard from './ShortCard'
import { SiYoutubeshorts } from 'react-icons/si'

// Safely get video duration and release WebMediaPlayer
const getVideoDuration = (url) => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = url

    video.onloadedmetadata = () => {
      const totalSeconds = Math.floor(video.duration)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`)

      // release player
      video.src = ''
      video.load()
    }

    video.onerror = () => resolve('0:00')
  })
}

// Limit number of concurrent video metadata fetches
const fetchDurationsWithLimit = async (videos, limit = 3) => {
  const results = {}
  let index = 0

  const workers = Array.from({ length: limit }).map(async () => {
    while (index < videos.length) {
      const currentIndex = index
      index++
      const video = videos[currentIndex]
      if (video?.videoUrl) {
        const dur = await getVideoDuration(video.videoUrl)
        results[video._id] = dur
      }
    }
  })

  await Promise.all(workers)
  return results
}

const RecommendedContent = () => {
  const { recommendedContent } = useSelector((state) => state.user)
  const [duration, setDuration] = useState({})

  const allVideos = [
    ...(recommendedContent?.recommendedVideos || []),
    ...(recommendedContent?.remainingVideos || []),
  ]

  const allShorts = [
    ...(recommendedContent?.recommendedShorts || []),
    ...(recommendedContent?.remainingShorts || []),
  ]

  // Fetch durations safely
  useEffect(() => {
    let isMounted = true
    if (allVideos.length > 0) {
      fetchDurationsWithLimit(allVideos, 3).then((res) => {
        if (isMounted) setDuration(res)
      })
    }
    return () => {
      isMounted = false
    }
  }, [allVideos])

  if (!allVideos.length && !allShorts.length) return null

  return (
    <div className='px-6 py-4 mb-[20px]'>
      {allVideos.length > 0 && (
        <div>
          <h3 className='text-xl font-bold mb-4'>Videos</h3>
          <div className='flex flex-wrap gap-6 mb-12'>
            {allVideos.map((video) => (
              <VideoCard
                key={video?._id}
                thumbnail={video?.thumbnail}
                duration={duration[video._id] || '0:00'}
                channelLogo={video?.channel?.avatar}
                title={video?.title}
                channelName={video?.channel?.name}
                views={`${video?.views}`}
                id={video?._id}
              />
            ))}
          </div>
        </div>
      )}

      {allShorts.length > 0 && (
        <div className='mt-8'>
          <h3 className='text-xl font-bold flex items-center mb-4'>
            <SiYoutubeshorts className='w-6 h-6 text-orange-600 mr-2' /> Shorts
          </h3>
          <div className='flex gap-4 overflow-x-auto pb-4 hide-scrollbar'>
            {allShorts.map((short) => (
              <div key={short?._id} className='flex-shrink-0'>
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
        </div>
      )}
    </div>
  )
}

export default RecommendedContent
