"use client"
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchProducts(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCF9F2]">
        <div className="w-12 h-12 border-2 border-[#FF5E00]/10 border-t-[#FF5E00] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="bg-[#FCF9F2] min-h-screen py-12 px-4 md:px-12">
      {/* Grid Container - Adjusted for better spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}

function ProductCard({ product }) {
  return (
    <div className="group relative flex flex-col bg-white rounded-[50px] p-4 transition-all duration-500 hover:shadow-[0_40px_80px_-30px_rgba(255,94,0,0.15)]">
      
      {/* 1. Image Container (The Hero of the Card) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[40px] bg-[#F8F8F8] flex items-center justify-center">
        {/* Organic Tag */}
        <div className="absolute top-5 left-5 z-10 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-100">
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2D6A4F]">Farm Fresh</span>
        </div>

        {product.isSoldOut && (
          <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-black text-white text-[10px] font-black px-6 py-2 rounded-full tracking-widest uppercase rotate-[-5deg] shadow-2xl">
              Sold Out
            </div>
          </div>
        )}

        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className={`w-[85%] h-[85%] object-contain transition-transform duration-700 group-hover:scale-110 ${
            product.isSoldOut ? 'grayscale opacity-30' : 'drop-shadow-2xl'
          }`} 
        />
      </div>

      {/* 2. Content Section */}
      <div className="pt-6 pb-4 px-4 text-center">
        <h3 className="text-xl font-bold text-[#1A2B48] tracking-tight mb-2 group-hover:text-[#FF5E00] transition-colors">
          {product.title}
        </h3>
        
        {/* Pricing Logic */}
        <div className="flex items-center justify-center gap-3">
          {product.discountPrice > 0 ? (
            <div className="flex flex-col">
              <span className="text-[#2D6A4F] text-2xl font-black italic leading-none">₹{product.discountPrice}</span>
              <span className="text-gray-300 line-through text-[10px] font-bold mt-1">MRP ₹{product.price}</span>
            </div>
          ) : (
            <span className="text-[#2D6A4F] text-2xl font-black italic">₹{product.price}</span>
          )}
        </div>

        {/* 3. Action Button (Luxury Interaction) */}
        <button 
          disabled={product.isSoldOut}
          className={`mt-6 w-full py-4 rounded-[25px] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden relative group/btn ${
            product.isSoldOut 
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-[#FF5E00] shadow-xl hover:shadow-[#FF5E00]/30'
          }`}
        >
          <span className="relative z-10">
            {product.isSoldOut ? 'Not in Season' : 'Add to Basket'}
          </span>
        </button>
      </div>

      {/* Subtle Bottom Accent */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-t-full transition-all duration-500 ${
        product.isSoldOut ? 'bg-gray-100' : 'bg-[#FF5E00] opacity-0 group-hover:opacity-100'
      }`}></div>
    </div>
  );
}