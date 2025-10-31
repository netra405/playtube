



// ...existing code...
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SiYoutubeshorts } from "react-icons/si";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaThumbsUp,
  FaThumbsDown,
  FaDownload,
  FaBookmark,
} from "react-icons/fa";
import ShortCard from "../../component/ShortCard";
import Description from "../../component/Description";
import axios from "axios";
import { serverUrl } from "../../App";
import ClipLoader from "react-spinners/ClipLoader";
import { setAllVideosData } from "../../redux/contentSlice";
import { setSubscribedChannels } from "../../redux/userSlice";

// ---------- Reusable Icon Button ----------

const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center focus:outline-none sm:scale-100 scale-90"
  >
    <div
      className={`p-2 sm:p-3 rounded-full transition duration-200 ${active
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

const PlayVideo = () => {
  const videoRef = useRef(null);
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [vol, setVol] = useState(1);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { allVideosData, allShortsData } = useSelector((state) => state.content);
  const { userData, allChannelData } = useSelector((state) => state.user);

  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const didAddViewRef = useRef(false);

  const suggestedVideos =
    allVideosData?.filter((v) => v._id !== videoId).slice(0, 10) || [];
  const suggestedShorts = allShortsData?.slice(0, 10) || [];

  // Fetch Current Video & ensure channel object
  // ...existing code...
  useEffect(() => {
    if (!allVideosData) return;

    didAddViewRef.current = false;
    const currentVideo = allVideosData.find((v) => v._id === videoId);

    if (!currentVideo) {
      setVideo(null);
      setChannel(null);
      setComment([]);
      return;
    }

    setVideo(currentVideo);
    setComment(currentVideo.comments || []);

    const ch = currentVideo.channel;
    if (!ch) {
      setChannel(null);
      return;
    }

    // determine channelId (supports populated object or id string)
    const channelId = typeof ch === "string" ? ch : (ch?._id ?? ch?.id ?? null);

    // if channel is already an object (populated), use it
    if (typeof ch === "object" && !channelId) {
      setChannel(ch);
      return;
    }

    // 1) try to find channel in Redux store (fast, avoids network calls)
    const fromStore = allChannelData?.find(
      (c) => c._id === channelId || c.owner?._id === channelId || c.name === channelId
    );
    if (fromStore) {
      setChannel(fromStore);
      return;
    }

    // 2) fallback: try a single server endpoint once, do not try multiple endpoints
    (async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/channel/${channelId}`, { withCredentials: true });
        setChannel(res.data);
      } catch (err) {
        // suppress noisy 404 logs; fall back to populated object if present
        // use console.debug to keep dev info but avoid cluttering error console
        console.debug("Channel fetch failed:", err?.response?.status ?? err.message);
        setChannel(typeof ch === "object" ? ch : null);
      }
    })();
  }, [videoId, allVideosData, allChannelData]);
  // ...existing code...

  // Add View
  const addView = async () => {
    if (didAddViewRef.current) return;
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/video/${videoId}/add-view`,
        {},
        { withCredentials: true }
      );
      // backend may return views or video object
      const newViews = res.data.views ?? res.data?.video?.views ?? res.data;
      setVideo((prev) => (prev ? { ...prev, views: newViews } : prev));
      const updated = allVideosData.map((v) =>
        v._id === videoId ? { ...v, views: newViews } : v
      );
      dispatch(setAllVideosData(updated));
      didAddViewRef.current = true;
    } catch (err) {
      console.log("View Error:", err);
    }
  };

  // Video Controls
  const handleUpdateTime = () => {
    const v = videoRef.current;
    if (!v) return;
    const cur = v.currentTime;
    const dur = v.duration || duration;
    setCurrentTime(cur);
    setDuration(dur);
    if (dur > 0) setProgress((cur / dur) * 100);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVol(v);
    setIsMuted(v === 0);
    if (videoRef.current) videoRef.current.volume = v;
  };

  const handleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const seek = (e.target.value / 100) * duration;
    v.currentTime = seek;
    setProgress(e.target.value);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause();
    else v.play();
  };

  const skipForward = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };
  const skipBackward = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };
  const handleFullScreen = () => {
    if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
  };

  // Likes / Dislikes / Save -- update local + redux to reflect server
  const toggleLike = async () => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/video/${videoId}/toggle-like`,
        {},
        { withCredentials: true }
      );
      const updatedVideo = { ...(res.data.video ?? res.data) };
      // fallback to res.data.likes/res.data.disLikes if direct
      setVideo((prev) => ({ ...(prev ?? {}), ...updatedVideo }));
      // update global list if available
      if (allVideosData) {
        const updated = allVideosData.map((v) =>
          v._id === videoId ? { ...v, ...(updatedVideo || {}) } : v
        );
        dispatch(setAllVideosData(updated));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDislike = async () => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/video/${videoId}/toggle-dislike`,
        {},
        { withCredentials: true }
      );
      const updatedVideo = { ...(res.data.video ?? res.data) };
      setVideo((prev) => ({ ...(prev ?? {}), ...updatedVideo }));
      if (allVideosData) {
        const updated = allVideosData.map((v) =>
          v._id === videoId ? { ...v, ...(updatedVideo || {}) } : v
        );
        dispatch(setAllVideosData(updated));
      }
    } catch (err) {
      console.log(err);
    }
  };


const toggleSave = async () => {
  try {
    const result = await axios.put(
      `${serverUrl}/api/content/video/${videoId}/toggle-save`,
      {},
      { withCredentials: true }
    );

    const updatedVideo = result.data.video ?? result.data;

    setVideo((prev) => ({ ...(prev ?? {}), ...updatedVideo }));

    if (allVideosData) {
      const updated = allVideosData.map((v) =>
        v._id === videoId ? { ...v, ...(updatedVideo || {}) } : v
      );
      dispatch(setAllVideosData(updated));
    }
  } catch (error) {
    console.log("Save toggle error:", error);
  }
};

  // Comments
  const handleAddComment = async () => {
    if (!newComment || !newComment.trim()) return;
    setLoading1(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/video/${videoId}/add-comment`,
        { message: newComment },
        { withCredentials: true }
      );
      // prefer res.data.comments array or res.data.video.comments
      const comments = res.data.comments ?? res.data?.video?.comments ?? [];
      const latest = comments.slice(-1)[0];
      if (latest) setComment((prev) => [latest, ...prev]);
      setNewComment("");
      // sync video comments if returned
      if (res.data.video) setVideo((prev) => ({ ...(prev ?? {}), ...res.data.video }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading1(false);
    }
  };

  const handleReply = async ({ commentId, replyText }) => {
    if (!replyText || !replyText.trim()) return;
    setLoading2(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/video/${videoId}/${commentId}/add-reply`,
        { message: replyText },
        { withCredentials: true }
      );
      const comments = res.data.comments ?? res.data?.video?.comments;
      if (comments) setComment(comments);
      if (res.data.video) setVideo((prev) => ({ ...(prev ?? {}), ...res.data.video }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading2(false);
    }
  };

  // Subscribe toggle
  const handleSubscribe = async (channelId) => {
    if (!channelId) return;
    setLoading2(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/togglesubscribe`,
        { channelId },
        { withCredentials: true }
      );

      const newChannel = res.data;
      setChannel(newChannel);
      setIsSubscribed(newChannel.subscribers?.some(
        sub => (sub?._id ?? sub)?.toString() === userData?._id?.toString()
      ));
      setVideo(prev => prev ? { ...prev, channel: newChannel } : prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading2(false);
    }
  };

 



  // On initial load, set isSubscribed when channel becomes available
  useEffect(() => {
    if (!channel || !userData) return;
    setIsSubscribed(channel.subscribers?.some(
      sub => (sub?._id ?? sub)?.toString() === userData._id?.toString()
    ));
  }, [channel, userData]);

  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      {/* LEFT: Video Section */}
      <div className="flex-1">
        <div
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
        >
          <video
            key={videoId}
            ref={videoRef}
            className="w-full h-full object-contain"
            controls={false}
            autoPlay
            src={video?.videoUrl}
            onPlay={() => {
              setIsPlaying(true);
              addView();
            }}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleUpdateTime}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
          />

          {showControls && (
            <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-8 z-20">
              <button
                onClick={skipBackward}
                className="bg-black/70 p-3 rounded-full hover:bg-orange-600"
              >
                <FaBackward size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="bg-black/70 p-3 rounded-full hover:bg-orange-600"
              >
                {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                onClick={skipForward}
                className="bg-black/70 p-3 rounded-full hover:bg-orange-600"
              >
                <FaForward size={24} />
              </button>
            </div>
          )}

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-3 z-30">
            <input
              onChange={handleSeek}
              value={progress}
              type="range"
              min={0}
              max={100}
              className="w-full accent-orange-600"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-200">
              <div className="flex items-center gap-3">
                <span>
                  {formatTime(currentTime)}/{formatTime(duration)}
                </span>
                <button onClick={skipBackward}>
                  <FaBackward />
                </button>
                <button onClick={togglePlay}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={skipForward}>
                  <FaForward />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  value={isMuted ? 0 : vol}
                  onChange={handleVolume}
                  className="accent-orange-600 w-20"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <button onClick={handleFullScreen}>
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Details */}
        <h1 className="mt-4 text-lg font-bold">{video?.title}</h1>
        <p className="text-sm text-gray-400">{video?.views ?? 0} views</p>

        {/* Channel + Subscribe */}
        <div className="flex items-center gap-4 mt-2">
          <img
            onClick={() => navigate(`/channelpage/${channel?._id ?? channel?.owner?._id}`)}
            src={channel?.avatar ?? channel?.owner?.photoUrl}
            alt=""
            className="w-12 h-12 rounded-full border border-gray-600 cursor-pointer object-cover"
          />
          <div>
            <h1
              onClick={() => navigate(`/channelpage/${channel?._id ?? channel?.owner?._id}`)}
              className="font-bold cursor-pointer"
            >
              {channel?.name ?? channel?.owner?.userName ?? channel?.owner?.username}
            </h1>
            <p className="text-xs">{channel?.subscribers?.length ?? channel?.subscribersCount ?? 0} subscribers</p>
          </div>

          <button
            className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full ${isSubscribed
              ? "bg-black text-white border border-gray-700"
              : "bg-white text-black"
              }`}
            onClick={(e) => {
              e.stopPropagation();
              handleSubscribe(channel?._id ?? channel?.owner?._id);
            }}
            disabled={loading2}
          >
            {loading2 ? <ClipLoader size={16} color="gray" /> : isSubscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>

        {/* Like/Dislike/Save Buttons */}
        <div className="flex gap-4 mt-4">
          <IconButton
            icon={FaThumbsUp}
            label="Likes"
            count={video?.likes?.length}
            onClick={toggleLike}
            active={(video?.likes ?? []).some(
              (id) => ((id?._id ?? id)?.toString()) === (userData?._id?.toString())
            )}
          />
          <IconButton
            icon={FaThumbsDown}
            label="Dislikes"
            count={video?.disLikes?.length}
            onClick={toggleDislike}
            active={(video?.disLikes ?? []).some(
              (id) => ((id?._id ?? id)?.toString()) === (userData?._id?.toString())
            )}
          />
          <IconButton
            icon={FaDownload}
            label="Download"
            onClick={() => {
              const link = document.createElement("a");
              link.href = video?.videoUrl;
              link.download = `${video?.title || "video"}.mp4`;
              link.click();
            }}
          />
       <IconButton
  onClick={toggleSave}
  icon={FaBookmark}
  label="Save"
  active={video?.saveBy?.includes(userData?._id)}
/>

        </div>

        {/* Description */}
        <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg">
          <h2 className="font-semibold mb-2">Description</h2>
          <Description text={video?.description} />
        </div>

        {/* --- Comments Section --- */}
        <div className="mt-6">
          <h2 className="font-semibold mb-3">Comments</h2>
          <div className="flex gap-2 mb-4">
            <input
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-700 bg-[#1a1a1a] rounded-lg px-3 py-2"
              type="text"
            />
            <button
              onClick={handleAddComment}
              disabled={loading1}
              className="bg-orange-600 px-4 py-2 rounded-lg"
            >
              {loading1 ? <ClipLoader size={20} color="black" /> : "Post"}
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar">
            {comment?.length > 0 ? (
              comment.map((c) => (
                <div key={c._id} className="p-3 bg-[#1a1a1a] rounded-lg">
                  <div className="flex gap-2 items-center">
                    <img
                      src={c.author?.photoUrl}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span>@{c.author?.userName}</span>
                  </div>
                  <p className="px-4 py-2">{c.message}</p>

                  {/* Replies */}
                  <div className="ml-4 mt-2 space-y-2">
                    {c?.replies?.map((r) => (
                      <div key={r._id} className="p-2 bg-[#2a2a2a] rounded">
                        <div className="flex items-center gap-1">
                          <img
                            src={r?.author?.photoUrl}
                            className="w-6 h-6 rounded-full object-cover"
                            alt=""
                          />
                          <h2 className="text-[13px]">
                            @{r?.author?.userName?.toLowerCase()}
                          </h2>
                        </div>
                        <p className="px-6 py-2 text-sm">{r?.message}</p>
                      </div>
                    ))}
                  </div>

                  <ReplySection
                    comment={c}
                    handleReply={handleReply}
                    loading2={loading2}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Shorts + Up Next */}
      <div className="w-full lg:w-[380px] px-4 py-4 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto max-h-[calc(100vh-120px)] hide-scrollbar">
        <h2 className="flex items-center gap-2 font-bold text-lg mb-3">
          <SiYoutubeshorts className="text-orange-600" /> Shorts
        </h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-3">
          {suggestedShorts?.length > 0 ? (
            suggestedShorts.map((short) => (
              <div key={short._id} className="cursor-pointer">
                <ShortCard
                  shortUrl={short?.shortUrl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  avatar={short?.channel?.avatar}
                  views={short?.views}
                  id={short?._id}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No shorts available</p>
          )}
        </div>

        <div className="font-bold text-lg mt-4 mb-3">Up Next</div>
        <div className="space-y-3">
          {suggestedVideos?.length > 0 ? (
            suggestedVideos.map((v) => (
              <div
                key={v._id}
                onClick={() => navigate(`/playvideo/${v._id}`)}
                className="flex gap-2 cursor-pointer hover:bg-[#1a1a1a]/80 p-2 rounded-lg transition-all duration-200"
              >
                <img
                  src={v?.thumbnail}
                  alt={v?.title}
                  className="w-32 h-20 rounded-lg object-cover"
                />
                <div className="flex flex-col justify-center text-sm">
                  <h3 className="text-white font-medium line-clamp-2">{v?.title}</h3>
                  <p className="text-gray-400 text-xs">{v?.channel?.name}</p>
                  <p>{v?.views ?? 0} views</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No videos available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Reply Section ----------
const ReplySection = ({ comment, handleReply, loading2 }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div className="mt-3">
      {showReplyInput && (
        <div className="flex gap-2 mt-1 ml-4">
          <input
            placeholder="Add a reply..."
            onChange={(e) => setReplyText(e.target.value)}
            value={replyText}
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600 text-sm"
            type="text"
          />
          <button
            onClick={() => {
              handleReply({ commentId: comment._id, replyText });
              setShowReplyInput(false);
              setReplyText("");
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm"
            disabled={loading2}
          >
            {loading2 ? <ClipLoader size={20} color="black" /> : "Reply"}
          </button>
        </div>
      )}
      <button
        onClick={() => setShowReplyInput(!showReplyInput)}
        className="ml-4 text-xs text-gray-400 mt-1"
      >
        Reply
      </button>
    </div>
  );
};

export default PlayVideo;
// ...existing code...