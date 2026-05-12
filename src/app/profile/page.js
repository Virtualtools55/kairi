"use client";
import { useEffect, useState } from "react";
import { User, Mail, Package, LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; // बेहतर नेविगेशन के लिए
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. लॉगआउट फंक्शन
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout");
    if (res.ok) {
      // कुकी हटने के बाद सीधे लॉगिन पेज पर भेजें
      router.push("/");
    }
  };

  // 2. प्रोफाइल डेटा फेच करना
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile"); // कुकीज़ अपने आप जाएँगी

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          // अगर यूजर लॉगआउट है या टोकन नहीं है (401 Unauthorized)
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading)
    return (
      <div className="text-center py-20 text-orange-600 font-bold">
        Loading...
      </div>
    );

  // अगर यूजर नहीं है, तो कुछ रेंडर न करें (रिडायरेक्ट होने तक)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center text-white">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center border-2 border-white/50 mb-4">
            <span className="text-3xl font-bold uppercase">
              {user?.name ? user.name[0] : "?"}
            </span>
          </div>
          <h1 className="text-xl font-bold italic">Welcome to Kairi.in</h1>
        </div>

        {/* Details Container */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <User className="text-orange-500" size={20} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                Full Name
              </p>
              <p className="text-gray-800 font-medium">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <Mail className="text-orange-500" size={20} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                Email Address
              </p>
              <p className="text-gray-800 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link
              href="/orders"
              className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm font-medium"
            >
              <Package size={18} />
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all text-sm font-medium"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
