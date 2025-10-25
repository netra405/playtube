import React, { useState } from 'react'
import { FaListUl, FaTimes, FaBookmark } from "react-icons/fa"
import VideoCard from './VideoCard'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'

const PlaylistCard = ({ id, title, videos, saveBy }) => {
    const thumbnail = videos[0]?.thumbnail
    const [showVideos, setShowVideos] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [isSaved, setIsSaved] = useState(saveBy?.some(uid => uid.toString() === userData?._id) || false)
    const [loading, setLoading] = useState(false)

    const handleSaved = async () => {
        if (!userData) return
        setLoading(true)
        try {
            const result = await axios.post(
                `${serverUrl}/api/content/playlist/toggle-save`,
                { playlistId: id },
                { withCredentials: true }
            )
            const updatedSave = result.data.saveBy?.some(uid => uid.toString() === userData._id)
            setIsSaved(updatedSave)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Playlist Card */}
            <div className='relative w-52 sm:w-60 md:w-64 lg:w-72 h-40 rounded-xl overflow-hidden group shadow-lg bg-gray-900 flex-shrink-0'>
                <img
                    src={thumbnail}
                    alt={title}
                    className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                />

                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-center p-3'>
                    <h3 className='font-semibold text-white truncate'>{title}</h3>
                    <p className='text-gray-300 text-sm'>{videos?.length} videos</p>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSaved}
                    disabled={loading}
                    className={`absolute top-2 right-2 p-2 rounded-full transition border border-gray-700
                        ${isSaved ? "bg-white text-black hover:bg-gray-300" : "bg-black/70 text-white hover:bg-black"}`}
                >
                    <FaBookmark size={16} />
                </button>

                {/* Show Videos Button */}
                <button
                    onClick={() => setShowVideos(true)}
                    className='absolute bottom-2 right-2 bg-black/70 p-2 rounded-full text-white hover:bg-black transition'
                >
                    <FaListUl size={16} />
                </button>
            </div>

            {/* Modal for Playlist Videos */}
        {/* Modal for Playlist Videos */}
{showVideos && (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-start md:items-center z-50 overflow-y-auto'>
        <div className='bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl w-11/12 sm:w-10/12 md:w-5/6 lg:w-4/5 max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative border border-gray-700 mt-8 md:mt-0'>
            {/* Close Button */}
            <button
                onClick={() => setShowVideos(false)}
                className='absolute top-4 right-4 text-gray-400 hover:text-white transition'
            >
                <FaTimes size={24} />
            </button>

            {/* Title */}
            <h2 className='text-xl sm:text-2xl font-extrabold mb-3 text-white flex items-center gap-2'>
                {title} <span className='text-gray-400 font-normal text-sm sm:text-base'>- videos</span>
            </h2>

            <div className='h-[2px] bg-orange-600 mb-6 rounded-full'></div>

            {/* Videos */}
            <div className='flex flex-wrap hide-scrollbar md:flex-nowrap gap-4 sm:gap-5 md:overflow-x-auto justify-center'>
                {videos?.map(v => (
                    <VideoCard
                        key={v._id}
                        id={v._id}
                        thumbnail={v.thumbnail}
                        channelLogo={v.channel?.avatar}
                        title={v.title}
                        channelName={v.channel?.name}
                        views={v.views}
                        className='w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px] flex-shrink-0'
                    />
                ))}
            </div>
        </div>
    </div>
)}

        </>
    )
}

export default PlaylistCard
