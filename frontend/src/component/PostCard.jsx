// import React, { useState } from 'react'
// import { FaHeart, FaComment, FaTimes } from "react-icons/fa"
// import { useSelector } from 'react-redux'
// import { serverUrl } from '../App'
// import axios from 'axios'
// import ClipLoader from 'react-spinners/ClipLoader'

// const PostCard = ({ post }) => {
//   const { userData } = useSelector(state => state.user)
//   const [liked, setLiked] = useState(userData ? post.likes?.some(uid => uid.toString() === userData._id) : false)
//   const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
//   const [showComment, setShowComment] = useState(false)
//   const [newComment, setNewComment] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [loading1, setLoading1] = useState(false)
//   const [comments, setComments] = useState(post?.comments || [])

//   const handleLike = async () => {
//     try {
//       const result = await axios.post(
//         `${serverUrl}/api/content/post/toggle-like`,
//         { postId: post?._id },
//         { withCredentials: true }
//       )
//       setLikeCount(result.data.likes?.length)
//       setLiked(result.data.likes.includes(userData._id))
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return
//     setLoading(true)
//     try {
//       const res = await axios.post(
//         `${serverUrl}/api/content/post/add-comment`,
//         { message: newComment, postId: post?._id },
//         { withCredentials: true }
//       )
//       setComments(prev => [res.data.comments.slice(-1)[0], ...prev])
//       setNewComment("")
//     } catch (err) {
//       console.log(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddReply = async ({ replyText, commentId }) => {
//     if (!replyText.trim()) return
//     setLoading1(true)
//     try {
//       const res = await axios.post(
//         `${serverUrl}/api/content/post/add-reply`,
//         { message: replyText, postId: post?._id, commentId },
//         { withCredentials: true }
//       )

//       // Update the specific comment with the new reply
//       setComments(prev =>
//         prev.map(c =>
//           c._id === commentId ? { ...c, replies: res.data.updatedComment.replies } : c
//         )
//       )
//     } catch (err) {
//       console.log(err)
//     } finally {
//       setLoading1(false)
//     }
//   }
//   return (
//     <div className='w-100 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-5 shadow-lg border rounded border-gray-700 mb-[50px] relative'>
//       <p className='text-base text-gray-200'>{post?.content}</p>
//       {post?.image && (
//         <img src={post?.image} className='w-90 h-80 object-cover rounded-xl mt-4 shadow-md' alt="" />
//       )}
//       <div className='flex justify-between items-center mt-4 text-gray-400 text-sm'>
//         <span className='italic text-gray-500'>{new Date(post.createdAt).toDateString()}</span>
//         <div className='flex gap-6'>
//             <button
//             className={`flex items-center gap-2 cursor-pointer transition ${liked ? "text-orange-500" : "hover:text-orange-400"}`}
//             onClick={handleLike}><FaHeart/>{likeCount}</button>
//             <button onClick={()=>setShowComment(true)} className='flex items-center gap-2 hover:text-orange-400 cursor-pointer transition'><FaComment/></button>
//         </div>
//       </div>

//       {showComment && (
//         <div className='absolute hide-scrollbar space-y-2 bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-4 rounded-t-2xl border-t border-gray-700 max-h-[50%] overflow-y-auto'>
//           <div className='flex items-center w-full justify-between py-[10px]'>
//             <h3 className='text-gray-300 font-semibold mb-2'>Comments</h3>
//             <button className='text-gray-400 hover:text-orange-500 transition' onClick={() => setShowComment(false)}>
//               <FaTimes size={18} />
//             </button>
//           </div>

//           {/* Add Comment Input */}
//           <div className='flex gap-2 mt-3 items-center'>
//             <img src={userData?.photoUrl} className='w-8 h-8 rounded-full' alt="" />
//             <input
//               onChange={(e) => setNewComment(e.target.value)}
//               value={newComment}
//               type="text"
//               placeholder='Add a comment...'
//               className='flex-1 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
//             />
//             <button
//               disabled={loading}
//               onClick={handleAddComment}
//               className='px-4 py-2 bg-orange-600 rounded-lg text-white text-sm hover:bg-orange-700'
//             >
//               {loading ? <ClipLoader size={20} color='black' /> : "Post"}
//             </button>
//           </div>

//           {/* Comment List */}
//           <div className='space-y-3 mt-3'>
//             {comments.length > 0 ? (
//               comments.map(comment => (
//                 <div key={comment?._id} className='bg-gray-700 p-3 rounded-lg'>
//                   <div className='flex items-center gap-2 mb-1'>
//                     <img src={comment?.author?.photoUrl} className='w-6 h-6 rounded-full object-cover' alt="" />
//                     <span className='text-sm font-semibold text-gray-200'>{comment?.author?.userName}</span>
//                   </div>
//                   <p className='text-gray-200 ml-8'>{comment?.message}</p>

//                   {/* Replies */}
//                   {comment.replies?.length > 0 && (
//                     <div className='ml-8 mt-2 space-y-2'>
//                       {comment.replies.map(reply => (
//                         <div key={reply._id} className='text-gray-400 text-sm'>
//                           <span className='font-semibold text-gray-300'>{reply.author?.userName}:</span> {reply.message}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   <ReplySection comment={comment} handleReply={handleAddReply} loading1={loading1} />
//                 </div>
//               ))
//             ) : (
//               <p className='text-gray-500 text-sm'>No comments yet</p>
//             )}
//           </div>
//         </div>
//       )}


//     </div>
//   )
// }

// // ---------- Reply Section ----------
// const ReplySection = ({ comment, handleReply, loading1 }) => {
//   const [replyText, setReplyText] = useState("")
//   const [showReplyInput, setShowReplyInput] = useState(false)

//   return (
//     <div className="mt-3">
//       {showReplyInput && (
//         <div className="flex gap-2 mt-1 ml-8">
//           <input
//             placeholder="Add a reply..."
//             onChange={(e) => setReplyText(e.target.value)}
//             value={replyText}
//             className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600 text-sm"
//             type="text"
//           />
//           <button
//             onClick={() => {
//               handleReply({ commentId: comment._id, replyText })
//               setShowReplyInput(false)
//               setReplyText("")
//             }}
//             className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm"
//             disabled={loading1}
//           >
//             {loading1 ? <ClipLoader size={20} color="black" /> : "Reply"}
//           </button>
//         </div>
//       )}
//       <button
//         onClick={() => setShowReplyInput(!showReplyInput)}
//         className="ml-8 text-xs text-gray-400 mt-1"
//       >
//         Reply
//       </button>
//     </div>
//   )
// }



// export default PostCard




import React, { useState } from 'react'
import { FaHeart, FaComment, FaTimes } from "react-icons/fa"
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'

const PostCard = ({ post }) => {
  const { userData } = useSelector(state => state.user)

  if (!post) return null // Safeguard if post is undefined

  const [liked, setLiked] = useState(userData ? post.likes?.some(uid => uid.toString() === userData._id) : false)
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const [showComment, setShowComment] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [comments, setComments] = useState(post?.comments || [])

  const handleLike = async () => {
    if (!userData) return
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/post/toggle-like`,
        { postId: post._id },
        { withCredentials: true }
      )
      setLikeCount(result.data.likes?.length || 0)
      setLiked(result.data.likes?.includes(userData._id))
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !userData) return
    setLoading(true)
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/post/add-comment`,
        { message: newComment, postId: post._id },
        { withCredentials: true }
      )
      const addedComment = res.data.comments?.slice(-1)[0]
      if (addedComment) setComments(prev => [addedComment, ...prev])
      setNewComment("")
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddReply = async ({ replyText, commentId }) => {
    if (!replyText.trim() || !userData) return
    setLoading1(true)
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/post/add-reply`,
        { message: replyText, postId: post._id, commentId },
        { withCredentials: true }
      )
     setComments(res.data.comments)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading1(false)
    }
  }

  return (
    <div className='w-100 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-5 shadow-lg border rounded border-gray-700 mb-[50px] relative'>
      <p className='text-base text-gray-200'>{post.content}</p>
      {post.image && (
        <img src={post.image} className='w-90 h-80 object-cover rounded-xl mt-4 shadow-md' alt="" />
      )}
      <div className='flex justify-between items-center mt-4 text-gray-400 text-sm'>
        <span className='italic text-gray-500'>{new Date(post.createdAt).toDateString()}</span>
        <div className='flex gap-6'>
          <button
            className={`flex items-center gap-2 cursor-pointer transition ${liked ? "text-orange-500" : "hover:text-orange-400"}`}
            onClick={handleLike}>
            <FaHeart /> {likeCount}
          </button>
          <button
            onClick={() => setShowComment(true)}
            className='flex items-center gap-2 hover:text-orange-400 cursor-pointer transition'>
            <FaComment />
          </button>
        </div>
      </div>

      {showComment && (
        <div className='absolute hide-scrollbar space-y-2 bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-4 rounded-t-2xl border-t border-gray-700 max-h-[50%] overflow-y-auto'>
          <div className='flex items-center w-full justify-between py-[10px]'>
            <h3 className='text-gray-300 font-semibold mb-2'>Comments</h3>
            <button className='text-gray-400 hover:text-orange-500 transition' onClick={() => setShowComment(false)}>
              <FaTimes size={18} />
            </button>
          </div>

          {/* Add Comment Input */}
          <div className='flex gap-2 mt-3 items-center'>
            <img src={userData?.photoUrl} className='w-8 h-8 rounded-full' alt="" />
            <input
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
              type="text"
              placeholder='Add a comment...'
              className='flex-1 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
            />
            <button
              disabled={loading}
              onClick={handleAddComment}
              className='px-4 py-2 bg-orange-600 rounded-lg text-white text-sm hover:bg-orange-700'
            >
              {loading ? <ClipLoader size={20} color='black' /> : "Post"}
            </button>
          </div>

          {/* Comment List */}
          <div className='space-y-3 mt-3'>
            {comments.length > 0 ? comments.map(comment => (
              <div key={comment?._id} className='bg-gray-700 p-3 rounded-lg'>
                <div className='flex items-center gap-2 mb-1'>
                  <img src={comment?.author?.photoUrl} className='w-6 h-6 rounded-full object-cover' alt="" />
                  <span className='text-sm font-semibold text-gray-200'>{comment?.author?.userName}</span>
                </div>
                <p className='text-gray-200 ml-8'>{comment?.message}</p>

                {/* Replies */}
                <div className="ml-4 mt-2 space-y-2">
                  {comment?.replies?.map((r) => (
                    <div key={r._id} className="p-2 bg-[#2a2a2a] rounded">
                      <div className="flex items-center gap-1">
                        <img
                          src={r?.author?.photoUrl}
                          className="w-6 h-6 rounded-full object-cover"
                          alt=""
                        />
                        <h2 className="text-[13px]">
                          @{r?.author?.userName.toLowerCase()}
                        </h2>
                      </div>
                      <p className="px-6 py-2 text-sm">{r?.message}</p>
                    </div>
                  ))}
                </div>

                <ReplySection comment={comment} handleReply={handleAddReply} loading1={loading1} />
              </div>
            )) : <p className='text-gray-500 text-sm'>No comments yet</p>}

          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Reply Section ----------
const ReplySection = ({ comment, handleReply, loading1 }) => {
  const [replyText, setReplyText] = useState("")
  const [showReplyInput, setShowReplyInput] = useState(false)

  return (
    <div className="mt-3">
      {showReplyInput && (
        <div className="flex gap-2 mt-1 ml-8">
          <input
            placeholder="Add a reply..."
            onChange={(e) => setReplyText(e.target.value)}
            value={replyText}
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600 text-sm"
            type="text"
          />
          <button
            onClick={() => {
              handleReply({ commentId: comment._id, replyText })
              setShowReplyInput(false)
              setReplyText("")
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm"
            disabled={loading1}
          >
            {loading1 ? <ClipLoader size={20} color="black" /> : "Reply"}
          </button>
        </div>
      )}
      <button
        onClick={() => setShowReplyInput(!showReplyInput)}
        className="ml-8 text-xs text-gray-400 mt-1"
      >
        Reply
      </button>
    </div>
  )
}

export default PostCard
