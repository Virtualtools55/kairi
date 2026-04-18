"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        // Professional decision: Context ya Cookies ka use karein, 
        // par aapka logic localStorage hai toh wahi rakha hai.
        localStorage.setItem('token', data.token);
        router.push('/'); 
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong while entering the orchard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col md:flex-row font-sans">
      
      {/* Left Side: High-Energy Branding */}
      <div className="hidden md:flex md:w-[45%] bg-[#FF5E00] items-center justify-center p-16 sticky top-0 h-screen shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-sm">
          <h1 className="text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8 drop-shadow-2xl">
            Hungry <br /> For <br /> Sweet?
          </h1>
          <p className="text-white text-xl font-bold leading-relaxed opacity-95 border-l-4 border-white pl-6">
            Log in to access your private harvest and get the freshest mangoes delivered home.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-[#FFF9F0]">
        <div className="w-full max-w-[480px]">
          
          {/* Header */}
          <div className="mb-12">
            <div className="md:hidden text-4xl font-black text-[#FF5E00] mb-8">Kairi.</div>
            <h2 className="text-5xl font-black text-[#2B1B12] tracking-tighter mb-4">Welcome back!</h2>
            <p className="text-[#2B1B12]/60 text-lg font-medium">Your basket is waiting to be filled.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-[#2B1B12] uppercase tracking-[0.2em] ml-1">Member Email</label>
              <input 
                type="email" 
                placeholder="ankit@example.com"
                className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF5E00] focus:ring-8 focus:ring-[#FF5E00]/10 outline-none transition-all text-lg font-medium shadow-sm text-[#2B1B12]"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-[#2B1B12] uppercase tracking-[0.2em]">Secret Key</label>
                
                {/* Forgot Password Link Integrated Here */}
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs font-bold text-[#FF5E00] hover:underline transition-all decoration-2 underline-offset-4"
                >
                  Forgot?
                </Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF5E00] focus:ring-8 focus:ring-[#FF5E00]/10 outline-none transition-all text-lg font-medium shadow-sm text-[#2B1B12]"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {/* Action Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black py-5 rounded-2xl shadow-2xl shadow-[#2D6A4F]/30 transition-all active:scale-[0.96] text-xl mt-4 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Verifying...
                </>
              ) : 'Enter the Orchard'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-16 pt-10 border-t-2 border-[#F2E8CF] text-center">
            <p className="text-[#2B1B12]/70 text-lg font-medium">
              New to Kairi.in? 
              <Link href="/auth/signup" className="text-[#FF5E00] font-black hover:scale-105 inline-block transition-transform ml-2">
                Join the Family
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}