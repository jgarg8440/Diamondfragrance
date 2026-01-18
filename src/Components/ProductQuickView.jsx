import React, { useState } from "react";
import { useCart } from "./CartContext";

const ProductQuickView = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("3ml");
  const [isClosing, setIsClosing] = useState(false);

  // Pricing Logic (matches your Menu.jsx)
  const pricing = {
    "3ml": { current: 199, original: 399 },
    "6ml": { current: 299, original: 599 },
    "12ml": { current: 599, original: 1199 }
  };

  const currentPrice = product.price || pricing[selectedSize].current;
  const originalPrice = product.originalPrice || pricing[selectedSize].original;

  // Mock Fragrance Notes (Randomized for demo if not in data)
  const notes = {
    top: ["Bergamot", "Lemon", "Saffron"],
    heart: ["Rose", "Jasmine", "Oud"],
    base: ["Musk", "Amber", "Vanilla"]
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for animation
  };

  const handleAddToCart = () => {
    addToCart({ ...product, size: product.price ? "unit" : selectedSize, price: currentPrice });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className={`relative bg-[#0C0C0C] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#DCCA87]/30 transition-all duration-300 transform ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-fadeInUp'}`}>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-[#DCCA87] text-white hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-all"
        >
          ✕
        </button>

        {/* Left: Image Section */}
        <div className="w-full md:w-1/2 bg-white/5 relative group">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          {/* Badge */}
          {product.isBestseller && (
             <span className="absolute top-4 left-4 bg-[#DCCA87] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
               Bestseller
             </span>
          )}
        </div>

        {/* Right: Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col text-white relative bg-gradient-to-br from-[#0C0C0C] to-[#1a1a1a]">
          
          <h2 className="text-3xl md:text-4xl font-serif text-[#DCCA87] mb-2">{product.name}</h2>
          <p className="text-gray-400 text-sm mb-6">{product.desc}</p>

          {/* Pricing */}
          <div className="flex items-end gap-3 mb-8 border-b border-white/10 pb-6">
            <span className="text-3xl font-bold text-white">₹{currentPrice}</span>
            <span className="text-lg text-gray-500 line-through mb-1">₹{originalPrice}</span>
            <span className="text-xs text-green-400 mb-2 font-bold uppercase ml-auto">
               In Stock & Ready to Ship
            </span>
          </div>

          {/* Fragrance Visualizer (Only for Perfumes/Attars) */}
          {!product.price && (
            <div className="mb-8">
              <h3 className="text-[#DCCA87] text-xs uppercase tracking-widest font-bold mb-4">Olfactory Notes</h3>
              <div className="flex justify-between gap-2 text-center">
                <div className="bg-white/5 p-3 rounded-xl flex-1 border border-white/10">
                  <span className="block text-2xl mb-1">🍋</span>
                  <span className="text-[10px] text-gray-400 uppercase">Top</span>
                  <span className="block text-xs font-bold text-gray-200">{notes.top[0]}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl flex-1 border border-white/10">
                  <span className="block text-2xl mb-1">🌹</span>
                  <span className="text-[10px] text-gray-400 uppercase">Heart</span>
                  <span className="block text-xs font-bold text-gray-200">{notes.heart[0]}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl flex-1 border border-white/10">
                  <span className="block text-2xl mb-1">🪵</span>
                  <span className="text-[10px] text-gray-400 uppercase">Base</span>
                  <span className="block text-xs font-bold text-gray-200">{notes.base[0]}</span>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-auto">
            {/* Size Selector (if applicable) */}
            {!product.price && (
              <div className="flex gap-2 mb-6">
                {Object.keys(pricing).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-3 border rounded-xl text-sm font-bold transition-all ${
                      selectedSize === size 
                        ? "bg-[#DCCA87] border-[#DCCA87] text-black" 
                        : "border-gray-600 text-gray-400 hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[#DCCA87] to-[#bfa760] text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                Add to Cart - ₹{currentPrice}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;