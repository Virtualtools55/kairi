"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
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
      setCart(data.cart); // Update UI instantly with new cart data
    }
    setRemovingId(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0]">
      <div className="text-2xl font-black text-[#FF5E00] animate-pulse uppercase tracking-[0.3em]">Preparing Basket...</div>
    </div>
  );

  const subtotal = cart?.items.reduce((acc, item) => {
    const price = item.productId.discountPrice || item.productId.price;
    return acc + (price * item.quantity);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-12 px-6 lg:px-24 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-black text-[#2B1B12] tracking-tighter mb-12 uppercase">Your Harvest</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border-2 border-dashed border-[#FF5E00]/20">
            <h2 className="text-3xl font-bold text-[#2B1B12]/40 mb-6">Your cart is feeling light.</h2>
            <Link href="/" className="inline-block bg-[#FF5E00] text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-[#E65500] transition-all uppercase tracking-widest text-xs">
              Back to Orchard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Item List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => (
                <div key={item.productId._id} className="bg-white p-6 rounded-[35px] flex items-center gap-6 shadow-sm group hover:shadow-md transition-all border border-transparent hover:border-[#FF5E00]/10">
                  <div className="relative h-28 w-28 bg-[#F9F8F3] rounded-[25px] overflow-hidden flex-shrink-0">
                    <Image src={item.productId.imageUrl} alt={item.productId.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-black text-[#2B1B12]">{item.productId.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-bold text-[#2D6A4F]">₹{item.productId.discountPrice || item.productId.price}</span>
                      <span className="text-xs font-black text-[#2B1B12]/30 uppercase tracking-widest">Qty: {item.quantity}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemove(item.productId._id)}
                    disabled={removingId === item.productId._id}
                    className="p-4 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                  >
                    {removingId === item.productId._id ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-[#1A2B48] p-10 rounded-[40px] text-white h-fit sticky top-10 shadow-2xl">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-4">Checkout</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between font-bold opacity-60">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between font-bold opacity-60">
                  <span>Delivery</span>
                  <span className="text-[#FF5E00]">FREE</span>
                </div>
                <div className="flex justify-between text-3xl font-black pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>

              <button className="w-full bg-[#2D6A4F] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#388E3C] transition-all shadow-lg active:scale-95">
                Proceed to Payment
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}