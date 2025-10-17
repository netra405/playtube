import React from 'react'
import { useSelector } from 'react-redux'
import create from "../../assets/create.png"
import { useNavigate } from 'react-router-dom'

const ViewChannel = () => {
  const { channelData } = useSelector(state => state.user)
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-6 w-full bg-[#0f0f0f] text-white min-h-screen">
      {/* Banner Section */}
      <div className="w-full h-40 sm:h-56 md:h-64 lg:h-72 mt-6 rounded-lg border border-gray-600 overflow-hidden">
        {channelData?.banner ? (
          <img
            src={channelData.banner}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
        )}
      </div>

      {/* Channel Info Section */}
      <div className="px-4 sm:px-8 md:px-12 py-6 sm:py-10">
        <div className="flex flex-col items-center text-center">
          <img
            src={channelData?.avatar}
            alt="Channel Avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-500"
          />
          <h1 className="text-2xl sm:text-3xl font-bold mt-4">{channelData?.name}</h1>
          <p className="text-gray-400 text-sm sm:text-base">{channelData?.owner?.email}</p>
          <p className="text-sm sm:text-base text-gray-400 mt-2">
            More about this channel...{" "}
            <span className="text-orange-400 cursor-pointer">{channelData?.category}</span>
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              className="bg-white text-black px-5 py-2 rounded-full font-medium cursor-pointer hover:bg-gray-200 transition"
              onClick={() => navigate("/updatechannel")}
            >
              Customize Channel
            </button>
            <button className="bg-[#272727] px-5 py-2 rounded-full font-medium cursor-pointer hover:bg-[#3a3a3a] transition">
              Manage Videos
            </button>
          </div>
        </div>

        {/* Create Section */}
        <div className="flex flex-col items-center mt-16 px-4 text-center">
          <img src={create} className="w-16 sm:w-20" alt="Create" />
          <p className="mt-4 font-medium text-base sm:text-lg">
            Create content on any device
          </p>
          <p className="text-gray-400 text-sm sm:text-base mt-1 max-w-md">
            Upload and record at home or on the go. Everything you make public will appear here.
          </p>
          <button
            onClick={() => navigate("/create")}
            className="cursor-pointer bg-white text-black mt-5 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
          >
            + Create
          </button>
        </div>
      </div>
    </div>

  )
}

export default ViewChannel
