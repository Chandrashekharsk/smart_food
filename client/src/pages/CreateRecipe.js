import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const navigate = useNavigate()

  const [cookies, _] = useCookies(["access_token"])
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    owner: userID,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
    console.log(recipe);
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
    console.log(recipe);
  };

  const handleIngredientChange = (e, idx) => {
    const { value } = e.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
    console.log(recipe);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/recipes",
      recipe,
      {
        headers:{authorization:cookies.access_token}
      });
      alert("Recipe created");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form action="" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" onChange={handleChange} />
        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingrendient, idx) => (
          <input
            key={idx}
            type="text"
            name="ingredients"
            id="ingredients"
            value={ingrendient}
            onChange={(e) => handleIngredientChange(e, idx)}
          />
        ))}

        <button type="button" onClick={addIngredient}>
          Add Ingredient
        </button>
        <label htmlFor="instructions">Instructions</label>
        <textarea
          name="instructions"
          onChange={handleChange}
          cols="10"
          rows="3"
        ></textarea>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          onChange={handleChange}
          name="imageUrl"
          id="imageUrl"
        />
        <label htmlFor="cookingTime">Cooking Time(minutes) </label>
        <input type="number" onChange={handleChange} name="cookingTime" />
        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
};

// let recipe = {flower:"rose", animal:"lion"}
// recipe = ({...recipe,[log]:"wolf"})
// console.log(recipe)

// const recipe = {flower:"rose", animal:"lion"}
// const update = ({...recipe,animal:"wolf"})
// console.log(update)
// const recipe = {flower:"rose", animal:"lion"}
// const update = ({...recipe,metal:"diamond"})
// console.log(update)
