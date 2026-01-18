import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/reset-password/${token}`, { newPassword });
      alert("Password Reset Successful! Please Login.");
      navigate("/login"); // Or open login popup
    } catch (error) {
      alert("Failed: Link may be expired.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-[#DCCA87]/30 p-8 rounded-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-serif text-[#DCCA87] mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="New Password" 
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#DCCA87] outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="w-full bg-[#DCCA87] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;