import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./Components/CartContext";
import Lenis from "lenis"; // 1. IMPORT LENIS

// Component Imports
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import Menu from "./Components/Menu";
import Candles from "./Components/Candles";
import Contact from "./Components/Contact";
import Cart from "./Components/Cart";
import AddToCartToast from "./Components/AddToCartToast";
import Checkout from "./Components/Checkout";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Orders from "./Components/Orders";
import MyAccount from "./Components/MyAccount";
import LoginPopup from "./Components/LoginPopup";
import WhatsAppButton from "./Components/WhatsAppButton";
// import SplashCursor from './Components/SplashCursor';
import Preloader from "./Components/Preloader";
import AdminDashboard from "./Components/AdminDashboard";
import AdminRoute from "./Components/AdminRoute";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import Footer from "./Components/Footer";

const MainLayout = () => {
  const { user } = useCart();
  const [isGuest, setIsGuest] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // --- 2. ADD SMOOTH SCROLL (LENIS) SETUP ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // Higher = Smoother/Slower (Try 2.0 for very heavy feel)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false, // Keep false for mobile to feel native
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  // ------------------------------------------

  useEffect(() => {
    const guestSession = sessionStorage.getItem("guestMode");
    if (guestSession) setIsGuest(true);

    const timer = setTimeout(() => {
      if (!user && !guestSession) setShowPopup(true);
      else setShowPopup(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, isGuest]);

  const handleGuestAccess = () => {
    setIsGuest(true);
    setShowPopup(false);
    sessionStorage.setItem("guestMode", "true");
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white font-sans">
      {/* 1. GLOBAL BACKGROUND VIDEO */}
      <div className="fixed inset-0 z-[-1]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/assets/videos/home-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 2. EXISTING CONTENT */}
      {showPopup && !user && !isGuest && (
        <LoginPopup onGuestAccess={handleGuestAccess} />
      )}
      <Preloader />
      {/* <SplashCursor /> */}
      <Navbar />
      <WhatsAppButton />
      <Cart />
      <AddToCartToast />

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/candles" element={<Candles />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/account" element={<MyAccount />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

const App = () => (
  <CartProvider>
    <Router>
      <div className="min-h-screen bg-transparent font-sans">
        <MainLayout />
      </div>
    </Router>
  </CartProvider>
);

export default App;
