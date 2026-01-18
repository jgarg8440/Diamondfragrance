import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems, setIsCartOpen, user, setUser } = useCart();
  const navigate = useNavigate();

  // Handle scroll effect for sticky glass navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("diamondFragranceUser");
    navigate("/");
  };

  // Luxury Link with Animated Underline
  const NavItem = ({ to, children, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative group py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
          isActive ? "text-[#DCCA87]" : "text-gray-300 hover:text-[#DCCA87]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {/* Animated Gold Underline */}
          <span
            className={`absolute bottom-0 left-0 h-[2px] bg-[#DCCA87] transition-all duration-300 ease-out ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </>
      )}
    </NavLink>
  );

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-[#DCCA87]/20 shadow-lg py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* --- BRAND LOGO WITH HIGH-QUALITY DIAMOND ICON --- */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Animated Diamond Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-[#DCCA87] drop-shadow-[0_0_8px_rgba(220,202,135,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
              >
                <path 
                  d="M12 2L2 9L12 22L22 9L12 2Z" 
                  fill="currentColor" 
                  fillOpacity="0.2" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 9H22M12 22L7 9L12 2L17 9L12 22Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-[#DCCA87] opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500"></div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[#DCCA87] font-serif text-xl sm:text-2xl tracking-[0.15em] leading-none group-hover:text-white transition-colors duration-300">
                DIAMOND
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-[0.3em] leading-none mt-1 group-hover:text-[#DCCA87] transition-colors duration-300">
                Fragrance
              </span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <ul className="hidden lg:flex gap-10 items-center">
            <li><NavItem to="/" end>HOME</NavItem></li>
            <li><NavItem to="/menu">PRODUCTS</NavItem></li>
            <li><NavItem to="/candles">CANDLES</NavItem></li>
            <li><NavItem to="/contact">CONTACT</NavItem></li>

            {/* Divider */}
            <div className="h-4 w-[1px] bg-gray-700"></div>

            {!user ? (
              <>
                <li><NavItem to="/login">LOGIN</NavItem></li>
                <li>
                  <Link 
                    to="/register" 
                    className="px-5 py-2 rounded-full border border-[#DCCA87] text-[#DCCA87] text-xs font-bold uppercase tracking-wider hover:bg-[#DCCA87] hover:text-black transition-all duration-300 hover:shadow-[0_0_15px_#DCCA87]"
                  >
                    Join Us
                  </Link>
                </li>
              </>
            ) : (
              /* --- MY ACCOUNT INTERACTIVE SECTION --- */
              <div className="flex items-center gap-6">
                <Link 
                  to="/account" 
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#DCCA87] to-[#8c7e4e] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(220,202,135,0.4)] group-hover:scale-110 transition-transform">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col cursor-pointer">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest leading-none">Welcome</span>
                    <span className="text-[#DCCA87] text-xs font-bold uppercase tracking-wider leading-none mt-1 group-hover:text-white transition-colors">
                      My Account
                    </span>
                  </div>
                </Link>
                {/* Logout Text Button */}
                <button 
                  onClick={handleLogout} 
                  className="text-[10px] text-red-400 hover:text-red-300 border border-red-900/30 px-3 py-1 rounded hover:bg-red-900/10 transition-colors uppercase tracking-widest font-bold"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Cart Icon */}
            <li>
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-2 text-[#DCCA87] hover:text-white transition-colors duration-300 group"
              >
                <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-bounce border border-black">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </li>
          </ul>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="lg:hidden flex items-center gap-5">
             <button onClick={() => setIsCartOpen(true)} className="relative text-[#DCCA87]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black text-white">{getTotalItems()}</span>}
             </button>
             <button 
               onClick={() => setIsOpen(!isOpen)} 
               className="text-[#DCCA87] focus:outline-none transition-transform active:scale-90"
             >
               {isOpen ? (
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
               ) : (
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
               )}
             </button>
          </div>
        </div>

        {/* --- MOBILE MENU DROPDOWN --- */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 py-0"
          } bg-black/95 backdrop-blur-xl absolute top-full left-0 w-full border-b border-[#DCCA87]/20 shadow-2xl`}
        >
          <div className="flex flex-col items-center gap-6 text-sm font-medium tracking-widest">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-[#DCCA87] hover:text-white transition-colors">HOME</Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-[#DCCA87] transition-colors">PRODUCTS</Link>
            <Link to="/candles" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-[#DCCA87] transition-colors">CANDLES</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-[#DCCA87] transition-colors">CONTACT</Link>
            
            <div className="w-16 h-[1px] bg-gray-800 my-2"></div>
            
            {!user ? (
              <div className="flex flex-col gap-4 w-full px-12">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 border border-gray-700 rounded-xl text-gray-300 hover:border-[#DCCA87] hover:text-[#DCCA87] transition-all">
                  LOGIN
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-3 bg-[#DCCA87] text-black font-bold rounded-xl hover:bg-white transition-all shadow-lg">
                  JOIN US
                </Link>
              </div>
            ) : (
              <>
                <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-[#DCCA87] font-bold border border-[#DCCA87]/30 px-6 py-2 rounded-full">
                  <span>MY ACCOUNT</span>
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-400 hover:text-red-300 text-xs">LOGOUT</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;