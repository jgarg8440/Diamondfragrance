import React, { useEffect, useState } from "react";

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for window load or set a fixed timer
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds Intro

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  // ... inside Preloader component ...

return (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center animate-fadeOut" style={{ animationDelay: "2.2s", animationFillMode: "forwards" }}>
    
    {/* 1. NEW: Video Background (Rainy Window) */}
    <div className="absolute inset-0 z-0">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="w-full h-full object-cover opacity-50"
      >
        <source src="/assets/videos/popup-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60"></div> {/* Darken it */}
    </div>

    {/* ... Your Existing Logo & Loading Bar Content (Keep z-10 relative) ... */}
    <div className="relative z-10 mb-6">
      {/* Pulse Ring */}
      <div className="absolute inset-0 bg-[#DCCA87] rounded-full opacity-20 animate-ping blur-xl"></div>
      
      {/* Diamond Icon */}
      <div className="relative z-10 animate-bounce">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 9L12 22L22 9L12 2Z" fill="#DCCA87" stroke="black" strokeWidth="0.5"/>
          <path d="M2 9H22" stroke="black" strokeWidth="0.5" strokeOpacity="0.5"/>
          <path d="M12 22L7 9L12 2L17 9L12 22Z" stroke="black" strokeWidth="0.5" strokeOpacity="0.5"/>
        </svg>
      </div>
    </div>

    <div className="relative z-10 overflow-hidden">
      <h1 className="text-[#DCCA87] font-serif text-2xl tracking-[0.5em] uppercase animate-slideUp">
        Diamond Fragrance
      </h1>
    </div>

    <div className="relative z-10 w-48 h-[1px] bg-gray-800 mt-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#DCCA87] animate-loadingBar"></div>
    </div>
    
    {/* ... Styles ... */}
    <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes fadeOut {
          to { opacity: 0; visibility: hidden; pointer-events: none; }
        }
    `}</style>
  </div>
);
};
export default Preloader;