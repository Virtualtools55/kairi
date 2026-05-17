"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// 1. Ek alag Content Component banaya jisme searchParams aur countdown ka logic hai
function PaymentSuccessContent() {
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
    <div className="max-w-md w-full text-center space-y-8">
      
      {/* Animated Success Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[#23533E]/10 blur-2xl rounded-full animate-pulse"></div>
          <CheckCircle2 size={100} className="text-[#23533E] relative animate-in zoom-in duration-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-[#FF5E00] uppercase tracking-[0.3em]">Order Confirmed</p>
        <h1 className="text-4xl font-black text-[#23533E] tracking-tight">
          Harvest is on its way<span className="text-[#FF5E00]">.</span>
        </h1>
        <p className="text-slate-800 text-sm font-normal leading-relaxed">
          Aapka premium mango order pack ho raha hai. Payment successful rahi aur jald hi aap tak pahunchegi.
        </p>
      </div>

      {/* Payment ID Badge - High Contrast text colors fixed */}
      {paymentId && (
        <div className="inline-block px-5 py-2 bg-white border border-[#EFE9DD] rounded-full shadow-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Payment ID: <span className="text-slate-950 font-mono font-bold">{paymentId}</span>
          </p>
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="pt-6">
        <div className="h-[2px] w-full bg-[#EFE9DD] relative rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-[#FF5E00] transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 5) * 100}%` }}
          ></div>
        </div>
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Redirecting to Home in {countdown}s...
        </p>
      </div>

      {/* Manual Home Button */}
      <div className="pt-2">
        <button 
          onClick={() => router.push("/")}
          className="text-[11px] font-black uppercase tracking-[0.2em] text-[#23533E] hover:text-[#FF5E00] transition-colors cursor-pointer"
        >
          Go Home Now →
        </button>
      </div>

    </div>
  );
}

// 2. Main Export Page - Jo loader fallback ke sath content ko Suspense me wrap karega
export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#23533E] flex items-center justify-center px-6 antialiased selection:bg-[#FF5E00] selection:text-white">
      <Suspense fallback={
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#23533E]/20 border-t-[#23533E] rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Confirmation...</p>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}