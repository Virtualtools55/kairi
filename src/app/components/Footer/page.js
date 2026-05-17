"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [showNumber, setShowNumber] = useState(false);
  const phoneNumber = "+91 9876543210"; 

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
    <li>
      <Link href="/refund-policy" className="text-gray-500 hover:text-[#FF5E00] text-sm transition-colors">
        Refund Policy
      </Link>
    </li>
    <li>
      <Link href="/about" className="text-gray-500 hover:text-[#FF5E00] text-sm transition-colors">
        About
      </Link>
    </li>
    <li>
      <Link href="/contact" className="text-gray-500 hover:text-[#FF5E00] text-sm transition-colors">
        Contact Us
      </Link>
    </li>
  </ul>
</div>

          {/* 3. Support Section */}
          <div>
            <h4 className="text-[#1A2B48] font-bold uppercase tracking-widest text-[10px] mb-6">Support</h4>
            <div className="flex flex-col gap-4">
              <Link href="#" className="text-gray-500 hover:text-[#FF5E00] text-sm">Track Order</Link>
              
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
                  
                  <div className="flex flex-col items-start text-left">
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

          {/* 4. Social Media Section */}
          <div>
            <h4 className="text-[#1A2B48] font-bold uppercase tracking-widest text-[10px] mb-6">Follow Our Journey</h4>
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="#" className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#E4405F] hover:bg-[#E4405F]/10 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* X (Twitter) */}
              <a href="#" className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href="#" className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#FF0000] hover:bg-[#FF0000]/10 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            <p className="mt-4 text-[10px] text-gray-400 font-medium">Follow us for fresh orchard updates!</p>
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