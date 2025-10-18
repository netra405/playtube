// import React from 'react'

// const VideoCard = ({thumbnail, duration, channelLogo, title, channelName, views, id}) => {
//   return (
//     <div className='w-[360px] cursor-pointer'>
//         <div className='relative'>
//             <img src={thumbnail} alt={title} className='rounded-xl w-fuull h-[200px] border-1 border-gray-800 object-cover' />
//             <span className='absolute bottom-2 right-2 bg-black text-white text-xs px-1 rounded'>{duration}</span>
//         </div>
//         <div className='flex mt-3'>
//             <img src={channelLogo} alt={channelName} className='w-10 h-10 rounded-full mr-3' />
//             <div>
//                 <h3 className='text-sm font-semibold leading-snug line-clamp-2'>{title}</h3>
//                 <p className='text-xs text-gray-400 mt-1'>{channelName}</p>
//                 <p className='text-xs text-gray-400'>{views}0</p>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default VideoCard



import React from 'react'

const VideoCard = ({ thumbnail, duration, channelLogo, title, channelName, views, id }) => {
  return (
    <div
      className="w-[340px] sm:w-[360px] cursor-pointer rounded-xl transition-transform transform hover:scale-[1.03] hover:bg-[#1f1f1f]/30 p-2"
    >
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="rounded-xl w-full h-[200px] object-cover border border-gray-800"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-2 py-[2px] rounded-md font-medium">
          {duration}
        </span>
      </div>

      {/* Video Info */}
      <div className="flex mt-3">
        <img
          src={channelLogo}
          alt={channelName}
          className="w-10 h-10 rounded-full mr-3 border border-gray-700 object-cover"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-gray-100 leading-snug line-clamp-2 hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{channelName}</p>
          <p className="text-xs text-gray-500">{views} views</p>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
