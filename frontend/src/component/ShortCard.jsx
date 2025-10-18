import React from 'react'

const ShortCard = ({ shortUrl, title, channelName, avatar, views, id }) => {
  return (
    <div
      className="w-[180px] sm:w-[200px] md:w-[220px] mb-8 cursor-pointer group relative transition-transform duration-300 hover:scale-[1.05]"
    >
      {/* Video Container */}
      <div className="relative rounded-xl overflow-hidden bg-black h-[350px] border border-gray-800 shadow-md">
        <video
          src={shortUrl}
          className="w-full h-full object-cover rounded-xl group-hover:brightness-90 transition-all duration-300"
          muted
          playsInline
          loop
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 rounded-b-xl">
          <h3 className="text-sm font-semibold text-white line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <img
              src={avatar}
              alt={channelName}
              className="w-5 h-5 rounded-full object-cover border border-gray-600"
            />
            <p className="text-xs text-gray-300 truncate">{channelName}</p>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{views} views</p>
        </div>
      </div>
    </div>
  )
}

export default ShortCard
