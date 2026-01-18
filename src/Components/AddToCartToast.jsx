import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";

const AddToCartToast = () => {
  const { cartItems } = useCart();
  const [show, setShow] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    // Detect if cart size increased
    const currentCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    
    if (currentCount > prevCount && cartItems.length > 0) {
      setLastItem(cartItems[cartItems.length - 1]); // Get latest item roughly
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
    setPrevCount(currentCount);
  }, [cartItems]);

  if (!show || !lastItem) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] animate-slideUp">
      <div className="bg-black/90 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-2xl border border-[#DCCA87]/30 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
          <img src={lastItem.image} alt="Product" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">Added to Cart</p>
          <p className="font-bold text-[#DCCA87] text-sm">{lastItem.name}</p>
        </div>
        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
        <button onClick={() => document.querySelector('.cart-btn')?.click()} className="text-xs font-bold hover:underline">
          VIEW
        </button>
      </div>
    </div>
  );
};

export default AddToCartToast;