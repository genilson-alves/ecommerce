"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Search, User, X, LogOut, UserCircle } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
      logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?name=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-bone border-b border-sage transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter hover:scale-[0.98] transition-transform">
          ECOMMERCE
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-widest uppercase">
          <Link href="/shop" className="hover:text-sage transition-colors relative group">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-sage transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="hover:text-sage transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-sage transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/journal" className="hover:text-sage transition-colors relative group">
            Journal
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-sage transition-all group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hover:text-sage transition-all hover:scale-110 active:scale-95"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          
          <CartDrawer />

          <div className="h-4 w-px bg-sage/30 hidden sm:block" />

          {user ? (
            <div className="flex items-center gap-4 group relative">
              <button className="flex items-center gap-2 hover:text-sage transition-colors">
                <User size={20} />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-bone border border-sage opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-sage bg-clay/10">
                  <p className="text-[10px] font-bold text-sage uppercase tracking-widest truncate">{user.email}</p>
                </div>
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-clay/20 transition-colors">
                  <UserCircle size={14} /> Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-clay/20 transition-colors border-t border-sage/10">
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-t border-sage/10"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-[10px] font-bold uppercase tracking-widest hover:text-sage transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="text-[10px] font-bold uppercase tracking-widest bg-deep-olive text-bone px-4 py-2 hover:scale-95 transition-transform"
              >
                Register
              </Link>
            </div>
          )}
          
          <button className="md:hidden hover:text-sage transition-colors"><Menu size={20} /></button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-bone border-b border-sage"
          >
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-6 py-8">
              <input 
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full bg-transparent text-4xl md:text-6xl font-black focus:outline-none"
              />
              <p className="text-[10px] font-bold text-sage uppercase tracking-[0.4em] mt-4">Press enter to search the database</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
