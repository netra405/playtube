import React from 'react'
import logo from "../../assets/playtube1.png"
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../../App'
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showCustomAlert } from '../../component/CustomAlert';
import ClipLoader from 'react-spinners/ClipLoader';
import { useState } from 'react';
import { setChannelData } from '../../redux/userSlice';

const UpdateChannel = () => {

  const { channelData } = useSelector(state => state.user)
  const [step, setStep] = useState(1)
  const [avatar, setAvatar] = useState(null)
  const [banner, setBanner] = useState(null)
  const [channelName, setChannelName] = useState(channelData?.name)
  const [description, setDescription] = useState(channelData?.description)
  const [category, setCategory] = useState(channelData?.category)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleAvatar = (e) =>{
    setAvatar(e.target.files[0])
  }

  const handleBanner = (e) =>{
    setBanner(e.target.files[0])
  }

  const nextStep = ()=> {
    setStep((prev)=>prev+1)
  }
   const prevStep = ()=> {
    setStep((prev)=>prev-1)
  }


  const handleUpdateChannel = async ()=>{
    const formData = new FormData()
    formData.append("name", channelName)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("avatar", avatar)
    formData.append("banner", banner)
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/user/updatechannel", formData, {withCredentials:true})
      setLoading(false)
      console.log(result.data)
      dispatch(setChannelData(result.data))
      showCustomAlert("Channel Upadated")
      navigate("/")
    } catch (error) {
      setLoading(false)
        console.log(error)
      showCustomAlert(`Channel update error: ${error}`)
    }
  }

  return (
     <div className='w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col'>
      {/* Main Section */}
      <main className='flex flex-1 justify-center items-center px-4'>
        <div className='bg-[#212121] p-4 rounded-xl w-full max-w-lg shadow-lg'>

          {step === 1 && (
            <div>
              <h2 className='text-2xl font-semibold mb-4'>Customize channel</h2>
              <p className='text-sm text-gray-400 mb-6'>
                Choose your profile picture, channel name
              </p>

              <div className='flex flex-col items-center mb-6'>
                <label htmlFor="avatar" className='cursor-pointer flex flex-col items-center'>
                  {avatar ? 
                  (<img src={URL.createObjectURL(avatar)} className='w-20 h-20 rounded-2xl object-cover border-2 border-gray-600'/>)
                   : <div className='w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400'>
                    <FaUserCircle size={40} />
                  </div>}
                  <span className='text-orange-400 text-sm mt-2'>Upload Avatar</span>
                <input onChange={handleAvatar} id="avatar" type="file" className="hidden" accept='image/*' />
                </label>

              </div>
              <input onChange={(e)=>setChannelName(e.target.value)} value={channelName} type="text" placeholder='Channel Name' className='w-full p-2 mb-4 rounded-lg bg-[#121212] border border-gray-700 
              text-white focus:outline focus:ring-2 focus:ring-orange-500'/>


              <button onClick={nextStep} disabled={!channelName} className='w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition py-3 font-medium
              disabled:bg-gray-600  '>Continue</button>
              <span onClick={()=>navigate("/")} className='w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2'>Back to home</span>
            </div>
          )}


             {step === 2 && (
            <div>
              <h2 className='text-2xl font-semibold mb-4'>Your updated Channel</h2>
             
              <div className='flex flex-col items-center mb-6'>
                <label className='cursor-pointer flex flex-col items-center'>
                  {avatar ? 
                  (<img src={URL.createObjectURL(avatar)} className='w-20 h-20 rounded-2xl object-cover border-2 border-gray-600'/>)
                   : <div className='w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400'>
                    <FaUserCircle size={40} />
                  </div>}
                
             
                </label>
                <h2 className='mt-3 text-lg font-semibold'>{channelName}</h2>

              </div>

              <button onClick={nextStep} disabled={!channelName} className='w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition py-3 font-medium
              disabled:bg-gray-600  '>Continue and Customize Channel</button>
              <span onClick={prevStep} className='w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2'>Back</span>
            </div>
          )}


            {step === 3 && (
            <div>
              <h2 className='text-2xl font-semibold mb-4'>Customize Channel</h2>

              <div className='flex flex-col items-center mb-6'>
                <label htmlFor="banner" className='w-full cursor-pointer block mb-4'>
                  {banner ? 
                  (<img src={URL.createObjectURL(banner)} className='w-full h-32 rounded-lg mb-2 object-cover border border-gray-600'/>)
                   : <div className='w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 mb-2'>
                    Click to upload banner image
                  </div>}
                  <span className='text-orange-400 text-sm mt-2'>Upload Banner Image</span>
                <input onChange={handleBanner} id="banner" type="file" className="hidden" accept='image/*' />
                </label>

              </div>
              <textarea  placeholder='Channel Description'  onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 
              focus:ring-orange-500 '/>
              <input onChange={(e)=>setCategory(e.target.value)} value={category} type="text" placeholder='Channel Category' className='w-full 
              bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 p-3 mb-3 rounded-lg'/>


              <button onClick={handleUpdateChannel} disabled={!description || !category || loading} className='w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition py-3 font-medium
              disabled:bg-gray-600  '>{loading ? <ClipLoader color='black' size={20}/> : "Save and Customize Channel"}</button>
              <span onClick={prevStep} className='w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2'>Back</span>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default UpdateChannel
