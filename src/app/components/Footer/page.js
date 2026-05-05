"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [showNumber, setShowNumber] = useState(false);
  const phoneNumber = "+91 9876543210"; // Apna real number yahan dalein

  // Desktop par number hide karne ka timer
  useEffect(() => {
    let timer;
    if (showNumber) {
      timer = setTimeout(() => setShowNumber(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showNumber]);

  const handlePhoneClick = (e) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      e.preventDefault();
      setShowNumber(true);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand Section */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-2xl font-black tracking-tighter text-[#1A2B48]">
              KAIRI<span className="text-[#FF5E00]">.</span>IN
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Bringing the finest, naturally ripened handpicked mangoes directly from our orchards to your doorstep.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-[#1A2B48] font-bold uppercase tracking-widest text-[10px] mb-6">Explore</h4>
            <ul className="flex flex-col gap-4">
              {['All Mangoes', 'Seasonal Boxes', 'Our Story'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 hover:text-[#FF5E00] text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Customer Service Section (Custom Logic Here) */}
          <div>
            <h4 className="text-[#1A2B48] font-bold uppercase tracking-widest text-[10px] mb-6">Support</h4>
            <div className="flex flex-col gap-4">
              <Link href="#" className="text-gray-500 hover:text-[#FF5E00] text-sm">Track Order</Link>
              
              {/* Dynamic Phone Button */}
              <div className="mt-2">
                <button 
                  onClick={handlePhoneClick}
                  className={`flex items-center gap-3 transition-all duration-500 group ${
                    showNumber ? "text-[#FF5E00]" : "text-gray-500 hover:text-black"
                  }`}
                >
                  <div className={`p-2.5 rounded-full transition-all duration-300 ${
                    showNumber ? "bg-[#FF5E00] text-white" : "bg-gray-50 group-hover:bg-black group-hover:text-white"
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      {showNumber ? "Call us now" : "Customer Care"}
                    </span>
                    <span className={`text-sm font-black transition-all duration-300 ${
                      showNumber ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
                    }`}>
                      {phoneNumber}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Newsletter */}
          <div className="bg-[#FCF9F2] p-6 rounded-[32px]">
            <h4 className="text-[#1A2B48] font-bold text-sm mb-2">Join the Harvest</h4>
            <form className="flex flex-col gap-2 mt-4">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-white border-none rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#FF5E00]"
              />
              <button className="bg-black text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF5E00] transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <p>© 2026 KAIRI.IN. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-black">Privacy</Link>
            <Link href="#" className="hover:text-black">Terms</Link>
          </div>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;