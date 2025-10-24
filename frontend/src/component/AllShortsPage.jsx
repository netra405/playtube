import React from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "./ShortCard";

const AllShortsPage = () => {
  const { allShortsData } = useSelector((state) => state.content);
  const latestShorts = allShortsData?.slice(0, 10) || [];

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <h2 className="text-xl font-bold flex items-center mb-4 gap-2">
        <SiYoutubeshorts className="w-6 h-6 text-orange-600" />
        Shorts
      </h2>

      {/* Shorts List */}
      {latestShorts.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {latestShorts.map((short) => (
            <div
              key={short?._id}
              className="flex-shrink-0 snap-center"
            >
              <ShortCard
                shortUrl={short?.shortUrl}
                title={short?.title}
                avatar={short?.channel?.avatar}
                channelName={short?.channel?.name}
                views={short?.views}
                id={short?._id}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No shorts available right now.</p>
      )}
    </div>
  );
};

export default AllShortsPage;
