import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useGetUserID } from '../hooks/useGetUserID'
import { useCookies } from 'react-cookie'


export const SavedRecipe = () => {

  const userID = useGetUserID();
  const [savedRecipes, setSavedRecipes] = useState([])
  const [cookies, _] = useCookies(["access_token"])

  const getRecipes = async()=>{
    try{
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/recipes/savedrecipes/${userID}`,
      {
        headers: {authorization:cookies.access_token}
      })
      console.log(res.data)
      setSavedRecipes(res.data)
      console.log("savedRecipes",savedRecipes)
    
    } catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    getRecipes();
  }, [])

  return (
    <div>
    <h1 className='heading'>Saved Recipes</h1>
    <ul>
      {savedRecipes.map((recipe)=>(
        <li className='card' key={recipe._id}>
          <div>
            <h2>{recipe.name}</h2>
          </div>
          <div className='ingredients'>
              <h3>Ingredients</h3>
              {recipe.ingredients.map((ingredient,idx)=>{
                return <p key={idx}>{idx+1}. {ingredient}</p>
              })}
            </div>
            <img src={recipe.imageUrl?recipe.imageUrl:""} alt={recipe.name} />
          <h3>Instructions</h3>
          <div className='instructions'>
            <p>{recipe.instructions?recipe.instructions:"No instructions"}</p>
          </div>
          <p className='txt'>Cooking Time: {recipe.cookingTime} minutes</p>
        </li>
      ))}
    </ul>
  </div>
  )
}
