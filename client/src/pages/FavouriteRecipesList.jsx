import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/index";
import { toast } from "react-toastify";
import { Avatar } from "@mui/material";
import {
  FaEllipsisH,
  FaRegHeart,
  FaHeart,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { TbLoader3, TbLoader } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { Heart } from "lucide-react";


const FavouriteRecipesList = () => {
  const {
    user,
    favoriteRecipes,
    recipesList,
    addToFavorites,
    loading,
    likedPosts,
    setLoading,
    searchResults,
    setRecipesList,
    fetchRequired,
    likePost,
    dislikePost,
    deletePost,
  } = useContext(GlobalContext);

  const [activePopup, setActivePopup] = useState(null);
  const [favoriteItem, setFavoriteItem] = useState();


  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchRequired();
        if (searchResults) {
          setRecipesList(searchResults);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    let filteredRecipes = recipesList.filter((item) => favoriteRecipes.includes(item._id));
    setFavoriteItem(filteredRecipes);
  }, []);

  const togglePopup = (id) => {
    setActivePopup((prev) => (prev === id ? null : id));
  };

  const handleDeletePost = (id) => {
    deletePost(id);
  };


  return (
    <div className=" min-h-screen mx-auto py-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-10">
        Bookmarked Posts
      </h1>

      <div className={`flex flex-wrap justify-center  gap-8`}>
        {favoriteItem?.length > 0 ? (
          favoriteItem.map((item) => (
            <div
              key={item._id}
              className="max-w-xs w-full sm:w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105"
            >
              {!loading ? (
                <>
                  <div className="flex justify-between items-center px-4 py-2">
                    <div className="flex items-center">
                      <Avatar
                        sx={{ width: 35, height: 35 }}
                        alt={item.owner?.username}
                        src={item.owner?.profile_pic}
                      />
                      <div className="ml-3">
                        <span className="block text-gray-700 font-medium">
                          {item.owner?.username || "Unknown User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.updatedAt &&
                            new Date(item.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {/* Dynamic Delete Button - Left of Ellipsis Button */}
                      {user && activePopup === item._id && (
                        ((user.id).toString() === (item.owner._id).toString()) ?
                          (<>
                            <div className="relative left-auto text-sm  z-50  mr-4">
                              <Link to={`/edit-post/${item._id}`}>
                                <FiEdit className="text-blue-600 hover:cursor-pointer h-6 w-6" />
                              </Link>
                            </div>
                            <div className="relative left-auto text-sm hover:cursor-pointer z-50 mr-4">
                              <MdDelete className="text-red-500 h-7 w-7" onClick={() => handleDeletePost(item._id)} />
                            </div>
                          </>) :
                          (<>
                            {/* <div className="relative left-auto text-sm  z-50  mr-4">
                            <FiEdit className="text-blue-600 hover:cursor-pointer h-6 w-6" onClick={() => handleDeletePost(item._id)}/>
                          </div> */}
                            <div className="relative left-auto text-sm hover:cursor-pointer z-50 mr-4">
                              <Heart className="text-red-500 h-7 w-7" onClick={() => handleDeletePost(item._id)} />
                            </div>
                          </>)
                      )}
                      {/* Ellipsis Button */}
                      {user?.id === item.owner._id && 
                      <button
                        onClick={() => togglePopup(item._id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaEllipsisH />
                      </button>}
                    </div>
                  </div>

                  <div className="h-48 sm:h-56 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mt-1 mb-4 text-sm sm:text-base">
                      {item.instructions.split(".")[0]}...
                    </p>

                    <div className="flex justify-between items-center">
                      <Link
                        to={`/recipe-item/${item._id}`}
                        className="text-xs sm:text-sm py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800"
                      >
                        Show Details
                      </Link>
                      <div className="flex space-x-4">
                        <button
                          className="text-gray-400"
                          onClick={() =>
                            likedPosts?.includes(item._id) ? dislikePost(item._id) : likePost(item._id)
                          }
                        >
                          {likedPosts?.includes(item._id) ? (
                            <div className="flex flex-row justify-center gap-2 items-center">
                              <FaHeart className="text-lg text-red-500  sm:text-2xl" />
                              <span>{item.likes.length}</span>
                            </div>
                          ) : (
                            <div className="flex flex-row justify-center gap-2 items-center">
                              <FaRegHeart className="text-lg text-gray-500 sm:text-2xl" />
                              <span>{item.likes.length}</span>
                            </div>

                          )}
                        </button>
                        <button onClick={() => addToFavorites(item._id)}
                          className="text-gray-400"
                        >
                          {favoriteRecipes?.includes(item._id) ? (
                            <FaBookmark className="text-lg sm:text-2xl font-bold text-gray-500 " />
                          ) : (
                            <FaRegBookmark className="text-lg font-bold sm:text-2xl text-gray-500 " />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center ">
                  <TbLoader className="loader animate-spin h-5 w-5 text-gray-700" />
                </div>
              )}

            </div>
          ))
        ) : (
          loading ?
            <TbLoader3 className=" loader  animate-spin h-16 w-16 text-violet-600" /> :
            <h2>No results found!</h2>
        )}
      </div>
    </div>
  );
};

export default FavouriteRecipesList;


