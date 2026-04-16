import Link from 'next/link';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  return (
    <>
      Top Header - Desktop and Mobile both
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          
          {/* Logo: Mobile में center और Desktop में left */}
          <div className="text-2xl font-bold text-orange-600 tracking-tight w-full text-center md:text-left md:w-auto">
            Kairi.in<span className="text-gray-800"></span>
          </div>
          
          {/* Desktop Links - Mobile में hidden रहेंगे */}
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Products</Link>
            <Link href="/cart" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Cart</Link>
            <Link href="/login" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Login</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom (As per your design)  */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-500">
            <Home size={22} />
            <span className="text-[10px] font-medium uppercase">Home</span>
          </Link>

          <Link href="/products" className="flex flex-col items-center gap-1 text-gray-500">
            <ShoppingBag size={22} />
            <span className="text-[10px] font-medium uppercase">Products</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-500">
            <ShoppingCart size={22} />
            <span className="text-[10px] font-medium uppercase">Cart</span>
          </Link>

          <Link href="/login" className="flex flex-col items-center gap-1 text-gray-500">
            <User size={22} />
            <span className="text-[10px] font-medium uppercase">Login</span>
          </Link>

        </div>
      </nav>

      {/* Spacer to prevent content overlap [cite: 83] */}
      <div className="h-20"></div> 
    </>
  );
};

export default Navbar;