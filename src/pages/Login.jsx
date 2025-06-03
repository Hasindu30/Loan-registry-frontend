import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import logo2 from '../assets/logo2.png'
import api from "../components/api";

const Login = () => {
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [error,setError] =useState(null)
const {login} = useAuth()
const navigate = useNavigate();
const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
      const response = await api.post("/auth/login",
        {email,password}
      );
      if(response.data.success){
        login(response.data.user)
        localStorage.setItem("token",response.data.token)
        if(response.data.user.role === "admin"){
          navigate('/admin-dashboard')
        }else{
         navigate('/employee-dashboard') 
        }
      }
    } catch (error) {
      if(error.response && error.response.data.success){
        setError(error.response.data.error)
      }else{
        setError('sever error')
      }
    }
}
  return (
  <div className="min-h-screen bg-gray-100">
  {/* TOP: Logo */}
  <div className="flex justify-center pt-6">
    <img src={logo2} alt="Hasindu Book Shop" className="h-100 -mt-30" />
  </div>

  {/* MIDDLE: Title and Card */}
  <div className="flex flex-col items-center -mt-30 px-4">
    <h1 className="text-3xl md:text-4xl font-bold text-red-500 mb-6 text-center">
      Loan Management System
    </h1>

    {/* Login Card */}
    <div className="flex flex-col md:flex-row bg-white rounded-md shadow-xl overflow-hidden max-w-4xl w-full">
      {/* Left Pane */}
      <div className="md:w-1/2 bg-gradient-to-br from-green-500 to-green-700 text-white flex flex-col justify-center items-center p-8">
        <p className="text-sm">Nice to see you again</p>
        <h2 className="text-2xl font-bold mt-2">Welcome back</h2>
      </div>

      {/* Right Pane - Form */}
      <div className="md:w-1/2 p-8">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Login</h3>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-green-600" />
              Keep me signed in
            </label>
            <a href="#" className="text-green-500 hover:underline">
              Already a member?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default Login;
