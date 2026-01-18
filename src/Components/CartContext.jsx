import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // --- STATE ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Auth State
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Loading state for auth

  // --- 1. SESSION CHECK (Fixes the Refresh Issue) ---
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Ask backend: "Is there a valid cookie?"
        const { data } = await axios.get("http://localhost:5000/api/me");
        setUser(data.user); // If yes, set user
      } catch (error) {
        setUser(null); // If no, stay logged out
      } finally {
        setIsAuthChecking(false); // Finished checking
      }
    };

    checkUserLoggedIn();
  }, []);

  // --- 2. CART PERSISTENCE (Keep Cart on Refresh) ---
  useEffect(() => {
    const savedCart = localStorage.getItem("diamondFragranceCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diamondFragranceCart", JSON.stringify(cartItems));
  }, [cartItems]);

// Replace your existing Cart functions with these:
const addToCart = (product) => {
  setCartItems((prev) => {
    // Check for both name and size to differentiate products
    const existing = prev.find((i) => i.name === product.name && i.size === product.size);
    if (existing) {
      return prev.map((i) =>
        (i.name === product.name && i.size === product.size) 
          ? { ...i, quantity: i.quantity + 1 } : i
      );
    }
    return [...prev, { ...product, quantity: 1 }];
  });
  setShowToast(true);
  setTimeout(() => setShowToast(false), 2000);
};

const removeFromCart = (name, size) => 
  setCartItems((prev) => prev.filter((i) => !(i.name === name && i.size === size)));

const updateQuantity = (name, size, quantity) => {
  if (quantity <= 0) return removeFromCart(name, size);
  setCartItems((prev) => prev.map((i) => 
    (i.name === name && i.size === size) ? { ...i, quantity } : i
  ));
};

  const clearCart = () => setCartItems([]);

  const getTotalItems = () => cartItems.reduce((sum, i) => sum + i.quantity, 0);
  
  const getTotalPrice = () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isCartOpen,
        setIsCartOpen,
        showToast,
        user,
        setUser,
        isAuthChecking // Exposed in case you want to show a loading spinner elsewhere
      }}
    >
      {/* Important: Don't render the app until we know if the user is logged in */}
      {!isAuthChecking && children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);