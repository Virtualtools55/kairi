"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductListClient({ products = [] }) {
  const [addingId, setAddingId] = useState(null);
  const [checkingId, setCheckingId] = useState(null); // Get Fresh Mangoes ke button loading ke liye
  const router = useRouter();

  // Handle "Get Fresh Mangoes" Verification
  const handleGetFreshMangoes = async (productId) => {
    setCheckingId(productId);
    try {
      // Jo API humne upar banayi usko hit karenge
      const res = await fetch("/api/auth/check", { method: "GET" });

      if (res.status === 401) {
        // Unauthenticated users direct login page par send honge
        router.push("/auth/login");
        return;
      }

      if (res.ok) {
        // Authenticated hai to normal push execute hoga
        router.push(`/products/${productId}`);
      }
    } catch (err) {
      console.error("Auth verification failed:", err);
      router.push("/auth/login"); // Fallback safety
    } finally {
      setCheckingId(null);
    }
  };

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (res.ok) {
        alert("Added to cart! 🥭");
      }
    } catch (err) {
      console.error("Cart Error:", err);
    } finally {
      setAddingId(null);
    }
  };

  // Agar products khali hon to layout crash hone ke bajaye ye safe state dikhegi
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-[#FDFBF7]">
        <p className="text-gray-400 font-medium tracking-wide">
          No premium products available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12">
      {products.map((product) => (
        <div
          key={product._id}
          className="group bg-white rounded-[40px] p-5 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(45,106,79,0.12)] transition-all duration-500 border border-gray-50 flex flex-col"
        >
          {/* Image Container */}
          <div className="relative aspect-[4/5] rounded-[30px] overflow-hidden bg-[#F9F8F3]">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-opacity duration-500 group-hover:opacity-90"
            />
            
            {/* Wishlist Button */}
            <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-gray-400 hover:text-[#FF5E00] transition-all cursor-pointer z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Details Section */}
          <div className="mt-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lg text-[#1A2B48] tracking-tight">
                {product.title}
              </h3>
              {/* Fresh Leaf Tag */}
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-1 rounded-full">
                <div className="w-1 h-1 bg-[#2D6A4F] rounded-full animate-pulse"></div>
                Fresh
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl font-black text-[#2D6A4F]">
                ₹{product.discountPrice > 0 ? product.discountPrice : product.price}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-sm text-gray-300 line-through font-bold">
                  ₹{product.price}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              {/* Primary Button: Deep Forest Green with validation loading */}
              <button
                onClick={() => handleGetFreshMangoes(product._id)}
                disabled={checkingId === product._id}
                className="w-full py-4 bg-[#2D6A4F] text-white rounded-[22px] font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-[#1B4332] transition-all cursor-pointer shadow-lg shadow-[#2D6A4F]/10 active:scale-[0.97] flex justify-center items-center disabled:opacity-75"
              >
                {checkingId === product._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Get Fresh Mangoes"
                )}
              </button>

              {/* Secondary Button: Ripened Orange */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={addingId === product._id}
                className="w-full py-4 bg-[#FFF5F0] text-[#FF5E00] border border-[#FF5E00]/20 rounded-[22px] font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-[#FF5E00] hover:text-white transition-all cursor-pointer flex justify-center items-center active:scale-[0.97] disabled:opacity-50"
              >
                {addingId === product._id ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}