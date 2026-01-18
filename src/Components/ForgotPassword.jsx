import React, { useState } from "react";
import axios from "axios";
import { API_URL } from '../config';


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
const { data } = await axios.post(`${API_URL}/api/forgot-password`, { email });
      setMessage(data.message);
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-[#DCCA87]/30 p-8 rounded-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-serif text-[#DCCA87] mb-4">Forgot Password?</h2>
        <p className="text-gray-400 mb-6 text-sm">Enter your registered email to receive a reset link.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#DCCA87] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-[#DCCA87] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors">
            Send Reset Link
          </button>
        </form>
        
        {message && <p className="mt-4 text-[#DCCA87] text-sm animate-pulse">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;