import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaPlay,
  FaPause,
  FaDownload,
  FaBookmark,
  FaArrowDown,
} from "react-icons/fa";
import Description from "../../component/Description";
import axios from "axios";
import { serverUrl } from "../../App";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate, useParams } from "react-router-dom";

const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center focus:outline-none"
  >
    <div
      className={`p-3 rounded-full transition ${
        active
          ? "bg-white text-black hover:bg-white"
          : "bg-black border border-gray-700 text-white hover:bg-gray-700"
      }`}
    >
      <Icon size={20} />
    </div>
    <span className="text-xs mt-1 text-gray-300">
      {count !== undefined && `${count} `}
      {label}
    </span>
  </button>
);

const PlayShort = () => {
  const { shortId } = useParams();
  const { allShortsData } = useSelector((state) => state.content);
  const { userData } = useSelector((state) => state.user);

  const selectedShort = allShortsData?.find((s) => s._id === shortId);

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
  const navigate = useNavigate()

  // 🔁 Load shorts (place selected one first)
  useEffect(() => {
    if (!allShortsData?.length) return;

    if (selectedShort) {
      const selected = allShortsData.find(
        (short) => short._id === selectedShort._id
      );
      const remaining = allShortsData.filter(
        (short) => short._id !== selectedShort._id
      );
      setShortList(selected ? [selected, ...remaining] : allShortsData);
    } else {
      setShortList(allShortsData);
    }
  }, [selectedShort, allShortsData]);

  // 🎥 Auto-play using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = shortRefs.current[index];
          if (!video) return;

          if (entry.isIntersecting) {
            video.muted = false;
            video.play();
            const currentShortId = shortList[index]._id;
            if (!viewedShort.includes(currentShortId)) {
              handleAddView(currentShortId);
              setViewedShort((prev) => [...prev, currentShortId]);
            }
          } else {
            video.muted = true;
            video.pause();
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

  // ▶️ Pause / play toggle
  const togglePlay = (index) => {
    const video = shortRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayIndex(null);
    } else {
      video.pause();
      setPlayIndex(index);
    }
  };

  // 🔔 Subscribe toggle
  const handleSubscribe = async (channelId) => {
    if (!channelId) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/togglesubscribe`,
        { channelId },
        { withCredentials: true }
      );
      setShortList((prev) =>
        prev.map((short) =>
          short.channel?._id === channelId
            ? { ...short, channel: res.data }
            : short
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 👍 Like toggle
  const toggleLike = async (shortId) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-like`,
        {},
        { withCredentials: true }
      );
      const updated = res.data;
      setShortList((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 👎 Dislike toggle
  const toggleDislike = async (shortId) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-dislike`,
        {},
        { withCredentials: true }
      );
      const updated = res.data;
      setShortList((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 💾 Save toggle
  const toggleSave = async (shortId) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-save`,
        {},
        { withCredentials: true }
      );
      const updated = res.data;
      setShortList((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 👁️ Add view
  const handleAddView = async (shortId) => {
    try {
      await axios.put(
        `${serverUrl}/api/content/short/${shortId}/add-view`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 💬 Add comment
  const handleAddComment = async (shortId) => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/short/${shortId}/add-comment`,
        { message: newComment },
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [shortId]: res.data?.comments || [],
      }));
      setNewComment("");
    } catch (err) {
      console.log(err);
    }
  };

  // 💬 Add reply
  const handleAddReply = async (shortId, commentId, replyValue) => {
    if (!replyValue.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/short/${shortId}/${commentId}/add-reply`,
        { message: replyValue },
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [shortId]: res.data?.comments || [],
      }));
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setReplyOpen((prev) => ({ ...prev, [commentId]: false }));
    } catch (err) {
      console.log(err);
    }
  };

   useEffect(()=>{
  const addHistory = async ()=> {
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/add-history`,
        {contentId: shortId,
          contentType: "Short"
        },
        {withCredentials: true}
      )
      console.log(res.data)
    } catch (error) {
      console.log("Error adding history:", error)
    }
  }
  if (shortId) addHistory()
 }, [shortId])


  return (
    <div className="h-[100vh] w-full overflow-y-scroll hide-scrollbar snap-y snap-mandatory">
      {shortList.map((short, index) => (
        <div
          key={short._id}
          className="min-h-screen flex md:items-center items-start justify-center snap-start pt-[40px] md:pt-0"
        >
          {/* 🎬 Short video */}
          <div
            onClick={() => togglePlay(index)}
            className="relative w-[420px] md:w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer"
          >
            <video
              loop
              playsInline
              className="w-full h-full object-cover"
              src={short.shortUrl}
              ref={(el) => (shortRefs.current[index] = el)}
              data-index={index}
            />

            {/* Play / Pause Icon */}
            <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
              {playIndex === index ? (
                <FaPlay className="text-white text-lg" />
              ) : (
                <FaPause className="text-white text-lg" />
              )}
            </div>

            {/* ℹ️ Info */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-1">
              <div className="flex items-center gap-2">
                <img onClick={()=>navigate(`/channelpage/${short.channel?._id}`)}
                  src={short.channel?.avatar || "/default-avatar.png"}
                  className="w-8 h-8 rounded-full border border-gray-700"
                  alt=""
                />
                <span  onClick={()=>navigate(`/channelpage/${short.channel?._id}`)} className="text-sm text-gray-300">
                  @{short.channel?.name?.toLowerCase() || "unknown"}
                </span>
                <button
                  className={`text-xs px-3 py-1 rounded-full cursor-pointer ${
                    short.channel?.subscribers?.includes(userData?._id)
                      ? "bg-black text-white border border-gray-700"
                      : "bg-white text-black"
                  }`}
                  onClick={() => handleSubscribe(short.channel?._id)}
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={20} color="gray" />
                  ) : short.channel?.subscribers?.includes(userData?._id) ? (
                    "Unsubscribe"
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>

              <h3 className="font-bold text-lg line-clamp-2">
                {short.title}
              </h3>

              <div>
                {short.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full mr-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Description text={short.description} />
            </div>

            {/* ⚙️ Buttons */}
            <div className="absolute right-3 bottom-28 flex flex-col text-center gap-5">
              <IconButton
                onClick={() => toggleLike(short._id)}
                icon={FaThumbsUp}
                label="Likes"
                active={short.likes?.includes(userData?._id)}
                count={short.likes?.length}
              />
              <IconButton
                onClick={() => toggleDislike(short._id)}
                icon={FaThumbsDown}
                label="Dislikes"
                active={short.dislikes?.includes(userData?._id)}
                count={short.dislikes?.length}
              />
              <IconButton
                icon={FaComment}
                label="Comment"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCommentIndex(
                    openCommentIndex === index ? null : index
                  );
                  setComments((prev) => ({
                    ...prev,
                    [short._id]: short.comments,
                  }));
                }}
              />
              <IconButton
                icon={FaDownload}
                label="Download"
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement("a");
                  link.href = short.shortUrl;
                  link.download = `${short.title || "video"}.mp4`;
                  link.click();
                }}
              />
              <IconButton
                onClick={() => toggleSave(short._id)}
                icon={FaBookmark}
                label="Save"
                active={short.saveBy?.includes(userData?._id)}
              />
            </div>

            {/* 💬 Comments */}
            {openCommentIndex === index && (
              <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-black/90 text-white p-4 rounded-t-2xl overflow-y-auto z-50 hide-scrollbar">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comments</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCommentIndex(null);
                    }}
                  >
                    <FaArrowDown size={20} />
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                    placeholder="Add a comment..."
                    type="text"
                    className="flex-1 bg-gray-900 text-white p-2 rounded"
                  />
                  <button
                    onClick={() => handleAddComment(short._id)}
                    className="bg-black px-4 py-2 border border-gray-700 rounded-xl"
                  >
                    Post
                  </button>
                </div>

                <div className="space-y-3 mt-4">
                  {comments[short._id]?.length > 0 ? (
                    comments[short._id].map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-800/40 p-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={
                              comment.author?.photoUrl ||
                              "/default-avatar.png"
                            }
                            className="w-6 h-6 rounded-full"
                            alt={comment.author?.userName || "User"}
                          />
                          <h3 className="text-sm font-semibold">
                            {comment.author?.userName || "Unknown"}
                          </h3>
                        </div>
                        <p className="text-sm ml-8">{comment.message}</p>

                        <button
                          className="text-md text-orange-500 ml-8 mt-2"
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
                              className="w-full bg-gray-900 text-white text-sm p-2 rounded"
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
                              className="mt-1 bg-orange-500 px-3 py-1 rounded text-xs"
                            >
                              Reply
                            </button>
                          </div>
                        )}

                        {/* Replies */}
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
                                <h3 className="text-sm font-semibold">
                                  {reply.author?.userName || "Unknown"}
                                </h3>
                              </div>
                              <p className="text-sm ml-8">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">
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

export default PlayShort;
