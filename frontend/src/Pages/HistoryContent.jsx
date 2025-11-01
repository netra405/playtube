// ...existing imports...
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { SiYoutubeshorts } from "react-icons/si"
import { GoVideo } from "react-icons/go"
import ShortCard from '../component/ShortCard'
import VideoCard from '../component/VideoCard'
import { useSelector } from 'react-redux'

const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = url;

  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  video.onerror = () => callback("0:00");
};

const HistoryContent = () => {
  const { videoHistory, shortHistory } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState({});

  // ✅ Set loading false when histories are loaded
  useEffect(() => {
    if (Array.isArray(videoHistory) && Array.isArray(shortHistory)) {
      setLoading(false);
    }
  }, [videoHistory, shortHistory]);

  // ✅ Fetch durations for videos
  useEffect(() => {
    if (!Array.isArray(videoHistory) || videoHistory.length === 0) return;

    videoHistory.forEach((v) => {
      const video = v?.contentId;
      if (video?.videoUrl) {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({
            ...prev,
            [video._id]: formattedTime,
          }));
        });
      }
    });
  }, [videoHistory]);

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px] text-white">
      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && shortHistory?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[10px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
            Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {shortHistory.map((s) => {
              if (!s?.contentId) return null;
              const short = s.contentId;
              return (
                <div key={s._id} className="flex-shrink-0">
                  <ShortCard
                    shortUrl={short.shortUrl}
                    title={short.title}
                    channelName={short.channel?.name ?? short.channel?.owner?.userName}
                    views={short.views}
                    id={short._id}
                    avatar={short.channel?.avatar ?? short.channel?.owner?.photoUrl}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && videoHistory?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[10px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="w-7 h-7 text-orange-600" />
            Videos
          </h2>

          <div className="flex flex-wrap gap-6">
            {videoHistory.map((v) => {
              if (!v?.contentId) return null;
              const video = v.contentId;
              return (
                <div key={v._id} className="flex-shrink-0">
                  <VideoCard
                    thumbnail={video.thumbnail}
                    duration={duration[video._id] || "0:00"}
                    channelLogo={video.channel?.avatar}
                    title={video.title}
                    channelName={video.channel?.name}
                    views={video.views}
                    id={video._id}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading &&
        shortHistory?.length === 0 &&
        videoHistory?.length === 0 && (
          <p className="text-gray-400 mt-6">No content found.</p>
        )}
    </div>
  );
};

export default HistoryContent;
