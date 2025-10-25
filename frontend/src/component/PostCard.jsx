import React from 'react'
import {FaHeart , FaComment, FaReply, FaTimes} from "react-icons/fa"

const PostCard = ({post}) => {
  return (
    <div className='w-100 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-5 shadow-lg border rounded border-gray-700 mb-[50px] relative'>
      <p className='text-base text-gray-200'>{post?.content}</p>
      {post?.image && (
        <img src={post?.image} className='w-90 h-80 object-cover rounded-xl mt-4 shadow-md' alt="" />
      )}
      <div className='flex justify-between items-center mt-4 text-gray-400 text-sm'>
        <span className='italic text-gray-500'>{new Date(post.createdAt).toDateString()}</span>
        <div className='flex gap-6'>
            <button><FaHeart/></button>
            <button><FaComment/></button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
