import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config'; 

const MIN_ORDER_FOR_COUPON = 300;

const AVAILABLE_COUPONS = [
  { code: "WELCOME10", desc: "10% Off on orders above ₹300", minOrder: 300, type: "percent", value: 10 },
  { code: "FREESHIP", desc: "Free Shipping on orders above ₹300", minOrder: 300, type: "shipping", value: 0 },
  { code: "DIAMOND50", desc: "Flat ₹50 off on orders above ₹1000", minOrder: 1000, type: "flat", value: 50 }
];

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // --- 1. SCROLL LOCK FIX ---
  useEffect(() => {
    if (isCartOpen) {
      // Lock background scroll
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Fix for mobile background scroll
    } else {
      // Re-enable background scroll
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    };
  }, [isCartOpen]);

  // --- CALCULATIONS ---
  const subtotal = getTotalPrice();
  let shippingCost = subtotal > 499 ? 0 : 50; 
  let discountAmount = 0;

  if (appliedCoupon) {
    if (subtotal < MIN_ORDER_FOR_COUPON) {
      setAppliedCoupon(null);
    } else {
      if (appliedCoupon.type === "percent") {
        discountAmount = Math.round(subtotal * (appliedCoupon.value / 100));
      } else if (appliedCoupon.type === "flat") {
        discountAmount = appliedCoupon.value;
      } else if (appliedCoupon.type === "shipping") {
        discountAmount = shippingCost; 
        shippingCost = 0; 
      }
      const maxAllowed = Math.round(subtotal * 0.40);
      if (discountAmount > maxAllowed) discountAmount = maxAllowed;
    }
  }

  const taxableAmount = Math.max(0, subtotal - (appliedCoupon?.type !== "shipping" ? discountAmount : 0));
  const tax = Math.round(taxableAmount * 0.05); 
  const grandTotal = subtotal + shippingCost + tax - discountAmount;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop - Click to close */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fadeIn cursor-pointer" 
        onClick={() => setIsCartOpen(false)} 
      />

      {/* Cart Panel - Scrollable content area */}
      <div className="relative w-full max-w-md bg-[#0C0C0C] h-full shadow-2xl flex flex-col border-l border-[#DCCA87]/20 animate-slideInRight overflow-hidden">
        
        {/* Header - Fixed at top */}
        <div className="p-6 border-b border-[#DCCA87]/10 flex justify-between items-center bg-black/40 z-10">
          <div>
            <h2 className="text-2xl font-serif text-[#DCCA87] tracking-widest uppercase">Your Selection</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{cartItems.length} Signature Scents</p>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-white transition-colors text-3xl font-light">×</button>
        </div>

        {/* --- 2. INDEPENDENT SCROLL AREA --- */}
        {/* 'overflow-y-auto' ensures this section scrolls, not the background */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar touch-pan-y">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-gray-400 font-serif italic">Your collection is empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="mt-4 text-[#DCCA87] underline uppercase text-xs tracking-widest"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.name}-${item.size}`} className="flex gap-5 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-20 h-20 bg-gray-900 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white uppercase truncate">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.name, item.size)} className="text-gray-600 hover:text-red-400">×</button>
                  </div>
                  <p className="text-[10px] text-[#DCCA87] font-bold">{item.size || '30ml'}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-lg">
                      <button onClick={() => updateQuantity(item.name, item.size, item.quantity - 1)} className="px-3 py-1 text-gray-400">-</button>
                      <span className="px-2 text-xs text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.name, item.size, item.quantity + 1)} className="px-3 py-1 text-gray-400">+</button>
                    </div>
                    <p className="text-sm font-bold text-white">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-black/80 border-t border-[#DCCA87]/20 backdrop-blur-xl z-10">
            {/* Coupon and Summary Logic */}
            <div className="mb-6">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Invitation Code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-[#DCCA87] outline-none"
                  />
                  <button 
                    onClick={() => {
                      const found = AVAILABLE_COUPONS.find(c => c.code === couponCode);
                      if(found && subtotal >= found.minOrder) setAppliedCoupon(found);
                      else alert("Invalid Code or Minimum Order Not Met");
                    }}
                    className="bg-[#DCCA87] text-black px-5 rounded-xl text-[10px] font-black uppercase"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-[#DCCA87]/10 border border-[#DCCA87]/30 p-3 rounded-xl">
                  <p className="text-[10px] font-black text-[#DCCA87] uppercase">{appliedCoupon.code} Activated</p>
                  <button onClick={() => setAppliedCoupon(null)} className="text-red-400 text-[10px] font-bold">Remove</button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-[11px] text-gray-400 uppercase">
                <span>Subtotal</span>
                <span className="text-white font-mono">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 uppercase">
                <span>Vault Delivery</span>
                <span className={shippingCost === 0 ? "text-green-500 font-bold" : "text-white font-mono"}>
                  {shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}
                </span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-sm font-serif text-gray-300 uppercase">Total Investment</span>
                <span className="text-3xl font-serif text-[#DCCA87] font-bold">₹{grandTotal}</span>
              </div>
            </div>

            <button 
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              className="w-full bg-gradient-to-r from-[#DCCA87] to-[#bfa760] py-5 rounded-2xl text-black font-black uppercase text-xs shadow-lg active:scale-95 transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;