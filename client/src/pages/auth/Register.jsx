import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import banner from "../../assets/newlg.jpeg";
import { GlobalContext } from "../../context";

const RegisterSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .refine((val) => val === val.toLowerCase(), {
      message: "Username must be in lowercase",
    }),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

const Register = () => {
  const {onRegister, loading} = useContext(GlobalContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });
  
  


  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
      {/* Registration Form */}
      <div className="bg-white shadow-lg rounded-l-lg p-8 w-full max-w-md h-[550px] flex flex-col justify-center">
        <form onSubmit={handleSubmit(onRegister)}>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Register
          </h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username <span className="text-red-400">*</span> :
            </label>
            <input
              {...register("username")}
              type="text"
              placeholder="username"
              id="username"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 transition duration-200"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password <span className="text-red-400">*</span> :
            </label>
            <input
              {...register("password")}
              placeholder="password"
              type="password"
              id="password"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 transition duration-200"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105"
          >
            {loading ? "Loading..." : "Register"}
          </button>
          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>

      {/* Banner Image */}
      <div className="hidden md:block bg-white rounded-r-lg w-full max-w-md h-[550px] overflow-hidden">
        <img src={banner} alt="Registration banner" className="object-cover w-full h-full" />
      </div>
    </div>
  );
};

export default Register;
