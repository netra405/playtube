// ✅ SavedContent.jsx
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

const SavedContent = () => {
    const [savedVideos, setSavedVideos] = useState([])
    const [savedShorts, setSavedShorts] = useState([])
    const [loading, setLoading] = useState(true)
    const [durations, setDurations] = useState({})

    useEffect(() => {
        const fetchSavedContent = async () => {
            setLoading(true)
            try {
                const resVideos = await axios.get(`${serverUrl}/api/content/savedvideo`, { withCredentials: true });
                const resShorts = await axios.get(`${serverUrl}/api/content/savedshort`, { withCredentials: true });




                const videos = resVideos.data?.videos || resVideos.data || []
                const shorts = resShorts.data?.shorts || resShorts.data || []

                setSavedVideos(videos)
                setSavedShorts(shorts)
            } catch (err) {
                console.error("❌ Failed to fetch saved content:", err)
                setSavedVideos([])
                setSavedShorts([])
            } finally {
                setLoading(false)
            }
        }

        fetchSavedContent()
    }, [])

    useEffect(() => {
        if (Array.isArray(savedVideos) && savedVideos.length > 0) {
            savedVideos.forEach((v) => {
                getVideoDuration(v.videoUrl, (formattedTime) => {
                    setDurations((prev) => ({
                        ...prev,
                        [v._id]: formattedTime,
                    }))
                })
            })
        }
    }, [savedVideos])

    return (
        <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px] text-white">
            {loading && <p className="text-gray-400">Loading...</p>}

            {!loading && savedShorts.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mb-6 pt-[10px] border-b border-gray-300 pb-2 flex items-center gap-2">
                        <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
                        Saved Shorts
                    </h2>

                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        {savedShorts.map((short) => (
                            <div key={short._id} className="flex-shrink-0">
                                <ShortCard
                                    shortUrl={short.shortUrl}
                                    title={short.title}
                                    channelName={short?.channel?.name ?? short?.channel?.owner?.userName}
                                    views={short.views}
                                    id={short._id}
                                    avatar={short?.channel?.avatar ?? short?.channel?.owner?.photoUrl}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {!loading && savedVideos.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mb-6 pt-[10px] border-b border-gray-300 pb-2 flex items-center gap-2">
                        <GoVideo className="w-7 h-7 text-orange-600" />
                        Saved Videos
                    </h2>

                    <div className="flex flex-wrap gap-6 mb-6">
                        {savedVideos.map((video) => (
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
                        ))}
                    </div>
                </>
            )}

            {!loading && savedShorts.length === 0 && savedVideos.length === 0 && (
                <p className="text-gray-400 mt-6">You haven’t saved any videos or shorts yet.</p>
            )}
        </div>
    )
}

export default SavedContent
