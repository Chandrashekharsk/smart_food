import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../context";
import { FiTrash, FiPlusCircle } from "react-icons/fi";
import { TbLoader3 } from "react-icons/tb";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const EditPost = () => {
  const { id } = useParams();
  const { getEditableRecipe,editPost, editableRecipe,setEditableRecipe, editableImagePreview, setEditableImagePreview } = useContext(GlobalContext);
  const {user} = useSelector((store)=>store.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableRecipe({ ...editableRecipe, [name]: value });
    if (name === "imageUrl") setEditableImagePreview(value);
  };

  const addIngredient = () => {
    setEditableRecipe({ ...editableRecipe, ingredients: [...editableRecipe.ingredients, ""] });
  };

  const removeIngredient = (idx) => {
    const ingredients = editableRecipe.ingredients.filter((_, i) => i !== idx);
    setEditableRecipe({ ...editableRecipe, ingredients });
  };

  const handleIngredientChange = (e, idx) => {
    const { value } = e.target;
    const ingredients = [...editableRecipe.ingredients];
    ingredients[idx] = value;
    setEditableRecipe({ ...editableRecipe, ingredients });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!user){
      toast.error("User not authorized");
      return;
    }
    editPost(id, editableRecipe);
  };

  useEffect(() => {
    getEditableRecipe(id);
    console.log("editable ",editableRecipe)
  }, [id, setEditableImagePreview]);

  if (!editableRecipe ) return <TbLoader3 className="flex justify-center items-center text-2xl" />;

  return (
    <div className="container min-h-screen mx-auto py-10 px-5">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 text-center">Edit Recipe</h2>
        { editableRecipe ?
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {editableImagePreview && (
            <div className="flex justify-center mb-5">
              <img
                src={editableImagePreview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
            </div>
          )}

          {/* Recipe Name */}
          <div className="relative">
            <label htmlFor="name" className="font-medium text-gray-700">
              Recipe Name
            </label>
            <input
              type="text"
              name="name"
              value={editableRecipe.name}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md w-full p-3 transition-transform duration-200 hover:scale-105"
              placeholder="Recipe name"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label htmlFor="ingredients" className="font-medium text-gray-700">
              Ingredients
            </label>
            {editableRecipe?.ingredients?.map((ingredient, idx) => (
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
            <label htmlFor="instructions" className="font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={editableRecipe.instructions}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md w-full p-3 transition-transform duration-200 hover:scale-105"
              placeholder="Step-by-step instructions"
              rows="4"
            ></textarea>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              value={editableRecipe.imageUrl}
              onChange={handleChange}
              name="imageUrl"
              className="mt-1 border border-gray-300 rounded-md w-full p-3 transition-transform duration-200 hover:scale-105"
              placeholder="Paste image URL"
            />
          </div>

          {/* Cooking Time */}
          <div>
            <label htmlFor="cookingTime" className="font-medium text-gray-700">
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              value={editableRecipe.cookingTime}
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
            Save
          </button>
        </form>:
        <h2>Loading...</h2>
        }
      </div>
    </div>
  );
};
