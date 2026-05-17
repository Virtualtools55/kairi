"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script'; // Razorpay SDK load karne ke liye
import { ShoppingBasket, ArrowRight, Trash2, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  // ... (Aapka purana fetchCart aur handleRemove logic yahan rahega)

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    setCheckingOut(true);
    try {
      // 1. Backend se Order ID mangwayein (Securely)
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart.items }),
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // 2. Razorpay Options Configure karein
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Kairi.in",
        description: "Premium Mango Harvest",
        order_id: data.id, // Razorpay Order ID
        handler: async function (response) {
          // 3. Payment Verify karwayein (Payment hone ke baad ye chalta hai)
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: data.dbOrderId // Hamara DB Order ID
            }),
          });

          if (verifyRes.ok) {
            router.push("/order-success"); // Success page par redirect
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "Ankit Kumar", // Optional: User session se lein
          email: "ankit@example.com",
        },
        theme: { color: "#2D6A4F" }, // Kairi Green
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Something went wrong during checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF5] py-10 px-6 lg:px-24">
      {/* Razorpay SDK Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* ... (Aapka Cart UI Logic) ... */}

      {/* Place Order Button Update */}
      <button 
        onClick={handleCheckout}
        disabled={checkingOut || !cart?.items.length}
        className="w-full bg-[#2D6A4F] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#1a3d2e] transition-all duration-500 flex items-center justify-center gap-3 group cursor-pointer shadow-xl shadow-[#2D6A4F]/20 active:scale-95 disabled:opacity-50"
      >
        {checkingOut ? "Processing..." : "Place Order Now"}
        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  );
}