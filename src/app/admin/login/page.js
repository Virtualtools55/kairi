"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Success: Redirect to Dashboard
        router.push('/admin');
      } else {
        alert(data.message || "Unauthorized: Admin access only.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("System error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B4332] flex items-center justify-center p-6 font-sans selection:bg-[#FF5E00] selection:text-white">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF5E00]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-[440px] bg-white rounded-[40px] p-10 md:p-14 shadow-2xl relative z-10 border border-white/20">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-[#1B4332] tracking-tighter italic">KAIRI.</h1>
          <div className="inline-block px-3 py-1 bg-[#FF5E00]/10 rounded-full mt-2">
            <p className="text-[#FF5E00] font-black uppercase tracking-[0.2em] text-[10px]">
              Admin Control Center
            </p>
          </div>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
          
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-[#1B4332]/50 uppercase tracking-[0.2em] ml-1">Admin Identity</label>
            <input 
              required
              type="email" 
              placeholder="admin@kairi.in"
              className="w-full px-6 py-5 rounded-2xl bg-[#F8F9F8] border-2 border-transparent focus:border-[#FF5E00] focus:ring-8 focus:ring-[#FF5E00]/5 outline-none transition-all text-lg font-bold text-[#1B4332] placeholder:text-[#1B4332]/20"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-[#1B4332]/50 uppercase tracking-[0.2em] ml-1">Secret Key</label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-5 rounded-2xl bg-[#F8F9F8] border-2 border-transparent focus:border-[#FF5E00] focus:ring-8 focus:ring-[#FF5E00]/5 outline-none transition-all text-lg font-bold text-[#1B4332] placeholder:text-[#1B4332]/20"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* Login Button */}
          <button 
            disabled={loading}
            className="w-full bg-[#1B4332] hover:bg-[#081C15] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#1B4332]/20 transition-all active:scale-[0.97] text-xl mt-4 disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <span>AUTHORIZING...</span>
              </>
            ) : (
              'ENTER DASHBOARD'
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[#1B4332]/40 text-sm font-bold">
            Authorized Personnel Only. <br/>
            All IP addresses are logged.
          </p>
        </div>
      </div>
    </div>
  );
}