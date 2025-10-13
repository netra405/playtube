import React, { useState } from "react";
import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import logo from "../assets/playTube1.png";
import { Outlet, useNavigate } from "react-router-dom";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate()

  const categories = [
    "Music","Gaming","Movies","TV Shows","News","Trending",
    "Entertainment","Education","Science & Tech","Travel",
    "Fashion","Cooking","Sports","Pets","Art","Comedy","Vlogs"
  ];

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
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
                type="text"
                className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700"
                placeholder="Search"
              />
              <button className="bg-[#272727] px-4 rounded-r-full border border-gray-700">
                <FaSearch />
              </button>
            </div>
            <button className="bg-[#272727] p-3 rounded-full cursor-pointer">
              <FaMicrophone />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-1 py-1 rounded-full bg-[#272727] px-3 cursor-pointer">
              <span className="text-lg">+</span>
              <span>Create</span>
            </button>
            <FaUserCircle className="text-3xl hidden md:flex text-gray-400 cursor-pointer" />
            <FaSearch className="text-lg md:hidden flex" />
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
            onClick={() => {setSelectedItem("Home"); navigate("/")}}
          />
          <SidebarItem
            icon={<SiYoutubeshorts />}
            text="Shorts"
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {setSelectedItem("Shorts"); navigate("/shorts")}}
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => setSelectedItem("Subscriptions")}
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
            onClick={() => setSelectedItem("History")}
          />
          <SidebarItem
            icon={<FaList />}
            text="Playlists"
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => setSelectedItem("Playlists")}
          />
          <SidebarItem
            icon={<GoVideo />}
            text="Saved Videos"
            open={sidebarOpen}
            selected={selectedItem === "Saved Videos"}
            onClick={() => setSelectedItem("Saved Videos")}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text="Liked Videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => setSelectedItem("Liked Videos")}
          />
        </nav>

        <hr className="border-gray-800 my-3" />
        {sidebarOpen && <p className="text-sm text-gray-400 px-2">Subscriptions</p>}
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-300 pt-[70px] p-6 ${
          sidebarOpen ? "md:ml-60" : "md:ml-20"
        }`}
      >
      
       {location.pathname === "/" &&
       <>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-2">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className="whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700"
            >
              {cat}
            </button>
          ))}
        </div>
       </>}
        <div className="mt-2">
            <Outlet/>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-50">
        <MobileNavButton
          icon={<FaHome />}
          text="Home"
          active={active === "Home"}
          onClick={() => setActive("Home")}
        />
        <MobileNavButton
          icon={<SiYoutubeshorts />}
          text="Shorts"
          active={active === "Shorts"}
          onClick={() => setActive("Shorts")}
        />
        <MobileNavButton
          icon={<IoIosAddCircle size={28} />}
          active={active === "+"}
          onClick={() => setActive("+")}
        />
        <MobileNavButton
          icon={<MdOutlineSubscriptions />}
          text="Subscriptions"
          active={active === "Subscriptions"}
          onClick={() => setActive("Subscriptions")}
        />
        <MobileNavButton
          icon={<FaUserCircle />}
          text="You"
          active={active === "You"}
          onClick={() => setActive("You")}
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
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${
        open ? "justify-start" : "justify-center"
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
      className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
        active ? "text-white" : "text-gray-400"
      } hover:scale-105`}
    >
      <span className="text-2xl">{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
}

export default Home;
