import React, { useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { API_URL } from '../config';


const LoginPopup = ({ onClose, onGuestAccess }) => {
  // Modes: 'login', 'register', 'forgot'
  const [mode, setMode] = useState("login"); 
  const { setUser } = useCart();
  
  // Form States
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "login") {
        // LOGIN LOGIC
const { data } = await axios.post(`${API_URL}/api/login`, {
  email: formData.email,
  password: formData.password
});
        setUser(data.user);
        onClose(); // Close popup on success
      } 
      else if (mode === "register") {
        // REGISTER LOGIC
await axios.post(`${API_URL}/register`, formData);
        setMessage("Account created! Please log in.");
        setMode("login");
      } 
      else if (mode === "forgot") {
        // FORGOT PASSWORD LOGIC
const { data } = await axios.post(`${API_URL}/api/forgot-password`, {
  email: formData.email
});
        setMessage(data.message); // "Reset link sent..."
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content - NOW WITH VIDEO BACKGROUND */}
      <div className="relative bg-black border border-[#DCCA87]/30 p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fadeInUp overflow-hidden">
        
        {/* 1. NEW: Video Background Inside Card */}
        <div className="absolute inset-0 z-0">
           <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-30" // Subtle rain effect behind text
          >
            <source src="/assets/videos/popup-bg.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        </div>

        {/* 2. Content Wrapper (Z-index 10 to sit above video) */}
        <div className="relative z-10">
            
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-0 right-0 text-gray-500 hover:text-white transition-colors">✕</button>

            {/* --- HEADER --- */}
            <h2 className="text-3xl font-serif text-[#DCCA87] mb-2 text-center drop-shadow-lg">
              {mode === "login" && "Welcome Back"}
              {mode === "register" && "Join the Luxury"}
              {mode === "forgot" && "Reset Password"}
            </h2>
            
            <p className="text-gray-400 text-xs text-center mb-6 uppercase tracking-widest">
              {mode === "login" && "Login to access your account"}
              {mode === "register" && "Create an account to track orders"}
              {mode === "forgot" && "Enter your email to receive a link"}
            </p>

            {/* --- FORM --- */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Field (Register Only) */}
              {mode === "register" && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#DCCA87] outline-none transition-colors backdrop-blur-sm placeholder-gray-500"
                  onChange={handleChange}
                  required
                />
              )}

              {/* Email Field (All Modes) */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#DCCA87] outline-none transition-colors backdrop-blur-sm placeholder-gray-500"
                onChange={handleChange}
                required
              />

              {/* Password Field (Login & Register Only) */}
              {mode !== "forgot" && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#DCCA87] outline-none transition-colors backdrop-blur-sm placeholder-gray-500"
                  onChange={handleChange}
                  required
                />
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#DCCA87] text-black font-bold py-3 rounded-lg hover:bg-white transition-all transform hover:scale-[1.02] shadow-lg shadow-[#DCCA87]/20 uppercase tracking-widest text-sm"
              >
                {loading ? "Processing..." : (
                  mode === "login" ? "Log In" : 
                  mode === "register" ? "Sign Up" : "Send Reset Link"
                )}
              </button>
            </form>

            {/* Error/Success Message */}
            {message && (
              <p className={`mt-4 text-center text-sm font-bold ${message.includes("sent") || message.includes("created") ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}

            {/* --- FOOTER LINKS --- */}
            <div className="mt-6 flex flex-col gap-2 text-center text-sm text-gray-400">
              
              {mode === "login" && (
                <>
                  <button onClick={() => setMode("forgot")} className="hover:text-[#DCCA87] underline transition-colors">
                    Forgot Password?
                  </button>
                  <p>
                    New here? <button onClick={() => setMode("register")} className="text-[#DCCA87] font-bold ml-1 hover:text-white transition-colors">Create Account</button>
                  </p>
                </>
              )}

              {mode === "register" && (
                <p>
                  Already have an account? <button onClick={() => setMode("login")} className="text-[#DCCA87] font-bold ml-1 hover:text-white transition-colors">Log In</button>
                </p>
              )}

              {mode === "forgot" && (
                <button onClick={() => setMode("login")} className="text-[#DCCA87] font-bold hover:text-white transition-colors">
                  ← Back to Login
                </button>
              )}

              {/* Guest Access Button (If prop provided) */}
              {onGuestAccess && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button onClick={onGuestAccess} className="text-[#DCCA87] text-xs uppercase tracking-widest hover:text-white transition-colors">
                    Continue as Guest
                  </button>
                </div>
              )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;