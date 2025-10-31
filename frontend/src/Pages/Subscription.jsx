import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SiYoutubeshorts } from "react-icons/si"
import { GoVideo } from "react-icons/go"
import ShortCard from '../component/ShortCard'
import VideoCard from '../component/VideoCard'
import PlaylistCard from '../component/PlaylistCard'
import {FaList} from "react-icons/fa"
import PostCard from '../component/PostCard'
import {RiUserCommunityFill} from "react-icons/ri"

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

const Subscription = () => {
    const {
        subscribedChannel = [],
        subscribedShorts = [],
        subscribedVideos = [],
        subscribedPlaylists = [],
        subscribedPosts = []
    } = useSelector(state => state.user)

    const navigate = useNavigate()
    const [durations, setDurations] = useState({})

    useEffect(() => {
        if (Array.isArray(subscribedVideos) && subscribedVideos.length > 0) {
            subscribedVideos.forEach((v) => {
                getVideoDuration(v.videoUrl, (formattedTime) => {
                    setDurations((prev) => ({
                        ...prev,
                        [v._id]: formattedTime,
                    }))
                })
            })
        }
    }, [subscribedVideos])

    return (
        <div className='px-6 py-4 min-h-screen'>
            {/* Channel List */}
            {subscribedChannel.length > 0 ? (
                <>
                    <div className='flex gap-6 overflow-x-auto pb-6 hide-scrollbar pt-[30px]'>
                        {subscribedChannel.map(ch => (
                            <div
                                key={ch?._id}
                                className='flex flex-col items-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200'
                                onClick={() => navigate(`/channelpage/${ch?._id}`)}
                            >
                                <img
                                    src={ch?.avatar}
                                    className='w-18 h-18 rounded-full border-2 border-gray-600 object-cover shadow-md'
                                    alt={ch?.name || "Channel Avatar"}
                                />
                                <span className='mt-2 text-sm text-gray-300 font-medium text-center truncate w-20'>
                                    {ch?.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Subscribed Shorts */}
                    <h2 className='text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2'>
                        <SiYoutubeshorts className='w-7 h-7 text-orange-600' /> Subscribed Shorts
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        {subscribedShorts.length > 0 ? (
                            subscribedShorts.map((short) => (
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
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">No shorts from subscribed channels yet.</p>
                        )}
                    </div>

                    {/* Subscribed Videos */}
                    <h2 className='text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2'>
                        <GoVideo className='w-7 h-7 text-orange-600' /> Subscribed Videos
                    </h2>
                    <div className="flex flex-wrap pb-4 gap-6">
                        {subscribedVideos.length > 0 ? (
                            subscribedVideos.map((video) => (
                                <div key={video._id} className="flex-shrink-0">
                                    <VideoCard
                                        thumbnail={video.thumbnail}
                                        duration={durations[video._id] || "0:00"}
                                        channelLogo={video.channel?.avatar ?? video.channel?.owner?.photoUrl}
                                        title={video.title}
                                        channelName={video.channel?.name ?? video.channel?.owner?.userName}
                                        views={video.views}
                                        id={video._id}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">No videos from subscribed channels yet.</p>
                        )}

                     
                    </div>
                       {subscribedPlaylists.length > 0 ? (
                            <>
                                <h2 className="text-2xl font-bold mb-6 pt-[10px] border-b border-gray-300 pb-2 flex items-center gap-2">
                                    <FaList className="w-7 h-7 text-red-600" />
                                    Subscribed Playlists
                                </h2>

                                <div className='flex flex-wrap gap-6'>
                                    {subscribedPlaylists?.map((pl) => (
                                        <PlaylistCard
                                            key={pl?._id}
                                            id={pl?._id}
                                            title={pl?.title}
                                            videos={pl?.videos}
                                            saveBy={pl?.saveBy}
                                        />
                                    ))}
                                </div></>
                        ) : (
                            <p className="text-gray-400 mt-6 text-center">
                               No playlists from subscribed channels yet.
                            </p>
                        )}

                         {subscribedPosts.length > 0 ? (
                            <>
                                <h2 className="text-2xl font-bold mb-6 pt-[10px] border-b border-gray-300 pb-2 flex items-center gap-2">
                                    <RiUserCommunityFill className="w-7 h-7 text-red-600" />
                                    Subscribed Posts
                                </h2>

                                <div className='flex flex-wrap gap-6'>
                                    {subscribedPosts?.map((p) => (
                                         <PostCard key={p._id} post={p} />
                                    ))}
                                </div></>
                        ) : (
                            <p className="text-gray-400 mt-6 text-center">
                               No communityPosts from subscribed channels yet.
                            </p>
                        )}
                </>
            ) : (
                <p className="text-gray-400 mt-6 text-center">
                    You haven’t subscribed to any channels yet.
                </p>
            )}
        </div>
    )
}

export default Subscription
