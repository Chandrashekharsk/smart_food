import React from 'react'
import {Link, useNavigate}  from "react-router-dom";
import { useCookies } from 'react-cookie';

export const Navbar = () => {
  
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleLogout = ()=>{
    setCookies("access_token","");
    window.localStorage.removeItem("userID");
    navigate("/auth")
  }

  return (
    <div className='navbar'>
      <Link to={"/"}>Home</Link>
      {!cookies.access_token
      ?<Link to={"/auth"}>Login/Register</Link>
      :(<>
      <Link to={"/create-recipe"}>Create Recipe</Link>
      <Link to={"/saved-recipe"}>Saved Recipe</Link>
      <button onClick={handleLogout}>Logout</button>
      </>)}
    </div>
  )
}
