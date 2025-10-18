import axios from 'axios'
import React, { useState } from 'react'
import { serverUrl } from '../../App'
import { showCustomAlert } from '../../component/CustomAlert'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import { setAllShortsData } from '../../redux/contentSlice'
import { setChannelData } from '../../redux/userSlice'

const CreateVideo = () => {

  const {channelData} = useSelector(state=>state.user)
  const {allVideosData} = useSelector(state=>state.content)
  const [videoUrl, setVideoUrl] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleVideo = (e)=>{
    setVideoUrl(e.target.files[0])
  }
  const handleThumbnail = (e)=>{
    setThumbnail(e.target.files[0])
  }

  const handleUploadVideo = async ()=> {
    setLoading(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("tags", JSON.stringify(tags.split(",").map(tag => tag.trim())))
    formData.append("video", videoUrl)
    formData.append("thumbnail", thumbnail)
    formData.append("channelId", channelData._id)
    try {
      const result = await axios.post(serverUrl + "/api/content/create-video", formData, {withCredentials:true})
      console.log(result.data)
      showCustomAlert("Upload Video Successfully")
      setLoading(false)
      navigate("/")
      dispatch(setAllShortsData([...allVideosData , result.data]))
      const updatechannel = {
        ...channelData ,videos : [...(channelData.videos || []), result.data]
      }
      dispatch(setChannelData(updatechannel))
      
    } catch (error) {
      console.log(error)
      showCustomAlert(error.response.data.message)
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-[8vh] bg-[#0f0f0f] text-white flex flex-col pt-5'>
      <div className='flex flex-1 justify-center items-center px-4 py-6'>
        <div className='bg-[#212121] p-6 rounded-xl w-fll max-w-2xl shadow-lg space-y-6'>
            <label htmlFor="video" className='cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-1 hover:border-orange-500 transition'>
                <input onChange={handleVideo} type="file" id='video' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none' accept='video/*'/>
            </label>
                <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Title*' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none'/>
                <textarea onChange={(e)=>setDescription(e.target.value)} value={description} placeholder='Description*' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none'/>
                <input onChange={(e)=>setTags(e.target.value)} value={tags} type="text" placeholder='Tags*' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none'/>
            <label htmlFor="thumbnail" className='block cursor-pointer'>
              {
                thumbnail ? (
                <img src={URL.createObjectURL(thumbnail)} className='w-full rounded-lg border border-gray-700 mb-2 object-cover'/>) 
                : (
                
                <div className='w-full h-32 bg-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-gray-700 mb-2'>
                    Click to upload thumbnail
                </div>
              )
              }
                <input onChange={handleThumbnail} type="file" id='thumbnail' className='hidden' accept='image/*'/>
            </label>

              <button onClick={handleUploadVideo} className='w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center' disabled={!title || ! description || !tags || loading}>{loading ? <ClipLoader size={20} color='black'/> : "Upload Video"}</button>
              {loading && <p className='text-center text-gray-300 text-sm animate-pulse'>Video Uploading.... please wait...</p>}
        </div>
      </div>
    </div>
  )
}

export default CreateVideo
