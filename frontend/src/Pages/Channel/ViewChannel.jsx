import React from 'react'
import { useSelector } from 'react-redux'
import create from "../../assets/create.png"
import { useNavigate } from 'react-router-dom'

const ViewChannel = () => {
  const {channelData} = useSelector(state=>state.user)
  const navigate = useNavigate()
  return (
    <div className='flex flex-col gap-3'>
       {/* banner */}
        <div className='w-full h-50 bg-gray-700 mb-10 mt-10 rounded-lg border-1 border-gray-500'>
          {channelData?.banner ? (
            <img src={channelData?.banner} className='w-full h-full object-cover rounded-lg'/>
          ):(
            <div className='w-full h-full bg-gradient-to-r from-gray-800 to-gray-900'>

            </div>
          )
          }
        </div>
        <div className='px-10 py-8'>
            <div className='flex flex-col items-center'>
                <img src={channelData?.avatar} className='w-28 h-28 rounded-full object-cover border-4 border-gray-500' alt="" />
                <h1 className='text-2xl font-bold mt-3'>{channelData?.name}</h1>
                <p className='text-gray-400'>{channelData?.owner?.email}</p>
                <p className='text-sm text-gray-400 mt-1'>More about this channel... <span className='text-orange-400 cursor-pointer'>{channelData?.category}</span></p>
                <div className='flex gap-4 mt-4'>
                  <button className='bg-white text-black px-4 py-1 rounded-full font-medium cursor-pointer active:bg-gray-900 active:text-white' onClick={()=>navigate("/updatechannel")}>Customize channel</button>
                  <button className='bg-[#272727] px-4 py-1 rounded-full font-medium cursor-pointer active:bg-gray-200 active:text-black'>Manage Videos</button>
                </div>
            </div>
            <div className='flex flex-col items-center mt-16'>
              <img src={create} className='w-20' alt="" />
              <p className='mt-4 font-medium'>Create content on any device</p>
              <p className='text-gray-400 text-sm text-center'>Upload and record at home or on the go. Everything youu make public will appear here.</p>
              <button className='cursor-pointer bg-white text-black mt-4 px-5 py-1 rounded-full font-medium'>+ Create</button>
            </div>
        </div>
    </div>
  )
}

export default ViewChannel
