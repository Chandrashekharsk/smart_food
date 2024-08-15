import React, { useState } from "react";
import axios from "axios"
import {useCookies} from "react-cookie"
import { useNavigate } from "react-router-dom";


export const Auth = () => {
  return (
    <div className="auth">
      <Register />
      <Login />
    </div>
  );
};


export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
        console.log("env: "+process.env.REACT_APP_API_URL);
      console.log("username info:"+username+" "+password);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`,
        {
          username,
          password
        }
      )
      .then((res)=>{
        console.log(res)
        alert("Registration Successful")
      })
      .catch((err)=>{
        console.log(err)
        alert("Oops! couldn't register.")
      })
      setUsername("");
      setPassword("")

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Register"
      onSubmit={handleSubmit}
    />
  );
};


export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["access_token"])
  const navigate = useNavigate()

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`,
        {username, password}
      )
      .then((res)=>{
        console.log(res)
        console.log(res.data)
        alert("Login Successful")
        setUsername("");
        setPassword("")
        setCookies("access_token", res.data.token);
        window.localStorage.setItem("userID", res.data.userID)
        navigate("/");
      })
      .catch((err)=>{
        console.log(err)
        alert("Oops! couldn't login.")
      })

      

    }catch(err){
      console.error(err)
    }
  }

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={handleSubmit}
    />
  );
};


const Form = ({ username, setUsername, password, setPassword, label, onSubmit }) => {
  return (
    <div className="auth-container">
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>
        <div className="form-group">
          <label htmlFor="username">username:</label>
          <input
            value={username}
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">password:</label>
          <input
            value={password}
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{label}</button>
      </form>
    </div>
  );
};
