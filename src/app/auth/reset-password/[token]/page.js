"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useParams(); // params object lein
  const token = params?.token; // safe access
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Debugging: Screen load hote hi dekhein token mil raha hai ya nahi
  useEffect(() => {
    console.log("Current Token from URL:", token);
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    
    // Check karein token missing toh nahi
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
          token: decodeURIComponent(token), // Kabhi kabhi special characters encoding zaroori hoti hai
          password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully!");
        router.push("/auth/login");
      } else {
        // Backend se aane wala exact error message dikhayein
        alert(data.message || "Link expired or invalid.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            autoComplete="new-password"
            className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#FF5E00] outline-none text-[#2B1B12] font-bold"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-[#FF5E00] text-white font-black py-5 rounded-2xl shadow-lg disabled:opacity-50"
          >
            {loading ? "RESETTING..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
}