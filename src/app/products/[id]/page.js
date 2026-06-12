"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

export default function SingleProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/get-single?id=${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Product fetch failed");
          return res.json();
        })
        .then((data) => {
          // Agar backend wrap karke data bhejta hai { success: true, data: {...} }
          // Toh data.data set hoga, warna direct pure object inject hoga
          const cleanProduct = data.data ? data.data : data;
          
          if (cleanProduct && cleanProduct._id) {
            setProduct(cleanProduct);
          } else {
            setError(true);
          }
        })
        .catch((err) => {
          console.error("Fetch client error:", err);
          setError(true);
        });
    }
  }, [id]);

  const handleBuyNow = async () => {
    if (!product) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: product.discountPrice || product.price }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error("Order creation failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Kairi.in",
        description: `Fresh Harvest: ${product.title}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const saveRes = await fetch("/api/orders/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                productId: product._id,
                amount: product.discountPrice || product.price,
                productTitle: product.title
              }),
            });

            if (saveRes.ok) {
              router.push(`/payment-success?id=${response.razorpay_payment_id}`);
            } else {
              alert("Order confirmed but saving failed. Please keep your Payment ID.");
            }
          } catch (error) {
            console.error("Order Save Error:", error);
          }
        },
        prefill: {
          name: "Ankit Kumar",
          email: "ankit@gmail.com",
        },
        theme: {
          color: "#FF5E00",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed to initialize.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Error State Handler
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-2">
        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Product Not Found 🥭</p>
        <button onClick={() => router.push('/')} className="text-xs font-bold text-[#FF5E00] uppercase underline">Go Back Home</button>
      </div>
    );
  }

  // Loading State
  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-3">
        <div className="w-5 h-5 border-2 border-[#FF5E00] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Loading Harvest Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] antialiased">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Nav Section */}
      <nav className="border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button onClick={() => router.back()} className="text-[10px] font-bold uppercase tracking-widest hover:text-[#FF5E00] transition-colors cursor-pointer">
          ← Back
        </button>
        <span className="font-black text-sm tracking-tighter uppercase">Kairi<span className="text-[#FF5E00]">.</span></span>
        <div className="w-10"></div>
      </nav>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 py-8 md:py-16">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-[45%]">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              {product.imageUrl && (
                <Image src={product.imageUrl} alt={product.title || "Mango"} fill className="object-cover" priority />
              )}
            </div>
          </div>

          <div className="w-full md:w-[55%] space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#FF5E00] uppercase tracking-[0.2em]">Premium Orchard Selection</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111]">{product.title}</h1>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-md">
                {product.description || "Authentic, naturally ripened mangoes delivered straight from the farm to your doorstep."}
              </p>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              {/* Fallback check pricing UI mapping */}
              <span className="text-3xl font-bold text-[#2D6A4F]">
                ₹{product.discountPrice > 0 ? product.discountPrice : product.price}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-lg text-gray-300 line-through font-medium">₹{product.price}</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
              <div className="text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Origin</p>
                <p className="text-xs font-semibold">Organic Farm</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Delivery</p>
                <p className="text-xs font-semibold">1-2 Days</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Quality</p>
                <p className="text-xs font-semibold">Hand-Picked</p>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleBuyNow}
                disabled={isProcessing || product.isSoldOut}
                className="w-full md:w-auto px-12 py-4 bg-[#FF5E00] text-white rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-orange-500/10 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? "Processing..." : product.isSoldOut ? "Out of Stock" : "Buy Now"}
              </button>
              <p className="mt-4 text-[9px] text-gray-400 font-medium tracking-wide">* Secure checkout powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}