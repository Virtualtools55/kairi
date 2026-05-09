// app/products/[id]/page.js
"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SingleProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/get-single?id=${id}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!product) return <div className="h-screen flex items-center justify-center bg-[#F9F9F9] text-sm font-bold tracking-widest text-gray-400">LOADING...</div>;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] antialiased">
      {/* Simple Top Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button onClick={() => router.back()} className="text-[10px] font-bold uppercase tracking-widest hover:text-[#FF5E00] transition-colors">
          ← Back
        </button>
        <span className="font-black text-sm tracking-tighter uppercase">Kairi<span className="text-[#FF5E00]">.</span></span>
        <div className="w-10"></div> {/* Spacer for balance */}
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 md:py-16">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* Left: Balanced Image */}
          <div className="w-full md:w-[45%]">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <Image 
                src={product.imageUrl} 
                alt={product.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Clean Content */}
          <div className="w-full md:w-[55%] space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#FF5E00] uppercase tracking-[0.2em]">Premium Orchard Selection</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111]">
                {product.title}
              </h1>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-md">
                {product.description || "Authentic, naturally ripened mangoes delivered straight from the farm to your doorstep."}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-[#2D6A4F]">₹{product.discountPrice}</span>
              <span className="text-lg text-gray-300 line-through font-medium">₹{product.price}</span>
            </div>

            {/* Subtle Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
              <div className="text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Origin</p>
                <p className="text-xs font-semibold">Organic Farm</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Delivery</p>
                <p className="text-xs font-semibold">1 Days</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Quality</p>
                <p className="text-xs font-semibold">Hand-Picked</p>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-6">
              <button 
                onClick={() => router.push(`/checkout?id=${product._id}`)}
                className="w-full md:w-auto px-12 py-4 bg-[#FF5E00] text-white rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-orange-500/10"
              >
                Buy Now
              </button>
              <p className="mt-4 text-[9px] text-gray-400 font-medium tracking-wide">
                * Shipping charges calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}