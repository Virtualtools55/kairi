"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchCart = async () => {
  try {
    const res = await fetch('/api/cart/get');
    const data = await res.json();
    
    // Agar API direct array bhej rahi hai toh data, 
    // agar { cart: [...] } bhej rahi hai toh data.cart
    if (Array.isArray(data)) {
      setCartItems(data);
    } else if (data.cart && Array.isArray(data.cart)) {
      setCartItems(data.cart);
    } else {
      setCartItems([]); // Fallback to empty array
    }
  } catch (err) {
    console.error(err);
    setCartItems([]);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => { fetchCart(); }, []);

  const deleteItem = async (id) => {
    const res = await fetch(`/api/cart/delete?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchCart();
  };

  // 💰 Total Calculation Logic
  const totalAmount = cartItems.reduce((acc, item) => {
    const price = item.productId.discountPrice || item.productId.price;
    return acc + (price * item.quantity);
  }, 0);

  if (loading) return <div className="p-20 text-center font-black text-orange-500">Loading Your Selection...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 font-sans">
      <h1 className="text-5xl font-black text-[#2B1B12] mb-12 tracking-tighter italic">Your Bag <span className="text-[#FF5E00]">.</span></h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-200">
          <p className="text-2xl font-bold text-gray-400">Empty like a dry orchard. 🥭</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-[35px] shadow-sm flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50">
                    <Image src={item.productId.imageUrl} fill className="object-cover" alt="mango" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2B1B12]">{item.productId.title}</h3>
                    <p className="text-[#2D6A4F] font-bold">₹{item.productId.discountPrice || item.productId.price} x {item.quantity}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteItem(item._id)}
                  className="bg-red-50 text-red-500 font-black p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-xs tracking-widest"
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Card */}
          <div className="bg-black p-10 rounded-[50px] h-fit sticky top-10 shadow-2xl">
            <h2 className="text-white text-2xl font-black mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-400 mb-4 font-bold">
              <span>Items:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between items-center mt-10">
              <span className="text-white font-black text-xl">TOTAL</span>
              <span className="text-4xl font-black text-[#FF5E00]">₹{totalAmount}</span>
            </div>
            
            <button className="w-full mt-10 py-5 bg-[#FF5E00] hover:bg-white hover:text-black text-white font-black rounded-2xl transition-all shadow-xl shadow-[#FF5E00]/20 text-lg uppercase tracking-widest">
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}