import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../context";
import { Avatar } from "@mui/material";
import { TbLoader } from "react-icons/tb";

export default function Details() {
  const { loading, getRecipeDetails,recipeDetailsData } = useContext(GlobalContext);
  const { id } = useParams();
 

  useEffect(() => {
    getRecipeDetails(id);
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center ">
    <TbLoader className="loader animate-spin h-5 w-5 text-gray-700" />
  </div>;
  }

  if (!recipeDetailsData) {
    return <p className="text-center text-gray-500 text-xl">Recipe not found.</p>;
  }

  // Format the date to be more readable
  const formattedDate = new Date(recipeDetailsData.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className=" min-h-screen mx-auto py-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Recipe Image and Favorite Button */}
      <div className="relative ml-4 ">
      <div className="flex items-center  bg-gray-100 rounded-t-lg px-4">
          <Avatar sx={{ width: 35, height: 35 }} className="my-3" alt={recipeDetailsData.owner.username} src={recipeDetailsData.owner.profile_pic} />
          <div className="ml-3">
            <span className="block text-gray-800 font-medium">{recipeDetailsData.owner?.username || "Unknown User"}</span>
            <span className="text-xs  pt-0 text-gray-500">{formattedDate}</span>
          </div>
        </div>
        <div className="h-96 overflow-hidden rounded-r-xl rounded-l-xl rounded-b-xl rounded-t-none shadow-lg transition-transform transform group">
        
          <img
            alt={recipeDetailsData.name}
            src={recipeDetailsData.imageUrl || "/placeholder.jpg"}
            className="w-full  h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Favorite Button */}
          {/* <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 rounded-full transition duration-300 shadow-sm bg-white bg-opacity-70 hover:bg-opacity-100"
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-2xl" />
            ) : (
              <FaRegHeart className="text-gray-500 text-2xl hover:text-red-500" />
            )}
          </button> */}
        </div>
      </div>

      {/* Recipe Details and Ingredients */}
      <div className="flex flex-col gap-5">
        <div className="bg-white p-6 rounded-lg shadow-md">
        

          {/* Recipe Name */}
          <h3 className="font-bold text-2xl text-gray-800 mb-2">{recipeDetailsData.name}</h3>

          {/* Instructions */}
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Instructions:</span> {recipeDetailsData.instructions}
          </p>

          {/* Cooking Time */}
          <p className="text-gray-600 font-medium">
            <span className="font-semibold">Cooking Time:</span> {recipeDetailsData.cookingTime || "N/A"} minutes
          </p>
        </div>

        {/* Ingredients */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-2xl font-semibold text-gray-800 mb-3">Ingredients:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {recipeDetailsData.ingredients.length > 0 ? (
              recipeDetailsData.ingredients.map((ingredient, idx) => (
                <li key={idx} className="text-lg">
                  {/* <span className="font-medium">{idx + 1}.</span> {ingredient} */}
                  {ingredient}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No ingredients listed.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
