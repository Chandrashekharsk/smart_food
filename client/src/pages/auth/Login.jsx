import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import 'react-toastify/dist/ReactToastify.css';
import banner from "../../assets/newlg.jpeg";

const LoginSchema = z.object({
  username: z.string()
    .min(1, "Username is required")
    .refine((val) => val === val.toLowerCase(), { message: "Username must be in lower case" }),
  password: z.string()
    .min(4, "Password must be at least 4 characters long"),
  pic: z.any().optional(),
});

const Login = () => {
  const { onLogin, loading } = useContext(GlobalContext);
  const [picPreview, setPicPreview] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) setPicPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 ">
      <div className="flex flex-col mx-9 md:mx-auto md:flex-row items-center justify-center w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
            <h2 className="text-3xl font-bold text-center md:text-left text-gray-800 mb-6">Login</h2>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-400">*</span> :
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="username"
                id="username"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 transition duration-200"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-400">*</span> :
              </label>
              <input
                {...register("password")}
                placeholder="password"
                type="password"
                id="password"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 transition duration-200"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="profile" className="block text-sm font-medium text-gray-700">
                Profile Picture (optional):
              </label>
              <input
                {...register("pic")}
                onChange={handleChange}
                type="file"
                id="profile"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 transition duration-200"
              />
              {picPreview && <img src={picPreview} alt="profile preview" className="mt-4 rounded-full h-20 w-20 object-cover mx-auto" />}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105"
            >
              {loading ? "Loading..." : "Login"}
            </button>
            
            <p className="mt-4 text-center text-sm">
              Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
            </p>
          </form>
        </div>

        <div className="hidden md:block bg-white rounded-r-lg w-full max-w-md h-[550px] overflow-hidden">
        <img src={banner} alt="Registration banner" className="  md:pt-1 md:pb-7 object-cover w-full h-full" />
      </div>
      </div>
    </div>
  );
};

export default Login;
