import React, { useEffect, useState } from 'react'
import ChannelCard from './ChannelCard'
import VideoCard from './VideoCard'
import ShortCard from './ShortCard'
import PlaylistCard from './PlaylistCard'

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

const SearchResults = ({ searchResults }) => {
  const [duration, setDuration] = useState({}) // ✅ should be object

  useEffect(() => {
    if (Array.isArray(searchResults?.videos) && searchResults.videos.length > 0) {
      searchResults.videos.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({
            ...prev,
            [video._id]: formattedTime,
          }))
        })
      })
    }
  }, [searchResults?.videos])

  const isEmpty =
    (!searchResults?.videos || searchResults.videos.length === 0) &&
    (!searchResults?.shorts || searchResults.shorts.length === 0) &&
    (!searchResults?.channels || searchResults.channels.length === 0) &&
    (!searchResults?.playlists || searchResults.playlists.length === 0)

  return (
    <div className='px-6 py-4 bg-[#00000051] border border-gray-800 mb-[20px]'>
      <h2 className='text-2xl font-bold mb-4'>Search Results :</h2>

      {isEmpty ? (
        // ❌ "P" tag not valid JSX — should be lowercase
        <p className='text-gray-400 text-lg'>No results found</p>
      ) : (
        <>
          {searchResults.channels?.length > 0 && (
            <div className='mb-12'>
              <h3 className='text-xl font-bold mb-4'>Channels</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {searchResults.channels.map((ch) => (
                  <ChannelCard
                    key={ch?._id}
                    id={ch?._id}
                    name={ch?.name}
                    avatar={ch?.avatar}
                  />
                ))}
              </div>
            </div>
          )}

          {searchResults.videos?.length > 0 && (
            <div>
              <h3 className='text-xl font-bold mb-4'>Videos</h3>
              <div className='flex flex-wrap gap-6 mb-12'>
                {searchResults.videos.map((video) => (
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

          {searchResults.shorts?.length > 0 && (
            <div className='mt-8'>
              <h3 className='text-xl font-bold mb-4'>Shorts</h3>
              <div className='flex gap-4 overflow-x-auto pb-4 hide-scrollbar'>
                {searchResults.shorts.map((short) => (
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

          {searchResults.playlists?.length > 0 && (
            <div className='mt-8'>
              <h3 className='text-xl font-bold mb-4'>Playlists</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {searchResults.playlists.map((pl) => (
                  <PlaylistCard
                    key={pl?._id}
                    id={pl?._id}
                    title={pl?.title}
                    videos={pl?.videos}
                    saveBy={pl?.saveBy}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchResults
