"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react"; // npm install lucide-react agar nahi hai

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("id");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 5 second ka countdown aur phir redirect
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 antialiased">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#2D6A4F]/10 blur-2xl rounded-full animate-pulse"></div>
            <CheckCircle2 size={100} className="text-[#2D6A4F] relative animate-in zoom-in duration-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-[#FF5E00] uppercase tracking-[0.3em]">Order Confirmed</p>
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight">
            Harvest is on its way<span className="text-[#FF5E00]">.</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Aapka premium mango order pack ho raha hai. Payment successful rahi aur jald hi aap tak pahunchegi.
          </p>
        </div>

        {/* Payment ID Badge */}
        {paymentId && (
          <div className="inline-block px-4 py-2 bg-gray-50 border border-gray-100 rounded-full">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Payment ID: <span className="text-gray-800">{paymentId}</span>
            </p>
          </div>
        )}

        <div className="pt-10">
          <div className="h-[1px] w-full bg-gray-100 relative">
            {/* Progress Bar Animation */}
            <div 
              className="absolute left-0 top-0 h-full bg-[#FF5E00] transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            ></div>
          </div>
          <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Redirecting to Home in {countdown}s...
          </p>
        </div>

        {/* Manual Home Button */}
        <button 
          onClick={() => router.push("/")}
          className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a] hover:text-[#FF5E00] transition-colors"
        >
          Go Home Now →
        </button>

      </div>
    </div>
  );
}