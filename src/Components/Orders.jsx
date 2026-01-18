import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", { 
          withCredentials: true 
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Please login to view orders");
        window.location.href = "/login";
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="text-[#DCCA87] text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-[#DCCA87] mb-8 text-center">
          Your Orders
        </h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-300 text-xl mb-4">No orders found.</p>
            <a 
              href="/" 
              className="inline-block bg-[#DCCA87] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#bfa760] transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-[#DCCA87]/20 hover:border-[#DCCA87]/50 transition-all"
              >
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start mb-4 pb-4 border-b border-white/10">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-mono text-[#DCCA87] font-semibold">
                      {order.orderId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Payment ID</p>
                  <p className="font-mono text-sm text-white">{order.paymentId}</p>
                </div>

                {/* Customer Info */}
                <div className="bg-white/5 p-4 rounded-lg mb-4">
                  <h4 className="text-[#DCCA87] font-semibold mb-2">Delivery Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p><span className="text-gray-400">Name:</span> {order.customerInfo.name}</p>
                    <p><span className="text-gray-400">Phone:</span> {order.customerInfo.phone}</p>
                    <p className="md:col-span-2"><span className="text-gray-400">Email:</span> {order.customerInfo.email}</p>
                    <p className="md:col-span-2"><span className="text-gray-400">Address:</span> {order.customerInfo.address}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="text-[#DCCA87] font-semibold mb-3">Items Ordered</h4>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div 
                        key={i} 
                        className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-[#DCCA87]">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-[#DCCA87]">
                    ₹{order.amount}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Payment Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;