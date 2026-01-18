import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../config';


const MyAccount = () => {
  const { user, setUser } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile"); // profile, orders, payments
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // If not logged in, redirect
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch Real Orders from Backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        // Assuming you have this endpoint. If not, see backend note below.
const { data } = await axios.get(`${API_URL}/api/my-orders`, { 
  withCredentials: true 
});
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        // Fallback to empty if API fails
        setOrders([]); 
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'orders' || activeTab === 'payments') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("diamondFragranceUser");
    navigate("/");
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0C0C0C] relative overflow-hidden pt-24 pb-12 px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/assets/DFimg/Hero.jpeg')] bg-cover bg-center opacity-20 fixed" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-black/80 to-[#0C0C0C]/90 fixed" />

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#DCCA87]/20 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif text-[#DCCA87] tracking-widest mb-2">MY ACCOUNT</h1>
            <p className="text-gray-400 text-sm uppercase tracking-[0.2em]">Welcome back, {user.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-900/20 border border-red-900/50 text-red-400 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-900/40 transition-all"
          >
            Log Out
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-1/4">
            <div className="bg-white/5 backdrop-blur-xl border border-[#DCCA87]/20 rounded-2xl p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
              {['profile', 'orders', 'payments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none text-left px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? "bg-[#DCCA87] text-black shadow-[0_0_15px_rgba(220,202,135,0.4)]" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4 bg-white/5 backdrop-blur-xl border border-[#DCCA87]/10 rounded-2xl p-6 md:p-10 min-h-[500px]">
            
            {/* --- PROFILE TAB --- */}
            {activeTab === 'profile' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-serif text-white mb-6">Profile Details</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#DCCA87] uppercase tracking-wider mb-2">Login ID / Email</label>
                    <div className="bg-black/40 border border-gray-700 text-gray-300 p-4 rounded-xl flex justify-between items-center">
                      <span>{user.email}</span>
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">Verified</span>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#DCCA87] uppercase tracking-wider mb-2">Full Name</label>
                    <div className="bg-black/40 border border-gray-700 text-white p-4 rounded-xl">
                      {user.name}
                    </div>
                  </div>
                  <div className="group md:col-span-2">
                    <label className="block text-[10px] font-bold text-[#DCCA87] uppercase tracking-wider mb-2">Password</label>
                    <div className="bg-black/40 border border-gray-700 text-gray-500 p-4 rounded-xl flex justify-between items-center">
                      <span>••••••••••••••••</span>
                      <button className="text-xs text-[#DCCA87] hover:underline opacity-50 cursor-not-allowed">Change Password</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ORDERS TAB --- */}
            {activeTab === 'orders' && (
              <div className="animate-fadeIn space-y-4">
                <h2 className="text-2xl font-serif text-white mb-6">Order History</h2>
                
                {isLoading ? (
                  <div className="text-center py-10 text-[#DCCA87]">Loading orders...</div>
                ) : orders.length === 0 ? (
                   <div className="text-center py-10 text-gray-400">
                     <p>No orders found.</p>
                     <button onClick={() => navigate('/menu')} className="mt-4 text-[#DCCA87] underline">Start Shopping</button>
                   </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id || order.id} className="bg-black/20 border border-white/5 rounded-xl p-6 hover:border-[#DCCA87]/30 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[#DCCA87] font-bold text-sm block mb-1">
                             #{order.orderId ? order.orderId : (order._id ? order._id.slice(-6).toUpperCase() : 'ID-MISSING')}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(order.createdAt || order.date)}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          (order.status === 'Delivered' || order.status === 'Success') ? 'bg-green-900/20 text-green-400 border-green-900/50' : 
                          order.status === 'Processing' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50' : 
                          'bg-blue-900/20 text-blue-400 border-blue-900/50'
                        }`}>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                      
                      {/* Render Items logic depends on backend structure, using a safe fallback */}
                      <div className="text-gray-300 text-sm mb-4">
                         {Array.isArray(order.items) 
                           ? order.items.map(i => `${i.name} (x${i.quantity})`).join(', ') 
                           : "Luxury Fragrance Assortment"
                         }
                      </div>

                      <div className="flex justify-between items-center border-t border-white/5 pt-4">
                        <span className="text-gray-400 text-xs uppercase">Total Amount</span>
                        <span className="text-white font-bold">₹{order.amount || order.total}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- PAYMENTS TAB --- */}
            {activeTab === 'payments' && (
              <div className="animate-fadeIn space-y-4">
                <h2 className="text-2xl font-serif text-white mb-6">Payment History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#DCCA87]/10 text-[#DCCA87] text-xs uppercase">
                      <tr>
                        <th className="p-4 rounded-l-lg">Payment ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4 rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-300">
                      {orders.map((order) => (
                        <tr key={order._id || order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-xs">{order.paymentId ? order.paymentId.slice(0, 12) + "..." : "COD"}</td>
                          <td className="p-4">{formatDate(order.createdAt || order.date)}</td>
                          <td className="p-4">{order.paymentId ? "Razorpay" : "Cash"}</td>
                          <td className="p-4 font-bold text-white">₹{order.amount || order.total}</td>
                          <td className="p-4">
                            <span className="text-green-400">Success</span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-gray-500">No payment history available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;