import React, { useState, useContext } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import { GlobalContext } from "../context";
import { FiTrash, FiPlusCircle } from "react-icons/fi"; // Icons for add/delete

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const { createRecipe } = useContext(GlobalContext); // Access global favorites
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    owner: userID,
  });

  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
    if (name === "imageUrl") setImagePreview(value);
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const removeIngredient = (idx) => {
    const ingredients = recipe.ingredients.filter((_, i) => i !== idx);
    setRecipe({ ...recipe, ingredients });
  };

  const handleIngredientChange = (e, idx) => {
    const { value } = e.target;
    const ingredients = [...recipe.ingredients];
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    createRecipe(recipe);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      {/* Create Recipe Form */}
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 text-center">Create a New Recipe</h2>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {/* Image Preview */}
          {imagePreview && (
            <div className="flex justify-center mb-5">
              <img src={imagePreview} alt="Preview" className="w-32 h-32 rounded-full object-cover shadow-md" />
            </div>
          )}
          
          {/* Recipe Name */}
          <div className="relative">
            <label htmlFor="name" className="font-medium text-gray-700">Recipe Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md w-full p-3 transition-transform duration-200 hover:scale-105"
              placeholder="Recipe name"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label htmlFor="ingredients" className="font-medium text-gray-700">Ingredients</label>
            {recipe.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  name="ingredients"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(e, idx)}
                  className="border border-gray-300 rounded-md w-full p-2"
                  placeholder={`Ingredient ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-150"
                  title="Remove Ingredient"
                >
                  <FiTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center text-blue-600 mt-3 font-semibold"
              title="Add another ingredient"
            >
              <FiPlusCircle className="mr-1" /> Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="instructions" className="font-medium text-gray-700">Instructions</label>
            <textarea
              name="instructions"
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md w-full p-3 transition-transform duration-200 hover:scale-105"
              placeholder="Step-by-step instructions"
              rows="4"
            ></textarea>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              onChange={handleChange}
              name="imageUrl"
              className="mt-1 border border-gray-300 rounded-md w-full p-3 transition-transform duration-200 hover:scale-105"
              placeholder="Paste image URL"
            />
          </div>

          {/* Cooking Time */}
          <div>
            <label htmlFor="cookingTime" className="font-medium text-gray-700">Cooking Time (minutes)</label>
            <input
              type="number"
              onChange={handleChange}
              name="cookingTime"
              className="mt-1 border border-gray-300 rounded-md w-full p-3 transition-transform duration-200 hover:scale-105"
              placeholder="e.g., 30"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-md mt-6 font-semibold transition-transform duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            Create Recipe
          </button>
        </form>
      </div>
    </div>
  );
};
