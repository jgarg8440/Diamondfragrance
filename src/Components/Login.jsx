import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from '../config';


// Validated Image Paths
const backgroundImages = [
  "/assets/DFimg/Hero.jpeg",
  "/assets/DFimg/Diamond_ROYALPROPHECY.webp",
  "/assets/DFimg/Diamond_AMIRALOUD.webp",
  "/assets/DFimg/Diamond_JADORE.webp"
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { setUser } = useCart();
  const navigate = useNavigate();

  // Cycle images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
 
const res = await axios.post(
  `${API_URL}/api/login`,
  { email, password },
  { withCredentials: true }
);
      setUser({ email, name: res.data.name });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0C0C0C]">
      
      {/* 1. Background Slideshow (Brighter Visibility) */}
      {backgroundImages.map((img, index) => (
        <div 
          key={img}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
            index === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ backgroundImage: `url('${img}')` }} 
        />
      ))}
      
      {/* 2. Lighter Overlay (Reduced Opacity for Visibility) */}
      <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-[2px]" />

      {/* 3. High Contrast Glass Card */}
      <div className="relative z-10 w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-[#DCCA87]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row m-4 animate-fadeInUp">
        
        {/* Left Side: Brand Visuals */}
        <div className="hidden md:flex md:w-1/2 bg-black/40 flex-col justify-center items-center p-12 text-center border-r border-[#DCCA87]/20">
          <div className="mb-6 p-4 rounded-full border-2 border-[#DCCA87]/50 shadow-[0_0_15px_#DCCA87]">
             <span className="text-4xl filter drop-shadow-lg">💎</span>
          </div>
          <h2 className="text-4xl font-serif text-[#DCCA87] mb-6 tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">WELCOME BACK</h2>
          <p className="text-white font-medium mb-8 leading-relaxed text-shadow-sm">
            "Perfume is the art that makes memory speak."
          </p>
          <div className="w-24 h-1 bg-[#DCCA87] rounded-full mb-8 shadow-[0_0_10px_#DCCA87]"></div>
          <p className="text-xs text-gray-300 uppercase tracking-[0.3em] font-bold">Diamond Fragrance</p>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative bg-black/20">
          
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-serif text-[#DCCA87] mb-2 drop-shadow-md">Welcome Back</h2>
            <p className="text-gray-300 text-xs uppercase tracking-widest font-bold">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {/* Email Input - High Contrast */}
            <div className="group relative">
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2 group-focus-within:text-[#DCCA87] transition-colors">
                Email Address
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full bg-white/10 border border-gray-500 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/60 transition-all placeholder-gray-400 shadow-inner"
                placeholder="name@example.com"
              />
            </div>

            {/* Password Input - High Contrast */}
            <div className="group relative">
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2 group-focus-within:text-[#DCCA87] transition-colors">
                Password
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full bg-white/10 border border-gray-500 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/60 transition-all placeholder-gray-400 shadow-inner"
                placeholder="••••••••"
              />
            </div>

            {/* Login Button - Brighter Gradient */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-6 bg-gradient-to-r from-[#DCCA87] via-[#E5D5A0] to-[#DCCA87] text-black py-4 rounded-xl font-black uppercase tracking-widest hover:to-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(220,202,135,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/50 border-t-black rounded-full animate-spin"></span>
                  Logging In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Links */}
            <div className="text-center mt-6">
              <p className="text-gray-300 text-sm font-medium">
                New to Diamond Fragrance?{" "}
                <Link to="/register" className="text-[#DCCA87] font-bold hover:underline hover:text-white transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;