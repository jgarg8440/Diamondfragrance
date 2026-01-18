import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Premium Background Images
const backgroundImages = [
  "/assets/DFimg/Hero.jpeg",
  "/assets/DFimg/Diamond_ROYALPROPHECY.webp",
  "/assets/DFimg/Diamond_AMIRALOUD.webp"
];

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart, user } = useCart();
  const navigate = useNavigate();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // 1. Background Slideshow Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Auth & Cart Validation
  useEffect(() => {
    // If cart is empty, redirect
    if (cartItems.length === 0 && !showSuccess) {
      navigate("/");
    }

    // Access Control: Must be Logged In OR have Guest Mode enabled
    const isGuest = sessionStorage.getItem("guestMode");
    if (!user && !isGuest) {
      navigate("/"); // Redirect to home to trigger the LoginPopup
    }

    // Auto-fill data if user is logged in
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [cartItems, showSuccess, user, navigate]);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert("Please fill all delivery details");
      return;
    }

    setIsLoading(true);

    try {
      const totalAmount = getTotalPrice();
      // Initialize Order
      const { data } = await axios.post(
        "http://localhost:5000/api/create-order",
        {
          amount: totalAmount,
          currency: "INR",
          items: cartItems,
          customerInfo: customerInfo
        },
        { withCredentials: true }
      );

      // Razorpay Options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Diamond Fragrance",
        description: "Luxury Fragrance Order",
        image: "public/assets/DFimg/logo.jpeg", // Ensure you have a logo image or remove this line
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              setOrderDetails(verifyRes.data.order);
              setShowSuccess(true);
              clearCart();
            }
          } catch (error) {
            alert("Payment verification failed!");
            console.error(error);
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        theme: {
          color: "#DCCA87"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- SUCCESS VIEW ---
  if (showSuccess && orderDetails) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti Background Effect (Optional CSS) */}
        <div className="absolute inset-0 bg-[url('/assets/DFimg/Hero.jpeg')] bg-cover bg-center opacity-20 blur-sm" />
        
        <div className="relative z-10 bg-black/80 backdrop-blur-xl p-8 rounded-3xl max-w-2xl w-full border border-[#DCCA87]/40 animate-fadeInUp shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-[#DCCA87] to-[#8c7e4e] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(220,202,135,0.4)] animate-bounce">
              <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-serif text-[#DCCA87] mb-2 tracking-widest">ORDER CONFIRMED</h2>
            <p className="text-gray-300">Thank you for choosing Diamond Fragrance.</p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl mb-6 space-y-3 border border-white/10">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400 uppercase text-xs tracking-wider">Order ID</span>
              <span className="text-[#DCCA87] font-mono font-bold">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400 uppercase text-xs tracking-wider">Amount Paid</span>
              <span className="text-white font-bold text-xl">₹{orderDetails.amount}</span>
            </div>
            <div className="pt-2">
              <p className="text-green-400 text-sm flex items-center gap-2">
                <span>✉️</span> Confirmation sent to {orderDetails.customerInfo.email}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 bg-[#DCCA87] text-black px-6 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-transparent border border-white/30 text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Shop More
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- CHECKOUT FORM VIEW ---
  return (
    <div className="min-h-screen relative bg-[#0C0C0C] py-24 px-4 overflow-hidden">
      
      {/* Background Slideshow */}
      {backgroundImages.map((img, index) => (
        <div 
          key={img}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
            index === currentImageIndex ? "opacity-30 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ backgroundImage: `url('${img}')` }} 
        />
      ))}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0C0C0C] via-black/80 to-[#0C0C0C] backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#DCCA87] mb-12 text-center tracking-widest drop-shadow-lg">
          SECURE CHECKOUT
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* LEFT: Customer Details Form */}
          <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-[#DCCA87]/30 shadow-2xl animate-slideInLeft">
            <h3 className="text-2xl font-serif text-white mb-8 flex items-center gap-3">
              <span className="bg-[#DCCA87] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Shipping Details
            </h3>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-bold text-[#DCCA87] uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#DCCA87] focus:bg-black/40 transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-[10px] font-bold text-[#DCCA87] uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#DCCA87] focus:bg-black/40 transition-all"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold text-[#DCCA87] uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#DCCA87] focus:bg-black/40 transition-all"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold text-[#DCCA87] uppercase tracking-wider mb-2">Delivery Address</label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#DCCA87] focus:bg-black/40 transition-all resize-none"
                  placeholder="Street address, City, State, Pincode"
                  required
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="flex flex-col gap-6 animate-slideInRight">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-[#DCCA87]/20 shadow-xl">
              <h3 className="text-2xl font-serif text-[#DCCA87] mb-6 flex items-center gap-3">
                <span className="bg-[#DCCA87] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-800">
                         {/* Fallback image if needed */}
                         {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                    <p className="text-[#DCCA87] font-mono font-bold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#DCCA87]/30 pt-6 space-y-2">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-bold text-white">Total To Pay</span>
                  <span className="text-3xl font-serif font-bold text-[#DCCA87]">
                    ₹{getTotalPrice()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#DCCA87] via-[#E5D5A0] to-[#DCCA87] text-black py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_25px_rgba(220,202,135,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </button>
            
            <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center">🔒</span>
              Secured by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;