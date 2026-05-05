"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Maan lo login ke baad tumne userId localStorage mein save ki hai
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Client side par userId nikalna
    const savedUserId = localStorage.getItem("userId") || "user_guest_123"; 
    setUserId(savedUserId);
    
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/fetchProducts');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCF9F2]">
        <div className="w-12 h-12 border-2 border-[#FF5E00]/10 border-t-[#FF5E00] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="bg-[#FCF9F2] min-h-screen py-12 px-4 md:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} userId={userId} />
        ))}
      </div>
    </main>
  );
}

function ProductCard({ product, userId }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please login first!");
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId, // Asali ID jo parent se aayi
          productId: product._id 
        }),
      });

      if (response.ok) {
        alert(`${product.title} cart mein add ho gaya! 🥭`);
      } else {
        const data = await response.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Cart Error:", error);
      alert("Network problem!");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-[32px] p-3 md:p-5 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(255,94,0,0.15)] border border-gray-50 w-full max-w-[400px] mx-auto min-h-[420px] md:min-h-[450px]">
      
      {/* Image Section */}
      <div className="relative w-full h-[200px] md:h-[240px] overflow-hidden rounded-[24px] bg-[#F9F9F9]">
        <div className="absolute top-3 left-3 z-30 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
           <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-[#2D6A4F]">Farm Fresh</span>
        </div>
        {product.isSoldOut && (
          <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-black text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">Sold Out</span>
          </div>
        )}
        <Image 
          src={product.imageUrl} 
          alt={product.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${product.isSoldOut ? 'grayscale opacity-40' : ''}`} 
        />
      </div>

      {/* Content Section */}
      <div className="pt-4 flex flex-col flex-grow text-left">
        <h3 className="text-base md:text-xl font-extrabold text-[#1A2B48] leading-tight mb-2 line-clamp-1">{product.title}</h3>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
          <span className="text-[#2D6A4F] text-xl md:text-2xl font-black">₹{product.discountPrice > 0 ? product.discountPrice : product.price}</span>
          {product.discountPrice > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-xs md:text-sm font-medium">₹{product.price}</span>
              <span className="bg-orange-100 text-orange-600 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-md">SAVE ₹{product.price - product.discountPrice}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex w-full gap-2 md:gap-3">
          <button disabled={product.isSoldOut} className="flex-[4] py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 bg-black text-white hover:bg-[#FF5E00]">
            {product.isSoldOut ? 'Sold Out' : 'Get Fresh Mangoes'}
          </button>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.isSoldOut || isAdding}
            className="flex-1 flex items-center justify-center rounded-xl md:rounded-2xl bg-[#FFF5F0] text-[#FF5E00] border border-[#FF5E00]/10 hover:bg-[#FF5E00] hover:text-white"
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-[#FF5E00] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}