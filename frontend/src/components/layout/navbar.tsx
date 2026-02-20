import React from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { CartDrawer } from "./cart-drawer";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-bone border-b border-sage">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter">
          ECOMMERCE
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-widest uppercase">
          <Link href="/shop" className="hover:text-sage transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-sage transition-colors">About</Link>
          <Link href="/journal" className="hover:text-sage transition-colors">Journal</Link>
        </div>

        <div className="flex items-center gap-6">
          <button className="hover:text-sage transition-colors"><Search size={20} /></button>
          <CartDrawer />
          <button className="md:hidden"><Menu size={20} /></button>
        </div>
      </div>
    </nav>
  );
};
