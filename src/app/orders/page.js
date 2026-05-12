"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, Clock } from "lucide-react";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/orders/user-orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-xs font-bold tracking-[0.2em] text-gray-400">LOADING PROFILE...</div>;

  return (
    <div className="min-h-screen bg-[#FBFBFB] antialiased pb-20">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* <p className="text-[10px] font-bold text-[#FF5E00] uppercase tracking-[0.3em] mb-2">Account Dashboard</p> */}
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight">Your Harvests<span className="text-[#FF5E00]">.</span></h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Recent Orders</h2>
          
          {orders.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center">
              <Package className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-sm text-gray-500 font-medium">No orders yet. Start your first harvest today!</p>
              <button onClick={() => router.push("/")} className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#FF5E00]">Browse Mangoes →</button>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white border border-gray-100 rounded-[24px] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Order Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2D6A4F]">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a1a] text-sm md:text-base">
                      {order.items[0]?.title || "Premium Mango Box"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight flex items-center gap-1">
                        <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        order.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between md:justify-end md:gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</p>
                    <p className="text-lg font-black text-[#2D6A4F]">₹{order.amount}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-300 hover:text-[#FF5E00]">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}