"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Admin Created! Redirecting to login...");
        setTimeout(() => router.push("/admin/login"), 2000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Connection Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6">
      {/* Subtle Organic Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#FF9100]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#2E7D32]/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md bg-white border border-[#E5E7EB] p-10 rounded-2xl shadow-sm">
        
        {/* Brand Logo / Identity */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-[#2E7D32] tracking-tight mb-2">
            Kairi<span className="text-[#FF9100]">.in</span>
          </h2>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
            Admin Creation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Work Email</label>
            <input
              type="email"
              required
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] p-3.5 text-gray-900 focus:border-[#FF9100] focus:ring-1 focus:ring-[#FF9100] outline-none transition-all rounded-xl placeholder:text-gray-400"
              placeholder="name@kairi.in"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] p-3.5 text-gray-900 focus:border-[#FF9100] focus:ring-1 focus:ring-[#FF9100] outline-none transition-all rounded-xl"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Master Secret Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Master Access Key</label>
            <input
              type="password"
              required
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] p-3.5 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all rounded-xl"
              placeholder="Enter Master Secret"
              onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
            />
          </div>

          {message && (
            <div className={`text-sm p-4 rounded-xl text-center font-medium ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] text-white font-bold py-4 rounded-xl transition-all hover:bg-[#1B5E20] hover:shadow-lg active:scale-[0.98] mt-4"
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Premium Quality Control
          </p>
        </div>
      </div>
    </div>
  );
}