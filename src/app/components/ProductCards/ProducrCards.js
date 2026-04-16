"use client";
import React, { useEffect, useState } from 'react';

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // API से डेटा फेच करने का लॉजिक
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // यहाँ अपनी असली API का URL डालें (जैसे: /api/products)
        const response = await fetch('/api/products'); 
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mangoes:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-10">Loading Fresh Mangoes...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Grid Logic: Mobile me 2 (grid-cols-2) aur Desktop me 5 (md:grid-cols-5) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {products.map((mango) => (
          <div 
            key={mango._id} 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col hover:shadow-md transition-shadow"
          >
            {/* 1. High-quality Product Image  */}
            <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-gray-50">
              <img 
                src={mango.image} 
                alt={mango.title} 
                className="w-full h-full object-contain p-2 hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* 2. Clear Title [cite: 113] */}
            <h3 className="text-gray-800 font-semibold text-sm md:text-base line-clamp-1">
              {mango.title}
            </h3>

            {/* 3. Psychological Pricing (Indian Rupees ₹) [cite: 114] */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-green-600 font-bold text-base">
                ₹{mango.discountPrice}
              </span>
              <span className="text-gray-400 text-xs line-through">
                ₹{mango.price}
              </span>
            </div>

            {/* 4. Action-oriented Call-To-Action (CTA) [cite: 115] */}
            <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs md:text-sm font-bold py-2.5 rounded-lg transition-colors">
              Get Fresh Mangoes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCards;