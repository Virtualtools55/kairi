"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const router = useRouter();

  // Fetch Products
  useEffect(() => {
    fetch("/api/fetchProducts")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Add To Cart
  const handleAddToCart = async (product) => {
    setAddingId(product._id);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      // User not logged in
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      // Success
      if (res.ok) {
        alert("Added to cart! 🥭");
      } else {
        alert("Failed to add product.");
      }
    } catch (err) {
      console.error("Cart Error:", err);
      alert("Something went wrong!");
    } finally {
      setAddingId(null);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="text-center py-20 font-bold text-[#FF5E00] animate-pulse">
        Fetching Fresh Harvest...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white p-5 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group"
        >
          {/* Product Image */}
          <div className="relative h-60 rounded-[25px] overflow-hidden bg-[#F9F8F3]">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Product Details */}
          <div className="mt-5 space-y-2">
            <h3 className="font-extrabold text-xl text-[#1A2B48] truncate">
              {product.title}
            </h3>

            <div className="flex gap-3 items-center">
              <span className="text-2xl font-black text-[#2D6A4F]">
                ₹{product.discountPrice || product.price}
              </span>

              {product.discountPrice > 0 && (
                <span className="text-sm text-red-500 line-through font-bold opacity-70">
                  ₹{product.price}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              {/* View Product */}
              <button
                onClick={() => router.push(`/products/${product._id}`)}
                className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#1A2B48] transition-all shadow-md shadow-black/10"
              >
                Get Fresh Mangoes
              </button>

              {/* Add To Cart */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={addingId === product._id}
                className="w-full py-4 bg-[#FFF5F0] text-[#FF5E00] rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border border-[#FF5E00]/10 hover:bg-[#FF5E00] hover:text-white transition-all flex justify-center items-center"
              >
                {addingId === product._id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

