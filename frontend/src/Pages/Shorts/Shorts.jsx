import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaPlay,
  FaPause,
  FaDownload,
  FaBookmark,
  FaArrowDown
} from "react-icons/fa";
import Description from '../../component/Description';
import axios from 'axios';
import { serverUrl } from '../../App';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';

const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center focus:outline-none sm:scale-100 scale-90"
  >
    <div
      className={`p-2 sm:p-3 rounded-full transition duration-200 ${
        active
          ? "bg-white text-black hover:bg-white"
          : "bg-black border border-gray-700 text-white hover:bg-gray-700"
      }`}
    >
      <Icon size={18} className="sm:size-5" />
    </div>
    <span className="text-[10px] sm:text-xs mt-1 text-gray-300 text-center">
      {count !== undefined && `${count} `}
      {label}
    </span>
  </button>
);

const Shorts = () => {
  const { allShortsData } = useSelector((state) => state.content);
  const { userData } = useSelector((state) => state.user);

  const [shortList, setShortList] = useState([]);
  const shortRefs = useRef([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [openCommentIndex, setOpenCommentIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewedShort, setViewedShort] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [replyOpen, setReplyOpen] = useState({});
  const [replyText, setReplyText] = useState({});
  const navigate  = useNavigate()

  // -------------------- Auto play when visible --------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = shortRefs.current[index];
          if (video) {
            if (entry.isIntersecting) {
              video.muted = false;
              video.play();
              const currentShortId = shortList[index]?._id;
              if (!viewedShort.includes(currentShortId)) {
                handleAddView(currentShortId);
                setViewedShort((prev) => [...prev, currentShortId]);
              }
            } else {
              video.muted = true;
              video.pause();
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    shortRefs.current.forEach((video) => video && observer.observe(video));
    return () => {
      shortRefs.current.forEach((video) => video && observer.unobserve(video));
      observer.disconnect();
    };
  }, [shortList]);

  // -------------------- Shuffle shorts --------------------
  useEffect(() => {
    if (!allShortsData || allShortsData.length === 0) return;
    setShortList([...allShortsData].sort(() => Math.random() - 0.5));
  }, [allShortsData]);

  // -------------------- Video Play Toggle --------------------
  const togglePlay = (index) => {
    const video = shortRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayIndex(null);
      } else {
        video.pause();
        setPlayIndex(index);
      }
    }
  };

  // -------------------- API Functions --------------------
  const handleSubscribe = async (channelId) => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/togglesubscribe`,
        { channelId },
        { withCredentials: true }
      );
      setLoading(false);
      const updatedChannel = result.data;
      setShortList((prev) =>
        prev.map((short) =>
          short.channel?._id === channelId
            ? { ...short, channel: updatedChannel }
            : short
        )
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const toggleLike = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-like`,
        {},
        { withCredentials: true }
      );
      const updatedShort = result.data;
      setShortList((prev) =>
        prev.map((s) => (s._id === updatedShort._id ? updatedShort : s))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDislike = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-dislike`,
        {},
        { withCredentials: true }
      );
      const updatedShort = result.data;
      setShortList((prev) =>
        prev.map((s) => (s._id === updatedShort._id ? updatedShort : s))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSave = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-save`,
        {},
        { withCredentials: true }
      );
      const updatedShort = result.data;
      setShortList((prev) =>
        prev.map((s) => (s._id === updatedShort._id ? updatedShort : s))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddView = async (shortId) => {
    try {
      await axios.put(
        `${serverUrl}/api/content/short/${shortId}/add-view`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComment = async (shortId) => {
    if (!newComment) return;
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/short/${shortId}/add-comment`,
        { message: newComment },
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [shortId]: result.data?.comments || [],
      }));
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddReply = async (shortId, commentId, replyValue) => {
    if (!replyValue) return;
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/short/${shortId}/${commentId}/add-reply`,
        { message: replyValue },
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [shortId]: result.data?.comments || [],
      }));
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setReplyOpen((prev) => ({ ...prev, [commentId]: false }));
    } catch (error) {
      console.log(error);
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="h-screen w-full overflow-y-scroll hide-scrollbar snap-y snap-mandatory bg-black">
      {shortList.map((short, index) => (
        <div
          key={short._id}
          className="min-h-screen flex flex-col sm:flex-row md:items-center items-start justify-center snap-start px-2 sm:px-4 md:px-6 pt-12 sm:pt-0"
        >
          <div
            onClick={() => togglePlay(index)}
            className="relative w-full mb-40  max-w-[480px] sm:max-w-[400px] md:max-w-[360px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer mx-auto"
          >
            <video
              loop
              playsInline
              className="w-full h-full object-cover"
              src={short.shortUrl}
              ref={(el) => (shortRefs.current[index] = el)}
              data-index={index}
            />

            {/* Play/Pause Icon */}
            <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
              {playIndex === index ? (
                <FaPlay className="text-white text-lg sm:text-xl" />
              ) : (
                <FaPause className="text-white text-lg sm:text-xl" />
              )}
            </div>

            {/* Video Info */}
            <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-1 sm:space-y-2">
              <div className="flex items-center justify-start gap-2 flex-wrap">
                <img onClick={()=>navigate(`/channelpage/${short.channel?._id}`)}
                  src={short?.channel?.avatar || "/default-avatar.png"}
                  className="w-8 h-8 rounded-full border border-gray-700"
                  alt=""
                />
                <span onClick={()=>navigate(`/channelpage/${short.channel?._id}`)} className="text-xs sm:text-sm text-gray-300 truncate">
                  @{short?.channel?.name?.toLowerCase() || "unknown"}
                </span>
                <button
                  className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full ${
                    short?.channel?.subscribers?.includes(userData?._id)
                      ? "bg-black text-white border border-gray-700"
                      : "bg-white text-black"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(short?.channel?._id);
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={16} color="gray" />
                  ) : short?.channel?.subscribers?.includes(userData?._id) ? (
                    "Unsubscribe"
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>

              <h3 className="font-bold text-sm sm:text-lg line-clamp-2">
                {short?.title}
              </h3>

              <div className="flex flex-wrap gap-1">
                {short?.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-800 text-gray-200 text-[10px] sm:text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Description text={short?.description} />
            </div>

            {/* Action Buttons */}
            <div className="absolute right-2 sm:right-3 bottom-24 sm:bottom-28 flex flex-col items-center text-center gap-3 sm:gap-5">
              <IconButton
                onClick={() => toggleLike(short?._id)}
                icon={FaThumbsUp}
                label="Likes"
                active={short?.likes?.includes(userData?._id)}
                count={short?.likes?.length}
              />
              <IconButton
                onClick={() => toggleDislike(short?._id)}
                icon={FaThumbsDown}
                label="Dislikes"
                active={short?.dislikes?.includes(userData?._id)}
                count={short?.dislikes?.length}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCommentIndex(
                    openCommentIndex === index ? null : index
                  );
                  setComments((prev) => ({
                    ...prev,
                    [short?._id]: short?.comments,
                  }));
                }}
                icon={FaComment}
                label="Comment"
              />
              <IconButton
                icon={FaDownload}
                label="Download"
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement("a");
                  link.href = short?.shortUrl;
                  link.download = `${short?.title || "video"}.mp4`;
                  link.click();
                }}
              />
              <IconButton
                onClick={() => toggleSave(short?._id)}
                icon={FaBookmark}
                label="Save"
                active={short?.saveBy?.includes(userData?._id)}
              />
            </div>

            {/* Comments Panel */}
            {openCommentIndex === index && (
              <div className="absolute bottom-0 left-0 right-0 h-[60%] sm:h-[50%] bg-black/95 text-white p-3 sm:p-4 rounded-t-2xl overflow-y-auto z-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm sm:text-lg">Comments</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCommentIndex(null);
                    }}
                  >
                    <FaArrowDown size={18} />
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                    placeholder="Add a comment..."
                    type="text"
                    className="flex-1 bg-gray-900 text-white text-xs sm:text-sm p-2 rounded"
                  />
                  <button
                    onClick={() => handleAddComment(short?._id)}
                    className="bg-gray-800 px-3 py-1 rounded text-xs border border-gray-700"
                  >
                    Post
                  </button>
                </div>

                <div className="space-y-3 mt-4">
                  {comments[short?._id]?.length > 0 ? (
                    comments[short?._id].map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-800/40 p-2 rounded-lg text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={
                              comment.author?.photoUrl || "/default-avatar.png"
                            }
                            className="w-6 h-6 rounded-full"
                            alt={comment.author?.userName || "User"}
                          />
                          <h3 className="font-semibold">
                            {comment.author?.userName || "Unknown"}
                          </h3>
                        </div>
                        <p className="ml-8">{comment.message}</p>

                        <button
                          className="text-orange-500 ml-8 mt-2"
                          onClick={() =>
                            setReplyOpen((prev) => ({
                              ...prev,
                              [comment._id]: !prev[comment._id],
                            }))
                          }
                        >
                          Reply
                        </button>

                        {replyOpen[comment._id] && (
                          <div className="mt-2 ml-8 flex gap-2">
                            <input
                              type="text"
                              placeholder="Add a reply..."
                              className="flex-1 bg-gray-900 text-white text-xs sm:text-sm p-2 rounded"
                              value={replyText[comment._id] || ""}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [comment._id]: e.target.value,
                                }))
                              }
                            />
                            <button
                              onClick={() =>
                                handleAddReply(
                                  short._id,
                                  comment._id,
                                  replyText[comment._id]
                                )
                              }
                              className="bg-orange-500 px-3 py-1 rounded text-xs"
                            >
                              Reply
                            </button>
                          </div>
                        )}

                        <div className="ml-5 mt-2 space-y-2">
                          {comment.replies?.map((reply) => (
                            <div
                              key={reply._id}
                              className="bg-gray-800/40 p-2 rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={
                                    reply.author?.photoUrl ||
                                    "/default-avatar.png"
                                  }
                                  className="w-6 h-6 rounded-full"
                                  alt={reply.author?.userName || "User"}
                                />
                                <h3 className="text-xs sm:text-sm font-semibold">
                                  {reply.author?.userName || "Unknown"}
                                </h3>
                              </div>
                              <p className="ml-8 text-xs sm:text-sm">
                                {reply.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400">
                      No comments yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shorts;
