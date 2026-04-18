"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, CheckCircle, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: "", type: "" });

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setStatus({ text: "Password updated! Redirecting to login...", type: "success" });
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        const data = await res.json();
        setStatus({ text: data.error || "Reset failed", type: "error" });
      }
    } catch (err) {
      setStatus({ text: "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-green-600" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">New Password</h2>
          <p className="text-gray-500 mt-2 text-sm">Ek naya aur mazboot password choose karein.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </button>
        </form>

        {status.text && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2 ${
            status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}>
            {status.type === "success" && <CheckCircle size={16} />}
            {status.text}
          </div>
        )}
      </div>
    </div>
  );
}