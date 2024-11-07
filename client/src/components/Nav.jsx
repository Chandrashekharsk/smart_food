import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/index";
import { FaHeart } from "react-icons/fa";
import { IoMdBookmarks, IoIosSearch } from "react-icons/io";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Nav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [picPreview, setPicPreview] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const { user, loading, setSearchResults, fetchRecipes, searching, logout, editProfilePicture, deleteProfilePicture, init, page, handleSearch } = useContext(GlobalContext);
  const dropdownRef = useRef(null);
  const picInputRef = useRef(null);

  const handleDeletePicture = () => {
    if (!user) {
      toast.error("User not authorized");
      return;
    }
    setDeleting(true);
    deleteProfilePicture();
    setShowPopup(false);
    picInputRef.current.files = null;
    setPicPreview(null);
    setDeleting(false);
  };

  const handleEditProfilePicture = async () => {
    if (!user) {
      toast.error("User not authorized");
      return;
    }
    const pic = picInputRef.current?.files[0];
    if (!pic) {
      toast.error("Please select a file");
      return;
    }
    await editProfilePicture(pic);
    setShowPopup(false);
    picInputRef.current = null;
  };

  const handleUploadNewPicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicPreview(URL.createObjectURL(file)); 
    }
  };

  useEffect(() => {
    init();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };


  const handleclick=async ()=>{
    setSearchResults(null);
    fetchRecipes(page);
  }

  return (
    <nav className="flex flex-col lg:flex-row lg:justify-between items-center p-4 lg:px-8 shadow-lg bg-gray-100 gap-4 lg:gap-0 w-full">
      <h2 className="text-2xl font-semibold text-center lg:text-left">
        <NavLink onClick={handleclick} className="text-violet-700" to={"/"}>
          S͙M͙A͙R͙T͙ F͙O͙O͙D͙
        </NavLink>
      </h2>

      <form className="relative flex items-center justify-center w-full lg:w-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          placeholder="Enter keywords..."
          className="w-full lg:w-96 p-2 pl-8 rounded-full outline-none bg-white/75 shadow-lg shadow-blue-200 focus:shadow-red-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searching ? 
          <AiOutlineLoading3Quarters className="absolute right-4 animate-spin text-xl h-4 w-4" /> :
          <IoIosSearch className="absolute right-4 text-xl cursor-pointer" />
        }
      </form>

      <ul className="flex gap-5 items-center text-center">
        {user ? (
          <>
            <li>
              <NavLink to={"/create-recipe"} className="text-gray-600 hover:text-gray-700 transition duration-300">
                <FiPlus className="text-4xl" />
              </NavLink>
            </li>
            <li>
              <NavLink to={"/liked-posts"} className="text-gray-600 hover:text-gray-700 transition duration-300">
                <FaHeart className="text-3xl" />
              </NavLink>
            </li>
            <li>
              <NavLink to={"/favorites"} className="text-gray-600 hover:text-gray-700 transition duration-300">
                <IoMdBookmarks className="text-4xl" />
              </NavLink>
            </li>
            <li className="relative">
              <button onClick={() => setShowDropdown((prev) => !prev)} className="flex items-center focus:outline-none">
                <Stack direction="row" spacing={2}>
                  <Avatar
                    className="outline outline-blue-500"
                    alt={user.username ? user.username.charAt(0).toUpperCase() : ""}
                    src={user.profile_pic}
                  />
                </Stack>
              </button>
              {showDropdown && (
                <div ref={dropdownRef} className="absolute mt-3 right-0 min-w-40 bg-white rounded-lg shadow-lg z-10">
                  <button onClick={() => setShowPopup(true)} className="block py-2 w-full text-gray-800 hover:bg-gray-200 transition duration-300">
                    Edit Picture
                  </button>
                  <button onClick={logout} className="block py-2 w-full text-white bg-red-500 hover:bg-red-400 transition duration-300">
                    Logout
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          <li>
            <NavLink to={"/login"} className="rounded-full border-2 border-blue-400 py-1 px-4 text-gray-700 font-bold shadow-md hover:bg-blue-50 transition">
              Login
            </NavLink>
          </li>
        )}
      </ul>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full">
            <div className="flex justify-end">
              <button onClick={() => setShowPopup(false)} className="text-gray-700 p-1 rounded-full">X</button>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-center">Edit Profile Picture</h3>
            <div className="flex justify-center mb-4">
              {user.profile_pic ? (
                <Avatar alt={user.username} src={user.profile_pic} sx={{ width: 100, height: 100 }} />
              ) : (
                <Avatar sx={{ width: 100, height: 100 }} />
              )}
            </div>
            <div className="flex flex-col gap-3 items-center">
              <button onClick={handleDeletePicture} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                {deleting ? "Please wait..." : "Delete Picture"}
              </button>
              {picPreview && <Avatar sx={{ width: 100, height: 100 }} alt="preview" src={picPreview} />}
              <input
                ref={picInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadNewPicture}
                className="text-sm text-gray-600 file:py-2 file:px-4 file:rounded-lg file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {picPreview && <button onClick={handleEditProfilePicture} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              {loading? "Uploading...": "Upload"}
              </button>}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
