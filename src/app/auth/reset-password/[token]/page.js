"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();

  // States
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // BUILD FIX: Safe tracking jo build time server hydration ko crash hone se bachaaye
  useEffect(() => {
    setMounted(true);
    if (params?.token) {
      setToken(params.token);
    }
  }, [params]);

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert("Token is missing in the URL!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: decodeURIComponent(token), 
          password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully!");
        router.push("/auth/login");
      } else {
        alert(data.message || "Link expired or invalid.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Jab tak component browser par fully mount nahi hota, tab tak loader dikhao (static generator pass bypass rule)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#FF5E00]/20 border-t-[#FF5E00] rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifying Route...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-6 selection:bg-[#FF5E00] selection:text-white">
      <div className="w-full max-w-[400px] bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-[#2B1B12] mb-6 tracking-tighter text-center">New Password</h2>
        <form onSubmit={handleReset} className="space-y-6">
          <input 
            type="password" 
            required 
            placeholder="Enter new password"
            autoComplete="new-password"
            className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#FF5E00] outline-none text-[#2B1B12] font-bold transition-all"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-[#FF5E00] text-white font-black py-5 rounded-2xl shadow-lg disabled:opacity-50 hover:bg-[#2B1B12] transition-colors duration-300 cursor-pointer"
          >
            {loading ? "RESETTING..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
}