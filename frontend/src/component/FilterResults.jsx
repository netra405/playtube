import React, { useEffect, useState } from 'react'
import VideoCard from './VideoCard'
import ShortCard from './ShortCard'

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

const FilterResults = ({ filterResults }) => {
  const [duration, setDuration] = useState({}) // ✅ should be object

  useEffect(() => {
    if (Array.isArray(filterResults?.videos) && filterResults.videos.length > 0) {
      filterResults.videos.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({
            ...prev,
            [video._id]: formattedTime,
          }))
        })
      })
    }
  }, [filterResults?.videos])

  const isEmpty =
    (!filterResults?.videos || filterResults.videos.length === 0) &&
    (!filterResults?.shorts || filterResults.shorts.length === 0) 
 
  return (
    <div className='px-6 py-4 bg-[#00000051] border border-gray-800 mb-[20px]'>
      <h2 className='text-2xl font-bold mb-4'>Filter Results :</h2>

      {isEmpty ? (
        // ❌ "P" tag not valid JSX — should be lowercase
        <p className='text-gray-400 text-lg'>No results found</p>
      ) : (
        <>

          {filterResults.videos?.length > 0 && (
            <div>
              <h3 className='text-xl font-bold mb-4'>Videos</h3>
              <div className='flex flex-wrap gap-6 mb-12'>
                {filterResults.videos.map((video) => (
                  <VideoCard
                    key={video?._id}
                    thumbnail={video?.thumbnail}
                    duration={duration[video._id] || "0:00"}
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

          {filterResults.shorts?.length > 0 && (
            <div className='mt-8'>
              <h3 className='text-xl font-bold mb-4'>Shorts</h3>
              <div className='flex gap-4 overflow-x-auto pb-4 hide-scrollbar'>
                {filterResults.shorts.map((short) => (
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

        </>
      )}
    </div>
  )
}

export default FilterResults
