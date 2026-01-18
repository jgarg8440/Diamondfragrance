import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const AdminDashboard = () => {
  const { user, isAuthChecking } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  // Status Options for Dropdown
  const STATUS_TYPES = ["created", "paid", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    // Wait for auth check to finish
    if (isAuthChecking) return;

    // 1. Security Check: Redirect if not logged in or not admin
    // Note: This matches the email in your .env file
    if (!user || user.email !== "diamondfragrance8@gmail.com") { 
      // navigate("/"); // Uncomment to force redirect non-admins
      // return;
    }

    // 2. Fetch Data
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/admin/orders");
        setOrders(data.orders);
        setStats(data.stats);
      } catch (error) {
        console.error("Admin Access Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAdminData();
  }, [user, isAuthChecking, navigate]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/order/${orderId}`, { status: newStatus });
      // Update UI locally (Optimistic Update)
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      alert(`Order updated to ${newStatus}`);
    } catch (error) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0C0C0C] text-[#DCCA87] flex items-center justify-center animate-pulse">Loading Command Center...</div>;

  return (
    <div className="min-h-screen bg-[#0C0C0C] p-4 md:p-8 pt-24 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-10 border-b border-[#DCCA87]/20 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#DCCA87] mb-2 tracking-widest">COMMAND CENTER</h1>
            <p className="text-gray-400 text-xs uppercase tracking-[0.3em]">Administrator: {user?.name}</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500">System Status</p>
            <p className="text-green-500 font-bold text-sm flex items-center justify-end gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE
            </p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Revenue */}
          <div className="bg-[#1a1a1a] border border-[#DCCA87]/30 p-6 rounded-2xl relative overflow-hidden group hover:border-[#DCCA87] transition-all">
            <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Total Revenue</h3>
            <p className="text-3xl md:text-4xl font-mono font-bold text-[#DCCA87]">₹{stats.totalRevenue.toLocaleString()}</p>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-24 h-24 text-[#DCCA87]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.58 0-2.86 2.55-4.5 4.07-4.9V2h2.67v1.98c1.65.38 2.84 1.49 2.93 3.33h-1.9c-.1-1.14-.82-1.77-2.67-1.77-1.88 0-2.58.9-2.58 1.63 0 .8.58 1.4 2.58 1.87 2.48.56 4.3 1.73 4.3 3.59.02 2.89-2.54 4.54-4.15 4.96z"/></svg>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Total Orders</h3>
            <p className="text-3xl md:text-4xl font-mono font-bold text-white">{stats.totalOrders}</p>
          </div>

          {/* Pending */}
          <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Pending Action</h3>
            <p className="text-3xl md:text-4xl font-mono font-bold text-orange-400">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 border-b border-white/10">ID</th>
                  <th className="p-4 border-b border-white/10">Customer</th>
                  <th className="p-4 border-b border-white/10">Items</th>
                  <th className="p-4 border-b border-white/10">Amount</th>
                  <th className="p-4 border-b border-white/10">Status</th>
                  <th className="p-4 border-b border-white/10">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-gray-300">
                    <td className="p-4 font-mono text-[#DCCA87]">
                      #{order.orderId ? order.orderId.slice(6) : order._id.slice(-6)}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{order.customerInfo.name}</div>
                      <div className="text-[10px] text-gray-500">{order.customerInfo.email}</div>
                    </td>
                    <td className="p-4">
                      {order.items.length} Items
                    </td>
                    <td className="p-4 font-bold">₹{order.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        order.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        className="bg-black border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-[#DCCA87] outline-none cursor-pointer hover:border-gray-500"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        {STATUS_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;