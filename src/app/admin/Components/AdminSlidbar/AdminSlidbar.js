"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const getLinkClass = (href) => {
    const isActive = pathname === href;
    return `flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
      isActive 
      ? "bg-[#2D5F47] text-white shadow-lg translate-x-2" 
      : "hover:bg-white/10 text-white"
    }`;
  };

  return (
    <aside className="w-80 bg-[#FF5C00] text-white flex flex-col h-screen sticky top-0 shadow-2xl z-50">
      <div className="p-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none">
          KAIRI<span className="text-white opacity-80 italic">.IN</span>
        </h1>
        <div className="h-1 w-12 bg-white mt-4"></div>
      </div>

      <nav className="flex-1 px-6">
        <ul className="space-y-3">
          <li>
            <Link href="/admin/products" className={getLinkClass('/admin/products')}>
              <span className="text-2xl">📦</span>
              <span className="uppercase tracking-wider text-sm">Upload Product</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
              <span className="text-2xl">📊</span>
              <span className="uppercase tracking-wider text-sm">Dashboard</span>
            </Link>
          </li>
          {/* अन्य लिंक्स भी इसी तरह डालें */}
        </ul>
      </nav>

      <div className="p-10 border-t border-white/10">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/60">
          Private Harvest Access
        </p>
      </div>
    </aside>
  );
}