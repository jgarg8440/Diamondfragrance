import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
const Footer = () => {
  const { user } = useCart(); // Get user
  const ADMIN_EMAIL = "diamondfragrance8@gmail.com";
  return (
    <footer className="bg-[#050505] text-white pt-20 overflow-hidden relative border-t border-[#DCCA87]/20 z-10">
      
      {/* 1. INFINITE SCROLL MARQUEE (Luxury Touch) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden py-4 border-b border-[#DCCA87]/10 bg-[#DCCA87]/5">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-4xl font-serif text-[#DCCA87]/20 uppercase tracking-[0.2em] font-bold mx-4">
              Diamond Fragrance • Luxury Scents • Timeless Elegance •
            </span>
          ))}
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
        
        {/* Brand Section */}
        <div className="md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <h2 className="text-2xl font-serif text-[#DCCA87] tracking-widest">DIAMOND</h2>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Crafting the world's finest essences for those who command the room. Experience the power of true luxury.
          </p>
        </div>

        {/* Quick Links (FUNCTIONAL) */}
        <div>
          <h4 className="text-[#DCCA87] font-bold uppercase tracking-widest mb-6 text-sm">Explore</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/menu" className="hover:text-white transition-colors">Perfumes</Link></li>
            <li><Link to="/menu" className="hover:text-white transition-colors">Attars</Link></li>
            <li><Link to="/candles" className="hover:text-white transition-colors">Candles</Link></li>
            {user && user.email === ADMIN_EMAIL && (
       <li><Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
    )}
          </ul>
        </div>

        {/* Support (CLEANED - Only Working Links) */}
        <div>
          <h4 className="text-[#DCCA87] font-bold uppercase tracking-widest mb-6 text-sm">Support</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            {/* Removed broken links: Track Order, Shipping Policy, FAQs */}
          </ul>
        </div>

        {/* Newsletter (Kept for Style) */}
        <div className="md:col-span-1">
          <h4 className="text-[#DCCA87] font-bold uppercase tracking-widest mb-6 text-sm">Join the Elite</h4>
          <p className="text-gray-500 text-xs mb-4">Subscribe for exclusive drops and offers.</p>
          <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your Email Address" 
              className="bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-[#DCCA87] outline-none transition-colors"
            />
            <button className="bg-[#DCCA87] text-black font-bold uppercase text-xs tracking-widest py-3 rounded hover:bg-white transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* 3. COPYRIGHT BAR */}
      <div className="border-t border-white/5 py-6 text-center">
        <p className="text-gray-600 text-xs uppercase tracking-wider">
          © {new Date().getFullYear()} Diamond Fragrance. All Rights Reserved.
        </p>
      </div>

      {/* CSS Animation for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;