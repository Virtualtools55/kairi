"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) window.location.href = "/";
    else alert(data.message);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col md:flex-row font-sans">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-[45%] bg-[#FF5E00] items-center justify-center p-16 sticky top-0 h-screen">
        <div className="max-w-sm">
          <h1 className="text-8xl font-black text-white leading-[0.85] tracking-tighter mb-10">Welcome <br/> Back.</h1>
          <p className="text-white text-xl font-bold border-l-4 pl-4">Login to access your premium mango harvest.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-[440px]">
          <h2 className="text-5xl font-black text-[#2B1B12] tracking-tighter mb-10">Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-[#2B1B12] uppercase tracking-[0.2em] ml-1">Gmail Address</label>
              <input 
                type="email" required placeholder="ankit@gmail.com"
                className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF5E00] focus:ring-8 focus:ring-[#FF5E00]/5 outline-none text-lg font-bold text-[#2B1B12] shadow-sm placeholder:text-[#2B1B12]/20"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black text-[#2B1B12] uppercase tracking-[0.2em]">Password</label>
                <Link href="/auth/forgot-password" size="sm" className="text-[11px] font-black text-[#FF5E00] uppercase tracking-[0.1em] hover:underline">Forgot?</Link>
              </div>
              <input 
                type="password" required placeholder="••••••••"
                className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF5E00] focus:ring-8 focus:ring-[#FF5E00]/5 outline-none text-lg font-bold text-[#2B1B12] shadow-sm"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button disabled={loading} className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.97] text-xl mt-4">
              {loading ? 'VERIFYING...' : 'Login to Orchard'}
            </button>
          </form>

          <p className="mt-12 text-center text-[#2B1B12]/70 text-lg font-bold">
            New here? <Link href="/auth/signup" className="text-[#FF5E00] font-black hover:underline ml-1">Join the community</Link>
          </p>
        </div>
      </div>
    </div>
  );
}