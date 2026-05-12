"use client";
import { useEffect, useState } from "react";
import { User, Package, MapPin, CheckCircle2, Navigation, Send, ChevronRight, X, Loader2 } from "lucide-react";

export default function DeliveryDashboard() {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [activeOTPOrder, setActiveOTPOrder] = useState(null);
  const [otp, setOtp] = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/delivery/orders");
      const data = await res.json();
      const groups = data.reduce((acc, order) => {
        const location = order.address || "Main City";
        if (!acc[location]) acc[location] = [];
        acc[location].push(order);
        return acc;
      }, {});
      setGroupedOrders(groups);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleSendOTP = async (orderId, email) => {
    if (!email) return alert("Email not found");
    setProcessing(orderId);
    try {
      const res = await fetch("/api/delivery/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });
      if (res.ok) {
        setActiveOTPOrder(orderId);
        setOtp(""); // Reset OTP field
      } else {
        alert("Failed to send OTP");
      }
    } catch (err) { alert("Network Error"); }
    finally { setProcessing(null); }
  };

  const handleVerify = async (orderId, location) => {
    if (otp.length < 4) return;
    setProcessing("verifying");
    try {
      const res = await fetch("/api/delivery/complete-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, otp: otp.trim() }), // Trim to avoid spaces
      });

      if (res.ok) {
        // Remove delivered order from UI
        const updated = groupedOrders[location].filter(o => o._id !== orderId);
        const newGroups = { ...groupedOrders };
        if (updated.length === 0) delete newGroups[location];
        else newGroups[location] = updated;
        setGroupedOrders(newGroups);
        setActiveOTPOrder(null);
        alert("Success! Mangoes Delivered 🥭");
      } else {
        alert("Invalid OTP. Please check again.");
      }
    } catch (err) { alert("Error verifying"); }
    finally { setProcessing(null); }
  };

  if (loading) return (
    <div className="h-screen bg-white flex items-center justify-center">
      <Loader2 className="animate-spin text-[#1B4332]" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FBFA] text-[#1A1A1A] pb-10">
      {/* Dynamic Header */}
      <div className="bg-[#1B4332] pt-12 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Fleet Management</p>
            <h1 className="text-white text-2xl font-black italic tracking-tight">KAIRI <span className="font-light not-italic text-white/80">PARTNER</span></h1>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 space-y-8">
        {Object.entries(groupedOrders).map(([location, orders]) => (
          <div key={location} className="space-y-4">
            <div className="flex items-center gap-2 ml-2">
              <Navigation size={12} className="text-[#2D6A4F]" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{location.split(',')[0]}</span>
            </div>

            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[32px] p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-50 relative overflow-hidden">
                
                {/* Status Badge */}
                <div className="absolute top-0 right-0 bg-[#F4F7F5] px-4 py-2 rounded-bl-3xl">
                   <p className="text-[9px] font-bold text-[#2D6A4F] uppercase tracking-tighter italic">Order Confirmed</p>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#1B4332] rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-[#1B4332]/20">
                    <User size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{order.userId?.name || "Premium User"}</h3>
                    <p className="text-[11px] text-gray-400 font-medium">#{order.orderId.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/50 rounded-3xl p-5 mb-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-orange-500"><Package size={16} /></div>
                    <span className="text-sm font-semibold">{order.items[0]?.title} <span className="text-gray-300 ml-1 italic font-medium">x{order.items[0]?.quantity}</span></span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600"><MapPin size={16} /></div>
                    <span className="text-[11px] font-medium text-gray-500 leading-relaxed">{order.address}</span>
                  </div>
                </div>

                {/* OTP UI Section */}
                {activeOTPOrder === order._id ? (
                  <div className="animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder="ENTER OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-[#F4F7F5] border-none rounded-2xl py-4 px-6 text-center font-black tracking-[0.5em] focus:ring-2 focus:ring-[#1B4332] transition-all"
                        />
                        {otp && (
                          <X size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" onClick={() => setOtp("")}/>
                        )}
                      </div>
                      <button 
                        onClick={() => handleVerify(order._id, location)}
                        disabled={processing === "verifying"}
                        className="bg-[#1B4332] text-white p-4 rounded-2xl shadow-xl shadow-[#1B4332]/20 active:scale-95 transition-all"
                      >
                        {processing === "verifying" ? <Loader2 className="animate-spin" size={20}/> : <ChevronRight size={24}/>}
                      </button>
                    </div>
                    <p className="text-[9px] text-center mt-3 text-gray-300 font-bold uppercase tracking-widest">Verify Customer Code</p>
                  </div>
                ) : (
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => handleSendOTP(order._id, order.userId?.email)}
                      disabled={processing === order._id}
                      className="flex-1 py-4 bg-gray-50 text-[#1B4332] rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                      {processing === order._id ? <Loader2 className="animate-spin" size={14}/> : <><Send size={14} /> Send OTP</>}
                    </button>
                    <button 
                      onClick={() => setActiveOTPOrder(order._id)}
                      className="flex-[1.5] py-4 bg-[#1B4332] text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#1B4332]/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <CheckCircle2 size={16} /> Delivered
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}