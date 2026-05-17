"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, Clock, Leaf, XCircle } from "lucide-react";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null); // Track click loading status
  const router = useRouter();

  const fetchOrders = () => {
    fetch("/api/user-orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper Function: Check karega ki order 1 ghante se purana hai ya nahi
  const isCancellable = (createdAt) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;
    return (currentTime - orderTime) < oneHour;
  };

  // Cancel Handler Function
  const handleCancelOrder = async (e, orderId) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    
    if (!confirm("Are you sure you want to cancel this order? Packets are personalized quickly.")) return;

    setCancellingId(orderId);
    try {
      const response = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Order successfully cancelled.");
        fetchOrders(); // UI refresh karne ke liye orders dubara fetch honge
      } else {
        alert(result.error || "Failed to cancel order.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FCFAF5]">
      <div className="w-6 h-6 border-2 border-[#23533E]/20 border-t-[#23533E] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#23533E] antialiased selection:bg-[#FF5E00] selection:text-white">
      
      {/* Top Header */}
      <div className="bg-white border-b border-[#EFE9DD] px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
             <Leaf size={14} className="text-[#23533E] opacity-60" />
             <p className="text-[9px] font-black text-[#23533E] uppercase tracking-[0.5em]">My Sanctuary</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#23533E] tracking-tight">
            Pure Harvest<span className="text-[#FF5E00]">.</span>
          </h1>
          <p className="text-slate-900 text-[10px] font-bold mt-4 uppercase tracking-widest opacity-60">Your collection of nature&apos;s finest</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-6 -mt-8 pb-20">
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#23533E] bg-white px-8 py-3 rounded-full shadow-sm border border-[#EFE9DD]">
              Orders History
            </h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white border border-dashed border-[#EFE9DD] rounded-[40px] p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#FFFDF9] border border-[#EFE9DD] rounded-full flex items-center justify-center mx-auto mb-6 text-[#23533E]/40">
                <Package size={24} />
              </div>
              <p className="text-xs text-slate-800 font-bold uppercase tracking-widest mb-6">No harvests recorded yet.</p>
              <button 
                onClick={() => router.push("/")} 
                className="px-10 py-4 bg-[#FF5E00] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#23533E] transition-all duration-500 cursor-pointer shadow-lg shadow-[#FF5E00]/20 active:scale-95"
              >
                Start Journey
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => {
                const cancellable = isCancellable(order.createdAt) && order.status !== "Cancelled";

                return (
                  <div 
                    key={order._id} 
                    className="group bg-white border border-[#EFE9DD] rounded-[30px] p-5 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#FFFDF9] border border-[#EFE9DD] rounded-[22px] flex items-center justify-center text-[#23533E] group-hover:scale-95 transition-transform flex-shrink-0">
                        <Package size={22} />
                      </div>
                      <div>
                        <h3 className="font-black text-[#23533E] text-base tracking-tight truncate max-w-[180px] md:max-w-none">
                          {order.items[0]?.title || "Premium Mango"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                            <Clock size={12} className="text-[#FF5E00]" /> 
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-tighter ${
                            order.status === "Cancelled" ? "bg-red-50 text-red-600" : "bg-[#23533E]/5 text-[#23533E]"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5 border-t border-gray-50 pt-3 md:pt-0 md:border-none">
                      {/* Dynamic Cancel Button */}
                      {cancellable && (
                        <button
                          onClick={(e) => handleCancelOrder(e, order._id)}
                          disabled={cancellingId === order._id}
                          className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 rounded-xl transition-all border border-red-100"
                        >
                          <XCircle size={12} />
                          {cancellingId === order._id ? "Processing..." : "Cancel Order"}
                        </button>
                      )}

                      <div className="flex items-center gap-4 ml-auto md:ml-0">
                        <div className="text-right">
                          <p className="text-lg font-black text-[#23533E] tracking-tighter">₹{order.amount}</p>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center bg-[#FFFDF9] border border-[#EFE9DD] rounded-2xl text-gray-400 group-hover:text-white group-hover:bg-[#FF5E00] group-hover:border-[#FF5E00] transition-all duration-500">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}