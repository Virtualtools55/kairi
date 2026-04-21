"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { token } = useParams(); // URL se hex string nikalega
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }), // Yahan wahi hex token ja raha hai
    });

    if (res.ok) {
      alert("Password changed successfully!");
      router.push("/auth/login");
    } else {
      alert("Link expired or invalid.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-black text-[#2B1B12] mb-6 tracking-tighter text-center">New Password</h2>
        <form onSubmit={handleReset} className="space-y-6">
          <input 
            type="password" 
            required 
            placeholder="Enter new password"
            className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#FF5E00] outline-none text-[#2B1B12] font-bold"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button disabled={loading} className="w-full bg-[#FF5E00] text-white font-black py-5 rounded-2xl shadow-lg">
            {loading ? "RESETTING..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
}