"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, ShoppingCart, User, UserCircle } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 1. नई अप्रोच: प्रोफाइल API को कॉल करके चेक करें कि यूजर लॉग इन है या नहीं
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (!mounted) return null;

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <div className="text-2xl font-bold text-orange-600 tracking-tight w-full text-center md:text-left md:w-auto">
            Kairi.in
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Products</Link>
            <Link href="/cart" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Cart</Link>
            
            {isLoggedIn ? (
              <Link href="/profile" className="flex items-center gap-1 text-orange-600 font-medium">
                <UserCircle size={20} /> Profile
              </Link>
            ) : (
              <Link href="/auth/signup" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm">
               SignUp
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-500">
            <Home size={22} />
            <span className="text-[10px] font-medium uppercase">Home</span>
          </Link>

          <Link href="/products" className="flex flex-col items-center gap-1 text-gray-500">
            <ShoppingBag size={22} />
            <span className="text-[10px] font-medium uppercase">Shop</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-500">
            <ShoppingCart size={22} />
            <span className="text-[10px] font-medium uppercase">Cart</span>
          </Link>

          {/* Logic Fix: Agar logged in hai toh Profile dikhao, warna SignUp */}
          {isLoggedIn ? (
            <Link href="/profile" className="flex flex-col items-center gap-1 text-orange-600">
              <UserCircle size={22} />
              <span className="text-[10px] font-medium uppercase">Profile</span>
            </Link>
          ) : (
            <Link href="/auth/signup" className="flex flex-col items-center gap-1 text-gray-500">
              <User size={22} />
              <span className="text-[10px] font-medium uppercase">SignUp</span>
            </Link>
          )}

        </div>
      </nav>

      <div className="h-20"></div> 
    </>
  );
};

export default Navbar;