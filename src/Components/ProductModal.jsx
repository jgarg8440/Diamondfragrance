import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  // 1. Logic to determine if product is a perfume or attar
  const isPerfume = product?.category?.includes("perfume");
  
  // 2. Set the default size based on category
  const [selectedSize, setSelectedSize] = useState(isPerfume ? "30ml" : "3ml");

  // 3. Define which sizes should be visible
  const availableSizes = isPerfume 
    ? ["30ml", "50ml", "100ml"] 
    : ["3ml", "6ml", "12ml"];

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = "hidden"; 
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!product) return null;

  const pricing = {
    "3ml": { current: 199, original: 399 },
    "6ml": { current: 299, original: 599 },
    "12ml": { current: 599, original: 1199 },
    "30ml": { current: 399, original: 599 },
    "50ml": { current: 799, original: 1199 },
    "100ml": { current: 1199, original: 1899 }
  };

  const price = product.price || pricing[selectedSize].current;
  const original = product.originalPrice || pricing[selectedSize].original;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      <div className={`relative bg-white w-full max-w-4xl h-[80vh] md:h-auto md:max-h-[600px] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 transform ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/10 hover:bg-black text-black hover:text-[#DCCA87] rounded-full flex items-center justify-center transition-all"
        >
          ✕
        </button>

        <div className="w-full md:w-1/2 h-1/2 md:h-auto bg-gray-100 relative group overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          {product.isBestseller && (
            <span className="absolute top-4 left-4 bg-[#DCCA87] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Bestseller
            </span>
          )}
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col h-full overflow-y-auto">
          <h2 className="text-3xl font-serif text-black mb-2 uppercase tracking-wide">{product.name}</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">{product.desc || "Experience the essence of luxury with this long-lasting, premium fragrance."}</p>

          {/* 4. UPDATED: Only mapping through availableSizes */}
          {!product.price && (
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Size</p>
              <div className="flex gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${
                      selectedSize === size
                        ? "bg-black text-[#DCCA87] border-black scale-105"
                        : "border-gray-300 text-gray-500 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-black">₹{price}</span>
              <span className="text-lg text-gray-400 line-through">₹{original}</span>
              <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded">
                Save ₹{original - price}
              </span>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  addToCart({ ...product, size: product.price ? "unit" : selectedSize, price });
                  handleClose();
                }}
                className="flex-1 bg-[#DCCA87] text-black font-bold py-4 rounded-xl hover:bg-[#c2b070] active:scale-95 transition-all shadow-lg shadow-[#DCCA87]/30 uppercase tracking-widest"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleClose}
                className="px-6 py-4 rounded-xl border-2 border-gray-200 font-bold hover:border-black hover:text-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;