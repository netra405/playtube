import React from 'react'
import { useSelector } from 'react-redux'
import { SiYoutubeshorts} from "react-icons/si"
import ShortCard from './ShortCard'

const AllShortsPage = () => {

    const {allShortsData} = useSelector(state=>state.content)
    const latestShorts = allShortsData?.slice(0,10) || []
  return (
    <div className='px-6 py-4'>
        <h2 className='text-xl font-bold flex items-center mb-2 justify-start gap-1'><SiYoutubeshorts className='w-6 h-6 text-orange-600'/>Shorts</h2>
        <div className='flex gap-4 overflow-x-auto pb-4 hide-scrollbar'>
            { latestShorts?.map((short)=>(
                <div key={short?._id} className='flex flex-shrink-0'>
                    <ShortCard 
                    shortUrl={short?.shortUrl}
                    title={short?.title}
                    avatar={short?.channel?.avatar}
                    channelName={short?.channel?.name}
                    />
                </div>
            ))

            }
        </div>
    </div>
  )
}

export default AllShortsPage
