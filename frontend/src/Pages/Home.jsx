


import React, { useRef, useState } from "react";
import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import logo from "../assets/playTube1.png";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../component/Profile";
import { serverUrl } from "../App"; // Make sure serverUrl is imported
import AllVideosPage from "../component/AllVideosPage";
import AllShortsPage from "../component/AllShortsPage";
import { showCustomAlert } from "../component/CustomAlert";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import SearchResults from "../component/SearchResults";
import FilterResults from "../component/FilterResults";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, subscribedChannel } = useSelector((state) => state.user);
  const [popup, setPopup] = useState(false);


  // const [searchPopup, setSearchPopup] = useState(false)
  // const [listening, setListening] = useState()
  // const [input, setInput] = useState("")
  // const [loading, setLoading] = useState(false)
  // const [searchData, setSearchData] = useState("")


  // function speak(message) {
  //   let utterance = new SpeechSynthesisUtterance(message)
  //   window.speechSynthesis.speak(utterance)
  // }

  // const recognitionRef = useRef()

  // if (!recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   recognitionRef.current = new SpeechRecognition()
  //   recognitionRef.current.continuous = false
  //   recognitionRef.current.interimResults = false
  //   recognitionRef.current.lang = "en-US"
  // }



  // const handleSearch = async ()=> {
  //   if (!recognitionRef.current) {
  //     showCustomAlert("Speech recognition not supported in your browser")
  //     return
  //   }
  //   if (listening) {
  //     recognitionRef.current.stop()
  //     setListening(false)
  //     return
  //   }
  //   setListening(true)
  //   recognitionRef.current.start()
  //   recognitionRef.current.onresult = async (e)=> {
  //     const transcript = e.results[0][0]?.transcript.trim()
  //     setInput(transcript)
  //     setListening(false)
  //     await handleSearchData(transcript)
  //   }
  //   recognitionRef.current.onerror = (err)=> {
  //     console.error("Recognition error:", err)
  //     setListening(false)

  //      if (err.error === "no-speech") {
  //       showCustomAlert("No speech detected. Please try again.")
  //     } else {
  //       showCustomAlert("Voice search failed. Try again.")
  //     }
  //   }

  //   recognitionRef.current.opend = ()=> {
  //     setListening(false)
  //   }
  // }

  // const handleSearchData = async (query)=> {
  //   setLoading(true)
  //   try {
  //     const result = await axios.post(serverUrl + "/api/content/search", {input:query}, {withCredentials:true})
  //     setSearchData(result.data)
  //     console.log(result.data)
  //     setInput("")
  //     setSearchPopup(false)
  //     setLoading(false)

  //     const {videos = [], shorts = [], playlists = [], channels = []} = result.data;

  //     if (
  //       videos.length > 0 ||
  //       shorts.length > 0 ||
  //       playlists.length > 0 ||
  //       channels.length > 0 
  //     ) {
  //       speak("These are the top search resuls")
  //     } else {
  //       speak("No results found")
  //     }

  //   } catch (error) {
  //     console.log(error)
  //     setLoading(false)
  //   }
  // }

  const [searchPopup, setSearchPopup] = useState(false)
  const [listening, setListening] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [searchData, setSearchData] = useState("")
  const [filterData, setFilterData] = useState("")



  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message)
    window.speechSynthesis.speak(utterance)
  }

  const recognitionRef = useRef()

  if (!recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-US"
  }

  const handleSearch = async () => {
    if (!recognitionRef.current) {
      showCustomAlert("Speech recognition not supported in your browser")
      return
    }

    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
      return
    }

    setListening(true)
    recognitionRef.current.start()

    recognitionRef.current.onresult = async (e) => {
      const transcript = e.results[0][0]?.transcript.trim()
      setInput(transcript)
      setListening(false)
      await handleSearchData(transcript)
    }

    recognitionRef.current.onerror = (err) => {
      console.error("Recognition error:", err)
      setListening(false)
      setLoading(false)

      if (err.error === "no-speech") {
        showCustomAlert("No speech detected. Please try again.")
      } else {
        showCustomAlert("Voice search failed. Try again.")
      }
    }

    // ✅ fixed typo: opend → onend
    recognitionRef.current.onend = () => {
      setListening(false)
    }
  }

  const handleSearchData = async (query) => {
    if (!query || query.trim() === "") {
      showCustomAlert("Please say or type something to search")
      return
    }

    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/content/search", { input: query }, { withCredentials: true })
      setSearchData(result.data)
      console.log(result.data)
      setInput("")
      setSearchPopup(false)

      const { videos = [], shorts = [], playlists = [], channels = [] } = result.data

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        playlists.length > 0 ||
        channels.length > 0
      ) {
        speak("These are the top search results")
      } else {
        speak("No results found")
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      // ✅ ensures loading always stops even on error
      setLoading(false)
    }
  }




  const categories = [
    "Music",
    "Gaming",
    "Movies",
    "TV Shows",
    "News",
    "Trending",
    "Entertainment",
    "Education",
    "Science & Tech",
    "Travel",
    "Fashion",
    "Cooking",
    "Sports",
    "Pets",
    "Art",
    "Comedy",
    "Vlogs",
  ];

  const handleCategoryFilter = async (category)=> {
    setLoading1(true)
    try {
      const result = await axios.post(serverUrl + "/api/content/filter", {input:category}, {withCredentials:true}) 

      const { videos = [], shorts = [], channels = [] } = result.data;

      let channelVideos = []
      let channelShorts = []

      channels.forEach((ch)=> {
        if (ch.videos?.length) channelVideos.push(...ch.videos)
          if(ch.shorts?.length) channelShorts.push(...ch.shorts)
      })

      setFilterData({
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      })

      setLoading1(false)
      navigate("/")

      console.log("Category filter merged:", {
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts]
      })

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        channelVideos.length > 0 ||
        channelShorts.length > 0
      ) {
        speak(`Here are some ${category} videos and shorts for you`)
      } else {
        speak("No result found")
      }
    } catch (error) {
      console.log("Category filter error:", error)
      setLoading1(false)
    }
  }



  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">

      {searchPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div
            className="bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-[400px] sm:min-h-[480px] 
      p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={() => setSearchPopup(false)}
            >
              <FaTimes size={22} />
            </button>

            {/* Listening Status */}
            <div className="flex flex-col items-center gap-3">
              {listening ? (
                <h1 className="text-xl sm:text-2xl font-semibold text-orange-400 animate-pulse">
                  Listening...
                </h1>
              ) : (
                <h1 className="text-lg sm:text-xl font-medium text-gray-300">
                  Speak or type your query
                </h1>
              )}

              {/* Spoken or Typed Query Display */}
              {input && (
                <span
                  className="text-center text-lg sm:text-xl text-gray-200 px-4 py-2 rounded-lg bg-[#2a2a2a]/60 break-words"
                >
                  {input}
                </span>
              )}

              {/* Text Input (Visible on Mobile) */}
              <div className="flex w-full gap-2 md:hidden mt-4">
                <input
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  type="text"
                  className="flex-1 px-3 py-2 rounded-full bg-[#2a2a2a]
             text-white outline-none border border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-500
            transition"
                  placeholder="Type your search"
                  disabled={loading}
                />
                <button
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full text-white
            font-semibold shadow-md transition disabled:opacity-50 flex items-center justify-center"
                  onClick={() => handleSearchData(input)}
                  disabled={loading || !input.trim()}
                >
                  {loading ? <ClipLoader size={20} color="white" /> : <FaSearch />}
                </button>
              </div>
            </div>

            {/* Mic Button */}
            <button
              className="p-6 rounded-full shadow-xl transition-all duration-300 
        transform hover:scale-110 bg-orange-500 hover:bg-orange-600 shadow-orange-500/40 flex items-center justify-center"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : <FaMicrophone size={24} />}
            </button>
          </div>
        </div>
      )}


      {/* Navbar */}
      <header className="bg-[#0f0f0f] h-[60px] p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xl bg-[#272727] p-2 rounded-full hidden md:inline"
            >
              <FaBars />
            </button>
            <div className="flex items-center gap-[5px]">
              <img src={logo} alt="PlayTube Logo" className="w-[30px]" />
              <span className="text-white font-bold text-xl tracking-tight font-roboto">
                PlayTube
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1">
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700"
                placeholder="Search"
              />
              <button onClick={() => handleSearchData(input)} className="bg-[#272727] px-4 rounded-r-full border border-gray-700">
                {loading ? <ClipLoader size={20} color="white" /> : <FaSearch />}
              </button>
            </div>
            <button className="bg-[#272727] p-3 rounded-full cursor-pointer" onClick={() => setSearchPopup(!searchPopup)}>
              <FaMicrophone />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {userData?.channel && (
              <button onClick={() => navigate("/create")} className="hidden md:flex items-center gap-1 py-1 rounded-full bg-[#272727] px-3 cursor-pointer">
                <span className="text-lg">+</span>
                <span className="text-lg">Create</span>
              </button>
            )}
            {userData && userData.photoUrl ? (
              <img
                src={userData?.photoUrl}
                alt="User Avatar"
                onClick={() => setPopup((prev) => !prev)}
                className="w-9 h-9 rounded-full object-cover border border-gray-700 hidden md:flex cursor-pointer"
                onError={(e) => {
                  // fallback if Google image fails to load
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            ) : (
              <FaUserCircle
                onClick={() => setPopup((prev) => !prev)}
                className="text-3xl hidden md:flex text-gray-400 cursor-pointer"
              />
            )}


            <FaSearch className="text-lg md:hidden flex" onClick={() => setSearchPopup(!searchPopup)} />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 z-40
          ${sidebarOpen ? "w-60" : "w-20"} hidden md:flex flex-col overflow-y-auto`}
      >
        <nav className="space-y-1 mt-3">
          <SidebarItem
            icon={<FaHome />}
            text="Home"
            open={sidebarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
          />
          <SidebarItem
            icon={<SiYoutubeshorts />}
            text="Shorts"
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => { setSelectedItem("Subscriptions"); navigate("/subscription") }}
          />
        </nav>

        <hr className="border-gray-800 my-3" />
        {sidebarOpen && <p className="text-sm text-gray-400 px-2">You</p>}
        <nav className="space-y-1 mt-3">
          <SidebarItem
            icon={<FaHistory />}
            text="History"
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => { setSelectedItem("History"); navigate("/history") }}
          />
          <SidebarItem
            icon={<FaList />}
            text="Playlists"
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => { setSelectedItem("Playlists"); navigate("/savedplaylist") }}
          />
          <SidebarItem
            icon={<GoVideo />}
            text="Saved Videos"
            open={sidebarOpen}
            selected={selectedItem === "Saved Videos"}
            onClick={() => { setSelectedItem("Saved Videos"); navigate("/savedcontent") }}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text="Liked Videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => { setSelectedItem("Liked Videos"); navigate("/likedcontent") }}
          />
        </nav>

        <hr className="border-gray-800 my-3" />
        {sidebarOpen && <p className="text-sm text-gray-400 px-2">Subscriptions</p>}
        <div className="space-y-1 mt-1">
          {subscribedChannel?.map((ch) => (
            <button
              key={ch?._id}
              onClick={() => (setSelectedItem(ch?._id), navigate(`/channelpage/${ch?._id}`))}

              className={`flex items-center ${sidebarOpen ? "gap-3 justify-start" : "justify-center"
                } w-full text-left cursor-pointer p-2 rounded-lg transition ${selectedItem === ch._id ? "bg-[#272727]" : "hover:bg-gray-800"
                }`}
            >
              <img src={ch?.avatar} className="w-6 h-6 rounded-full border border-gray-700 object-cover hover:scale-110 transition-transform duration-200" alt="" />
              {sidebarOpen && <span className="text-sm text-white truncate">{ch?.name}</span>}

            </button>
          ))}

        </div>
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-300 pt-[70px] p-6 ${sidebarOpen ? "md:ml-60" : "md:ml-20"
          }`}
      >
        {location.pathname === "/" && (
          <>
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-2">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={()=>handleCategoryFilter(cat)}
                  className="whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700"
                >
                  {cat}
                </button>
              ))}
              {popup && <Profile />}
            </div>
            <div className="mb-10">
              {loading1 && <div className="w-full items-center flex justify-center">{loading1 ? <ClipLoader size={35} color="white" /> : ""}</div>}
              {searchData && <SearchResults searchResults={searchData}/>}
              {filterData && <FilterResults filterResults={filterData}/>}

              <AllVideosPage />
              <AllShortsPage />
            </div>
          </>
        )}
        <div className="mt-2">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-50">
        <MobileNavButton
          icon={<FaHome />}
          text="Home"
          active={active === "Home"}
          onClick={() => {
            setActive("Home");
            navigate("/");
          }}
        />
        <MobileNavButton
          icon={<SiYoutubeshorts />}
          text="Shorts"
          active={active === "Shorts"}
          onClick={() => { setActive("Shorts"); navigate("/shorts") }}
        />
        <MobileNavButton
          icon={<IoIosAddCircle size={28} />}
          active={active === "+"}
          onClick={() => { setActive("+"); navigate("/create") }}
        />
        <MobileNavButton
          icon={<MdOutlineSubscriptions />}
          text="Subscriptions"
          active={active === "Subscriptions"}
          onClick={() => { setActive("Subscriptions"); navigate("/subscription") }}
        />
        <MobileNavButton
          icon={
            !userData?.photoUrl ? (
              <FaUserCircle />
            ) : (
              <img
                src={
                  userData.photoUrl.startsWith("http")
                    ? userData.photoUrl
                    : `${serverUrl}${userData.photoUrl}`
                }
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
            )
          }
          text="You"
          active={active === "You"}
          onClick={() => {
            setActive("You");
            navigate("/mobilepro"); // just navigate, don't check login here
          }}
        />

      </nav>
    </div>
  );
};

// Sidebar Button Component
function SidebarItem({ icon, text, open, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${open ? "justify-start" : "justify-center"
        } ${selected ? "bg-[#272727]" : "hover:bg-[#272727]"}`}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </button>
  );
}

// Mobile Bottom Nav Button
function MobileNavButton({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${active ? "text-white" : "text-gray-400"
        } hover:scale-105`}
    >
      <span className="text-2xl">{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
}

export default Home;
