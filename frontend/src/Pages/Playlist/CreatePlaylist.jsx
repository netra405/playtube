import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showCustomAlert } from '../../component/CustomAlert';
import axios from 'axios';
import { serverUrl } from '../../App';
import { setChannelData } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

const CreatePlaylist = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { channelData } = useSelector((state) => state.user);
  const [videoData, setVideoData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Toggle select/unselect video
  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  // ✅ Handle playlist creation
  const handleCreatePlaylist = async () => {
    try {
      if (!title.trim() || !description.trim()) {
        return showCustomAlert("Title and description are required.");
      }

      if (selectedVideos.length === 0) {
        return showCustomAlert("Please select at least one video.");
      }

      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/api/content/create-playlist`,
        {
          title,
          description,
          channelId: channelData?._id,
          videoIds: selectedVideos,
        },
        { withCredentials: true }
      );

      // ✅ Fix: Typo in playlist array name
      const updatedChannel = {
        ...channelData,
        playlists: [...(channelData.playlists || []), result.data],
      };

      dispatch(setChannelData(updatedChannel));
      showCustomAlert("Playlist created successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      showCustomAlert(`Failed to create playlist: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load channel videos once
  useEffect(() => {
    if (channelData?.videos) {
      setVideoData(channelData.videos);
    }
  }, [channelData]);

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* Title Input */}
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Playlist Title *"
          />

          {/* Description Input */}
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows="4"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none mt-3"
            placeholder="Playlist Description *"
          />

          {/* Video Selection */}
          <div>
            <p className="mb-3 text-lg font-semibold">Select Videos</p>
            {videoData.length === 0 ? (
              <p className="text-sm text-gray-400">
                No videos found for this channel.
              </p>
            ) : (
              <div className="grid hide-scrollbar grid-cols-2 gap-4 max-h-72 overflow-auto">
                {videoData.map((video) => (
                  <div
                    key={video?._id}
                    onClick={() => toggleVideoSelect(video?._id)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedVideos.includes(video?._id)
                        ? 'border-orange-500 scale-[1.02]'
                        : 'border-gray-700'
                    }`}
                  >
                    <img
                      src={video?.thumbnail}
                      className="w-full h-28 object-cover"
                      alt=""
                    />
                    <p className="p-2 text-sm truncate">{video?.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCreatePlaylist}
            disabled={!title || !description || loading}
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="black" /> : "Create Playlist"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePlaylist;
