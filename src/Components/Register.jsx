import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { Link, useNavigate } from "react-router-dom";

// Using the same high-quality assets for consistency
const backgroundImages = [
  "/assets/DFimg/Diamond_ROYALPROPHECY.webp",
  "/assets/DFimg/Diamond_JADORE.webp",
  "/assets/DFimg/Hero.jpeg",
  "/assets/DFimg/Diamond_AMIRALOUD.webp"
];

const Register = () => {
  const { setUser } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background Slideshow Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/register", form);
      // alert(res.data.message); // Optional: removed for smoother flow
      setUser(form);
      localStorage.setItem("diamondFragranceUser", JSON.stringify(form));
      navigate("/"); // Redirect to home after success
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0C0C0C]">
      
      {/* 1. Background Slideshow */}
      {backgroundImages.map((img, index) => (
        <div 
          key={img}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
            index === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ backgroundImage: `url('${img}')` }} 
        />
      ))}
      
      {/* 2. Warmer Overlay for "Welcome" Vibe */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/70 via-black/50 to-[#DCCA87]/10 backdrop-blur-[2px]" />

      {/* 3. Glass Card Container (Row Reversed) */}
      <div className="relative z-10 w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-[#DCCA87]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse m-4 animate-fadeInUp">
        
        {/* Right Side: Membership Benefits (Visuals) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#DCCA87]/10 to-transparent flex-col justify-center items-start p-12 text-left border-l border-[#DCCA87]/20">
          <h2 className="text-3xl font-serif text-[#DCCA87] mb-6 tracking-widest drop-shadow-md">JOIN THE CIRCLE</h2>
          <p className="text-gray-300 mb-8 font-light">
            Become a member to unlock the world of exclusive luxury fragrances.
          </p>
          
          {/* Benefits List */}
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-gray-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#DCCA87] text-black text-xs font-bold">✓</span>
              Early access to new drops
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#DCCA87] text-black text-xs font-bold">✓</span>
              Exclusive member-only discounts
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#DCCA87] text-black text-xs font-bold">✓</span>
              Seamless order tracking
            </li>
          </ul>

          <p className="text-xs text-[#DCCA87] uppercase tracking-[0.2em] mt-auto font-bold">Diamond Fragrance</p>
        </div>

        {/* Left Side: Registration Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-black/20">
          
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-serif text-[#DCCA87] mb-2">Join Us</h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Create your account</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            
            {/* Name Input */}
            <div className="group relative">
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2 group-focus-within:text-[#DCCA87] transition-colors">
                Full Name
              </label>
              <input 
                type="text" 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required 
                className="w-full bg-white/10 border border-gray-500 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/60 transition-all placeholder-gray-400 shadow-inner"
                placeholder="John Doe"
              />
            </div>

            {/* Email Input */}
            <div className="group relative">
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2 group-focus-within:text-[#DCCA87] transition-colors">
                Email Address
              </label>
              <input 
                type="email" 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required 
                className="w-full bg-white/10 border border-gray-500 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/60 transition-all placeholder-gray-400 shadow-inner"
                placeholder="name@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="group relative">
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2 group-focus-within:text-[#DCCA87] transition-colors">
                Password
              </label>
              <input 
                type="password" 
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required 
                className="w-full bg-white/10 border border-gray-500 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/60 transition-all placeholder-gray-400 shadow-inner"
                placeholder="••••••••"
              />
            </div>

            {/* Register Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-gradient-to-r from-[#DCCA87] via-[#E5D5A0] to-[#DCCA87] text-black py-4 rounded-xl font-black uppercase tracking-widest hover:to-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(220,202,135,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/50 border-t-black rounded-full animate-spin"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-gray-300 text-sm font-medium">
                Already a member?{" "}
                <Link to="/login" className="text-[#DCCA87] font-bold hover:underline hover:text-white transition-colors">
                  Login Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;