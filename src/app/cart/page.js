"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // FETCH CART - No UserId needed in frontend
  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart/get`);
      
      if (res.status === 401) {
        setCart(null); // User logged in nahi hai
        return;
      }

      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // REMOVE ITEM - Securely via Token on backend
  const handleRemove = async (productId) => {
    setDeletingId(productId);
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }) // Sirf Product ID bhejni hai
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.cart); 
      } else {
        alert("Nikaalne mein thoda issue aaya, phir se try karein.");
      }
    } catch (error) {
      console.error("Remove error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF9F2]">
        <div className="w-10 h-10 border-4 border-[#FF5E00]/20 border-t-[#FF5E00] rounded-full animate-spin"></div>
      </div>
    );
  }

  const subtotal = cart?.items?.reduce((acc, item) => {
    const price = item.productId?.discountPrice || item.productId?.price || 0;
    return acc + (price * item.quantity);
  }, 0) || 0;

  return (
    <main className="bg-[#FCF9F2] min-h-screen py-12 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-[#1A2B48] mb-8 uppercase tracking-tighter italic">Your Mango Basket 🥭</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white p-12 rounded-[40px] text-center shadow-sm border border-dashed border-gray-200">
            <p className="text-gray-400 mb-6 font-medium text-lg">Your basket is empty. Add some fresh mangoes!</p>
            <Link href="/" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#FF5E00] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List of Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId?._id} className="bg-white p-4 md:p-6 rounded-[32px] flex items-center gap-4 shadow-sm border border-gray-50 transition-all hover:border-orange-100">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-[#F9F9F9] rounded-2xl overflow-hidden flex-shrink-0">
                    {item.productId?.imageUrl && (
                      <Image src={item.productId.imageUrl} alt={item.productId.title || "Mango"} fill className="object-cover" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-[#1A2B48] text-sm md:text-lg leading-tight">{item.productId?.title}</h3>
                    <p className="text-[#2D6A4F] font-black text-sm md:text-base mt-1">
                      ₹{item.productId?.discountPrice || item.productId?.price} 
                      <span className="text-gray-400 font-medium ml-2 text-xs">x {item.quantity}</span>
                    </p>
                  </div>

                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => handleRemove(item.productId?._id)}
                    disabled={deletingId === item.productId?._id}
                    className={`p-3 rounded-2xl transition-all ${
                      deletingId === item.productId?._id 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {deletingId === item.productId?._id ? (
                      <div className="w-5 h-5 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-8 rounded-[40px] h-fit shadow-lg border border-orange-50 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-[#1A2B48]">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-medium text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-500 border-b border-gray-50 pb-4">
                  <span>Delivery</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-1 rounded-md">Free</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-[#1A2B48]">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>
              <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#FF5E00] active:scale-95 transition-all shadow-xl shadow-orange-100">
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}