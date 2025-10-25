import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import { serverUrl } from '../../App'
import VideoCard from '../../component/VideoCard'
import ShortCard from '../../component/ShortCard'
import PlaylistCard from '../../component/PlaylistCard'
import PostCard from '../../component/PostCard'

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

const ChannelPage = () => {
    const { channelId } = useParams()
    const { allChannelData, userData } = useSelector(state => state.user)

    const channel = allChannelData?.find(c => c._id.toString() === channelId)
    const [channelState, setChannelState] = useState(channel)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("Videos")

 const { allVideosData } = useSelector(state => state.content)
     const [durations, setDurations] = useState({}) // <-- should be object, not string
    
      useEffect(() => {
        if (Array.isArray(allVideosData) && allVideosData.length > 0) {
          allVideosData.forEach((video) => {
            getVideoDuration(video.videoUrl, (formattedTime) => {
              setDurations((prev) => ({
                ...prev,
                [video._id]: formattedTime,
              }))
            })
          })
        }
      }, [allVideosData])

    // Update isSubscribed on load or when channelState changes
    useEffect(() => {
        if (!channelState || !userData) return
        setIsSubscribed(channelState.subscribers?.some(
            sub => (sub?._id ?? sub)?.toString() === userData._id?.toString()
        ))
    }, [channelState, userData])

    const handleSubscribe = async (channelId) => {
        if (!channelId) return
        setLoading(true)
        try {
            const res = await axios.post(
                `${serverUrl}/api/user/togglesubscribe`,
                { channelId },
                { withCredentials: true }
            )
            setChannelState(res.data)
            setIsSubscribed(res.data.subscribers?.some(
                sub => (sub?._id ?? sub)?.toString() === userData._id?.toString()
            ))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!channelState) {
        return (
            <div className="text-white min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Loading channel...</p>
            </div>
        )
    }

    return (
        <div className='text-white min-h-screen pt-4 sm:pt-6'>
            {/* Banner */}
            <div className='relative'>
                <img
                    src={channelState?.banner || '/default-banner.jpg'}
                    className='w-full h-48 sm:h-60 md:h-72 object-cover'
                    alt={`${channelState?.name} Banner`}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
            </div>

            {/* Channel Info */}
            <div className='relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl flex-wrap'>
                <div className='flex-shrink-0'>
                    <img
                        src={channelState?.avatar}
                        className='rounded-full w-24 h-24 sm:w-28 sm:h-28 border-4 border-gray-800 shadow-lg hover:scale-105 hover:ring-4 hover:ring-orange-600 transition-transform duration-300'
                        alt=""
                    />
                </div>
                <div className='flex-1 text-center sm:text-left'>
                    <h1 className='text-2xl sm:text-3xl font-extrabold tracking-wide'>{channelState?.name}</h1>
                    <p className='text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base'>
                        <span className='font-semibold text-white'>{channelState?.subscribers?.length}</span>{" "}Subscribers •{" "}
                        <span className='font-semibold text-white'>{channelState?.videos?.length}</span>{" "}Videos
                    </p>
                    <p className='text-gray-300 text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2'>{channelState?.category}</p>
                </div>

                <button
                    className={`mt-2 sm:mt-0 text-xs sm:text-sm px-4 py-2 rounded-full ${isSubscribed
                        ? "bg-black text-white border border-gray-700"
                        : "bg-white text-black"
                        }`}
                    onClick={() => handleSubscribe(channelState?._id)}
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={16} color="gray" /> : isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>
            </div>

            {/* Tabs */}
            <div className='flex flex-wrap sm:flex-nowrap gap-4 sm:gap-8 px-4 sm:px-6 border-b border-gray-800 mb-6'>
                {["Videos", "Shorts", "Playlists", "CommunityPosts"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 sm:pb-3 relative font-medium transition ${activeTab === tab
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className='absolute bottom-0 left-0 right-0 h-[2px] bg-orange-600 rounded-full'></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className='px-4 sm:px-6 space-y-8'>
                {activeTab === "Videos" && (
                    <div className='flex flex-wrap gap-4 sm:gap-5 pb-10 justify-center sm:justify-start'>
                        {channelState.videos?.map((v) => (
                            <VideoCard
                                key={v._id}
                                id={v._id}
                                thumbnail={v.thumbnail}
                                  duration={durations[v?._id] || "0:00"} // ✅ correct access
                                channelLogo={channelState.avatar}
                                title={v.title}
                                channelName={channelState.name}
                                views={v.views}
                                className='w-[150px] sm:w-[200px] md:w-[220px]'
                            />
                        ))}
                    </div>
                )}

                {activeTab === "Shorts" && (
                    <div className='flex flex-col items-center gap-4 justify-center sm:justify-start'>
                        {channelState.shorts?.map((short) => (
                            <ShortCard
                                key={short._id}
                                id={short._id}
                                shortUrl={short.shortUrl || short._id}
                                title={short.title}
                                channelName={channelState.name}
                                views={short.views}
                                avatar={channelState.avatar}
                                className='w-[150px] sm:w-[180px] md:w-[200px]'
                            />
                        ))}
                    </div>
                )}

                {activeTab === "Playlists" && (
                  <div className='flex gap-5 flex-wrap'>
                    {channel.playlists?.map((p)=>(
                        <PlaylistCard
                        key={p._id}
                        id={p._id}
                        title={p.title}
                        videos={p.videos}
                        saveBy={p.saveBy}
                        />
                    ))

                    }
                  </div>
                )}

                {activeTab === "CommunityPosts" && (
                    <div className='flex gap-5 flex-wrap'>
                        {channel?.communityPosts?.map((p)=>(
                            <PostCard
                            key={p._id}
                         post={p}
                            />
                        ))

                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChannelPage
