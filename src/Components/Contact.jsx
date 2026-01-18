import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for backend connection
import { API_URL } from '../config';


const EMAIL = "diamondfragrance8@gmail.com";
const PHONE_NUMBER = "+918000921548";
const ADDRESS = "Indra Colony, Bad Ke Pass, RPS Colony, Rawatbhata, Chittorgarh, Rajasthan 323307";

// Reuse the premium background images for consistency
const backgroundImages = [
  "/assets/DFimg/Hero.jpeg",
  "/assets/DFimg/Diamond_ROYALPROPHECY.webp",
  "/assets/DFimg/Diamond_JADORE.webp",
];

const Contact = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // --- NEW: Form State Management ---
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState(""); // 'sending', 'success', 'error'

  // Background Slideshow Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- NEW: Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // We combine Phone into the message since the backend expects 'message'
      const payload = {
        name: formData.name,
        email: formData.email,
        message: `Phone: ${formData.phone}\n\nMessage: ${formData.message}` 
      };

await axios.post(`${API_URL}/api/contact`, payload);
      
      setStatus("success");
      setFormData({ name: "", phone: "", email: "", message: "" }); // Reset Form
      
      // Remove success message after 5 seconds
      setTimeout(() => setStatus(""), 5000); 

    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0C0C0C] py-32 px-4">
      
      {/* 1. Dynamic Background Slideshow */}
      {backgroundImages.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
            index === currentImageIndex
              ? "opacity-100 scale-105"
              : "opacity-0 scale-100"
          }`}
          style={{ backgroundImage: `url('${img}')` }}
        />
      ))}

      {/* 2. Dark Luxury Overlay */}
      <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-sm" />

      {/* 3. Main Glass Container */}
      <div className="relative z-10 w-full max-w-6xl bg-black/60 backdrop-blur-xl border border-[#DCCA87]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeInUp">
        
        {/* --- LEFT SIDE: Contact Info --- */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#DCCA87]/20 to-black/40 p-8 sm:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#DCCA87]/20">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#DCCA87] mb-6 tracking-widest drop-shadow-md">
            GET IN TOUCH
          </h2>
          <p className="text-gray-300 mb-10 font-light leading-relaxed">
            Have a question about our luxury fragrances or need a custom candle
            order? We are here to help.
          </p>

          <div className="flex flex-col gap-6">
            {/* Email Card */}
            <a href={`mailto:${EMAIL}`} className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#DCCA87]/20 hover:border-[#DCCA87] transition-all duration-300">
              <span className="text-2xl group-hover:scale-110 transition-transform">📧</span>
              <div>
                <h3 className="text-[#DCCA87] text-xs font-bold uppercase tracking-wider">Email Us</h3>
                <p className="text-gray-300 text-sm font-mono">{EMAIL}</p>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a href={`https://wa.me/${PHONE_NUMBER.replace(/\s+/g,"")}?text=Hello%20Diamond%20Fragrance!`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-green-900/40 hover:border-green-500 transition-all duration-300">
              <span className="text-2xl group-hover:scale-110 transition-transform">📱</span>
              <div>
                <h3 className="text-[#DCCA87] text-xs font-bold uppercase tracking-wider">WhatsApp</h3>
                <p className="text-gray-300 text-sm font-mono">{PHONE_NUMBER}</p>
              </div>
            </a>

            {/* Address Card */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#DCCA87] transition-all duration-300">
              <span className="text-2xl group-hover:scale-110 transition-transform">📍</span>
              <div>
                <h3 className="text-[#DCCA87] text-xs font-bold uppercase tracking-wider">Visit Us</h3>
                <p className="text-gray-300 text-xs leading-relaxed max-w-[200px]">{ADDRESS}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Contact Form (Updated Logic) --- */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 bg-black/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
            <p className="text-gray-400 text-sm mb-6">We usually respond within 1 hour.</p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="group relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full bg-white/5 border border-gray-600 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/40 transition-all placeholder-gray-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Phone Input */}
              <div className="group relative">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full bg-white/5 border border-gray-600 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/40 transition-all placeholder-gray-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group relative">
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-white/5 border border-gray-600 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/40 transition-all placeholder-gray-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Message Input */}
            <div className="group relative">
              <textarea
                placeholder="Tell us about your fragrance needs..."
                rows={4}
                required
                className="w-full bg-white/5 border border-gray-600 text-white p-4 rounded-xl outline-none focus:border-[#DCCA87] focus:ring-1 focus:ring-[#DCCA87] focus:bg-black/40 transition-all placeholder-gray-500 resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 w-full bg-gradient-to-r from-[#DCCA87] via-[#E5D5A0] to-[#DCCA87] text-black font-black py-4 rounded-xl uppercase tracking-widest hover:to-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(220,202,135,0.4)] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{status === "sending" ? "Sending..." : "🚀 Send Message"}</span>
            </button>

            {/* Feedback Messages */}
            {status === "success" && (
              <p className="text-green-400 text-center text-sm font-bold animate-pulse">
                Message Sent Successfully! We will contact you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-center text-sm font-bold">
                Failed to send. Please check your connection.
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;