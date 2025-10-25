import React, { useState } from 'react'
import { FaImage } from "react-icons/fa"
import { showCustomAlert } from '../../component/CustomAlert'
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import { serverUrl } from '../../App'
import { useNavigate } from 'react-router-dom'
import { setChannelData } from '../../redux/userSlice'
import ClipLoader from 'react-spinners/ClipLoader'

const CreatePost = () => {
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { channelData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleCreatePost = async () => {
    if (!content.trim()) {
      showCustomAlert("Post content is required!")
      return
    }

    const formData = new FormData()
    formData.append("channelId", channelData._id)
    formData.append("content", content)
    if (image) {
      formData.append("image", image)
    }

    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/create-post`,
        formData,
        { withCredentials: true }
      )

      const updatedChannel = {
        ...channelData,
        posts: [...(channelData.posts || []), result.data],
      }

      dispatch(setChannelData(updatedChannel))
      showCustomAlert("Post created successfully!")
      navigate("/")
    } catch (error) {
      console.error("Error creating post:", error)
      showCustomAlert(`Failed to create post: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5 items-center justify-center">
      <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-4">
        <textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none h-28"
          placeholder="Write something for your community..."
        />

        <label htmlFor="image" className="flex items-center space-x-3 cursor-pointer">
          <FaImage className="text-2xl text-gray-300" />
          <span className="text-gray-300">Add Image (optional)</span>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            className="hidden"
            id="image"
            accept="image/*"
          />
        </label>

        {image && (
          <div className="mt-3 flex items-center justify-center">
            <img
              src={URL.createObjectURL(image)}
              className="rounded-lg max-h-64 object-cover"
              alt="preview"
            />
          </div>
        )}

        <button
          onClick={handleCreatePost}
          disabled={!content || loading}
          className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium
            disabled:bg-gray-600 flex items-center justify-center"
        >
          {loading ? <ClipLoader size={20} color="black" /> : "Create Post"}
        </button>
      </div>
    </div>
  )
}

export default CreatePost
