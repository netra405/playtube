import React, { useState } from 'react'
import { FaPlay, FaPen, FaList } from "react-icons/fa"
import { RiVideoUploadLine } from "react-icons/ri";
import create from "../assets/create.png"


const CreatePage = () => {
    const [selected, setSelected] = useState(false)

    const options = [
        {
            id: "video",
            icon: <RiVideoUploadLine size={28} />,
            title: "Upload Video"
        },
        {
            id: "short",
            icon: <FaPlay size={28} />,
            title: "Create Short"
        },
        {
            id: "post",
            icon: <FaPen size={28} />,
            title: "Create Community Post"
        },
        {
            id: "playlist",
            icon: <FaList size={28} />,
            title: "New Playlist"
        }
    ]


    return (
        <div className="bg-[#0f0f0f] min-h-screen text-white px-4 sm:px-6 lg:px-12 py-8 mt-10 flex flex-col">
            {/* Header */}
            <header className="mb-12 border-b border-[#3f3f3f] pb-4 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Create</h1>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">
                    Choose what type of content you want to create for your audience.
                </p>
            </header>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 flex-1">
                {options.map((opt) => (
                    <div
                        key={opt.id}
                        className={`bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-5 sm:p-6 flex flex-col items-center text-center justify-center cursor-pointer transition
        ${selected === opt.id ? "ring-2 ring-orange-500" : "hover:bg-[#272727]"}`}
                        onClick={() => setSelected(opt.id)}
                    >
                        <div className="bg-[#272727] p-4 rounded-full mb-4 text-2xl sm:text-3xl">
                            {opt.icon}
                        </div>
                        <h2 className="text-lg sm:text-xl font-semibold">{opt.title}</h2>
                    </div>
                ))}
            </div>

            {/* Footer Section */}
            <div className="flex flex-col items-center mt-16 sm:mt-20 text-center">
                <img className="w-16 sm:w-20 mb-4" src={create} alt="Create" />

                {!selected ? (
                    <>
                        <p className="mt-2 font-medium text-base sm:text-lg">Create content on any device</p>
                        <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-md">
                            Upload and record at home or on the go. Everything you make public will appear here.
                        </p>
                    </>
                ) : (
                    <>
                        <p className="mt-2 font-medium text-base sm:text-lg">Ready to create?</p>
                        <p className="text-gray-400 text-sm sm:text-base mt-1 max-w-md">
                            Click below to start your{" "}
                            {options.find((opt) => opt.id === selected)?.title.toLowerCase()}.
                        </p>
                        <button className="bg-white mb-15 text-black mt-4 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">
                            + Create
                        </button>
                    </>
                )}
            </div>
        </div>

    )
}

export default CreatePage
