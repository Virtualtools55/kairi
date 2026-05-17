"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script'; // Import Script for Razorpay
import { ShoppingBasket, ArrowRight, Trash2, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Processing state
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch('/api/cart/get');
    if (res.status === 401) {
      router.push('/auth/login');
      return;
    }
    const data = await res.json();
    setCart(data.cart);
    setLoading(false);
  };

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    const res = await fetch('/api/cart/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      const data = await res.json();
      setCart(data.cart);
    }
    setRemovingId(null);
  };

  // --- NEW CHECKOUT LOGIC ---
  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cartItems: cart.items, 
          userId: cart.userId // Make sure your cart object has userId
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Kairi.in",
        description: "Fresh Mango Delivery",
        order_id: data.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              dbOrderId: data.dbOrderId
            }),
          });

          if (verifyRes.ok) {
            router.push("/payment-success");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#2D6A4F" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFAF5]">
      <div className="w-8 h-8 border-2 border-[#FF5E00]/20 border-t-[#FF5E00] rounded-full animate-spin"></div>
    </div>
  );

  const subtotal = cart?.items.reduce((acc, item) => {
    const price = item.productId.discountPrice || item.productId.price;
    return acc + (price * item.quantity);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-[#FCFAF5] py-10 px-6 lg:px-24">
      {/* Load Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            My Basket<span className="text-[#FF5E00]">.</span>
          </h1>
          <p className="text-[#2D6A4F] text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-70">
            Selected Fresh Picks
          </p>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-[40px] p-16 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-[#F3F5F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#2D6A4F]/20">
              <ShoppingBasket size={32} />
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Your basket is empty</h2>
            <p className="text-gray-400 text-sm mb-8 italic">Sabse acche aam abhi baki hain!</p>
            <Link href="/" className="inline-block bg-[#FF5E00] text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-[#FF5E00]/20 hover:bg-[#2D6A4F] transition-all duration-500 text-[10px] uppercase tracking-widest active:scale-95">
              Explore Mangoes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-7 space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId._id} className="bg-white p-5 rounded-[30px] flex items-center gap-6 shadow-sm border border-gray-100 group transition-all hover:shadow-md">
                  <div className="relative h-24 w-24 bg-[#F3F5F0] rounded-[22px] overflow-hidden flex-shrink-0">
                    <Image src={item.productId.imageUrl} alt={item.productId.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-[#1a1a1a] text-lg tracking-tight">{item.productId.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-black text-[#2D6A4F]">₹{item.productId.discountPrice || item.productId.price}</span>
                      <span className="px-3 py-1 bg-[#F3F5F0] rounded-full text-[9px] font-black text-[#2D6A4F] uppercase tracking-tighter">Qty: {item.quantity}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemove(item.productId._id)}
                    disabled={removingId === item.productId._id}
                    className="p-4 rounded-2xl text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 cursor-pointer active:scale-90"
                  >
                    {removingId === item.productId._id ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#F3F5F0] p-8 rounded-[40px] border border-[#2D6A4F]/5 shadow-sm relative overflow-hidden sticky top-10">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF5E00]/5 rounded-full blur-3xl"></div>

                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2D6A4F] mb-8 flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#FF5E00] rounded-full animate-pulse"></span>
                  Bill Summary
                </h2>
                
                <div className="space-y-5 mb-8 relative z-10">
                  <div className="flex justify-between items-center text-xs font-bold text-[#1a1a1a]/60">
                    <span className="tracking-tight">Subtotal</span>
                    <span className="text-[#1a1a1a]">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#1a1a1a]/60 tracking-tight">Delivery Fee</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 line-through text-[10px] font-medium">₹99</span>
                      <span className="text-[#2D6A4F] bg-[#2D6A4F]/10 px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase">Free</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#2D6A4F]/10 mt-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2D6A4F] opacity-40 mb-1">To Pay</p>
                        <span className="text-4xl font-black text-[#1a1a1a] tracking-tighter">₹{subtotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-[#2D6A4F] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#1a3d2e] transition-all duration-500 flex items-center justify-center gap-3 group cursor-pointer shadow-xl shadow-[#2D6A4F]/20 relative z-10 overflow-hidden active:scale-95 disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {isProcessing ? "Processing..." : "Place Order Now"}
                  </span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                </button>

                <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
                  <ShieldCheck size={14} className="text-[#2D6A4F]" />
                  <p className="text-[8px] font-black text-[#2D6A4F] uppercase tracking-[0.2em]">
                    100% Secure Checkout
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}