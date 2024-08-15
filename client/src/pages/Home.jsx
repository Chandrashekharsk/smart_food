import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useGetUserID } from '../hooks/useGetUserID';
import {useCookies} from "react-cookie"

export const Home = () => {
  const userID = useGetUserID()
  const [recipes,setRecipes] = useState([]);
  const [srecipes, setSrecipes] = useState([])
  const [cookies, _] = useCookies(["access_token"])

  const fetchRecipe = async()=>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/recipes`)
      setRecipes(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const savedRec = async()=>{
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/recipes/savedrecipes/${userID}`,{
        headers:{authorization:cookies.access_token}
      })
      console.log("res",res)
      console.log("data",res.data)
      setSrecipes(res.data)
      

    } catch (error) {
      console.error(error)
    }
  }

  const saveRecipe = async(recipeID)=>{
    try {
      // const userID = window.localStorage.getItem("userID")
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/recipes`,
      {
        userID,
        recipeID
      },
      { 
        headers:{authorization:cookies.access_token}
      })
      setSrecipes(response.data.savedRecipes)
      console.log(response.data.savedRecipes)
    } catch (error) {
      console.error(error)
    }
  }
  // check whether recipe is already saved or not
  const isRecipeSaved = (id) => srecipes.includes(id)

  useEffect(()=>{
    if(cookies.access_token) savedRec();
    fetchRecipe()
  }, [])


  return (
    <div>
      <h1 className='heading'>Recipes</h1>
      <ul>
        {recipes.map((recipe)=>(
          <li className='card' key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>

              <button className='save' onClick={()=>saveRecipe(recipe._id)} 
              disabled={isRecipeSaved(recipe._id)}>
                 {isRecipeSaved(recipe._id)?"Saved":"Save"} 
              </button>
            </div>
            <div className='ingredients'>
              <h3>Ingredients</h3>
              {recipe.ingredients.map((ingredient,idx)=>{
                return <p key={idx}>{idx+1}. {ingredient}</p>
              })}
            </div>
            <img src={recipe.imageUrl?recipe.imageUrl:""} alt={recipe.name} />
            <div className='instructions'>
              <h3>Instructions</h3>
              <p>{recipe.instructions?recipe.instructions:"No instructions"}</p>
            </div>
            <p className='txt'>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
