"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '', pincode: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.email.endsWith("@gmail.com")) return alert("Please use a @gmail.com address.");
    setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setLoading(false);
    if (res.ok) setStep(2);
    else alert((await res.json()).message);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Registration Successful! Now you can Login.");
        router.push('/auth/login'); 
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Verification Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col md:flex-row font-sans selection:bg-[#FF5E00] selection:text-white">
      
      {/* LEFT PANEL: Pure Branding */}
      <div className="hidden md:flex md:w-[45%] bg-[#FF5E00] items-center justify-center p-16 sticky top-0 h-screen overflow-hidden">
        <div className="max-w-sm relative z-10">
          <h1 className="text-8xl font-black text-white leading-[0.85] tracking-tighter mb-10 drop-shadow-2xl">
            Pure <br /> Village <br /> Gold.
          </h1>
          <div className="flex gap-4 items-start">
            <div className="w-1.5 h-24 bg-white rounded-full mt-2" />
            <p className="text-white text-xl font-bold leading-tight opacity-90">
              Join the exclusive community of mango lovers and get early access to the harvest.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* RIGHT PANEL: The Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-[#FFF9F0]">
        <div className="w-full max-w-[480px]">
          
          <div className="mb-10">
            <div className="md:hidden text-4xl font-black text-[#FF5E00] mb-8">Kairi.</div>
            <h2 className="text-5xl font-black text-[#2B1B12] tracking-tighter mb-3">
              {step === 1 ? "Get Started" : "Verify Gmail"}
            </h2>
            <p className="text-[#2B1B12]/60 text-lg font-bold">
              {step === 1 ? "Create your account for fresh deliveries." : `6-digit code sent to ${formData.email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSignup} className="space-y-6">
              <InputField label="Your Name" type="text" placeholder="Ankit Kumar" onChange={(v) => setFormData({...formData, name: v})} />
              <InputField label="Gmail Address" type="email" placeholder="ankit@gmail.com" onChange={(v) => setFormData({...formData, email: v})} />
              <InputField label="Secure Password" type="password" placeholder="••••••••" onChange={(v) => setFormData({...formData, password: v})} />

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Phone" type="text" placeholder="+91..." onChange={(v) => setFormData({...formData, phone: v})} />
                <InputField label="Pincode" type="text" placeholder="480881" onChange={(v) => setFormData({...formData, pincode: v})} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black text-[#2B1B12] uppercase tracking-[0.2em] ml-1">Full Delivery Address</label>
                <textarea 
                  required
                  placeholder="kurai seoni madhya pradesh"
                  className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF5E00] focus:ring-8 focus:ring-[#FF5E00]/5 outline-none transition-all text-lg font-bold text-[#2B1B12] shadow-sm placeholder:text-[#2B1B12]/30 min-h-[120px]"
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <button disabled={loading} className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#2D6A4F]/20 transition-all active:scale-[0.97] text-xl mt-4 disabled:opacity-70">
                {loading ? 'PLANTING...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
             <OTPForm 
               otp={otp} 
               setOtp={setOtp} 
               handleVerify={handleVerify} 
               loading={loading} 
             />
          )}

          <div className="mt-12 pt-8 border-t-2 border-[#2B1B12]/5 text-center">
            <p className="text-[#2B1B12]/70 text-lg font-bold">
              Already a member? <Link href="/auth/login" className="text-[#FF5E00] font-black hover:underline ml-1 transition-all">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type, placeholder, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-black text-[#2B1B12] uppercase tracking-[0.2em] ml-1">{label}</label>
      <input 
        required
        type={type} 
        placeholder={placeholder}
        className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF5E00] focus:ring-8 focus:ring-[#FF5E00]/5 outline-none transition-all text-lg font-bold text-[#2B1B12] shadow-sm placeholder:text-[#2B1B12]/30"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// Fixed OTPForm Component
function OTPForm({ otp, setOtp, handleVerify, loading }) {
    return (
        <form onSubmit={handleVerify} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
                <input 
                  type="text" 
                  maxLength="6" 
                  value={otp}
                  required
                  placeholder="000000" 
                  className="w-full bg-white border-4 border-[#FF5E00] rounded-3xl py-6 text-center text-5xl font-black tracking-[0.4em] text-[#FF5E00] outline-none shadow-2xl" 
                  onChange={(e) => setOtp(e.target.value)}
                />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5E00] text-white font-black py-5 rounded-2xl text-xl shadow-lg shadow-[#FF5E00]/30 hover:scale-[1.02] transition-transform disabled:opacity-70"
            >
                {loading ? 'VERIFYING...' : 'Complete Registration'}
            </button>
        </form>
    );
}