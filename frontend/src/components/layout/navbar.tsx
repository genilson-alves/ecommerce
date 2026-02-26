"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, Search, User, X, LogOut, UserCircle, ShoppingBag, LayoutDashboard, Sun, Moon } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
      logout();
      toast.success("LOGGED OUT SUCCESSFULLY");
      router.push("/");
    } catch (error) {
      toast.error("LOGOUT FAILED");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?name=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-bone border-b border-sage h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter hover:scale-[0.98] transition-transform uppercase">
          ecommerce
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.3em] uppercase text-sage">
          <Link href="/shop" className="hover:text-deep-olive transition-colors hover-underline">Shop</Link>
          <Link href="/about" className="hover:text-deep-olive transition-colors hover-underline">About</Link>
          <Link href="/journal" className="hover:text-deep-olive transition-colors hover-underline">Journal</Link>
        </div>

        <div className="flex items-center gap-1">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            transition={iconTransition}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2.5 text-deep-olive hover:bg-clay transition-all rounded-full flex items-center justify-center"
          >
            {isSearchOpen ? <X size={18} /> : <Search size={18} />}
          </motion.button>
          
          <div className="flex items-center">
            <CartDrawer />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            transition={iconTransition}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 text-deep-olive hover:bg-clay transition-all rounded-full flex items-center justify-center"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <div className="h-4 w-px bg-sage mx-2" />

          {user ? (
            <div className="flex items-center group relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                transition={iconTransition}
                className="p-2.5 text-deep-olive hover:bg-clay transition-all rounded-full flex items-center justify-center"
              >
                <User size={18} />
              </motion.button>
              
              <div className="absolute top-full right-0 mt-2 w-56 bg-bone border border-sage opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                <div className="p-5 border-b border-sage bg-clay/30">
                  <p className="text-[9px] font-black text-deep-olive uppercase tracking-[0.2em] truncate opacity-50">{user.email}</p>
                </div>
                <Link href="/profile" className="flex items-center gap-3 px-5 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-clay transition-colors">
                  <UserCircle size={14} /> Profile
                </Link>
                <Link href="/user/orders" className="flex items-center gap-3 px-5 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-clay transition-colors border-t border-sage/50">
                  <ShoppingBag size={14} /> My Orders
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-3 px-5 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-clay transition-colors border-t border-sage/50">
                    <LayoutDashboard size={14} /> Admin Panel
                  </Link>
                )}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  transition={iconTransition}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-t border-sage/50"
                >
                  <LogOut size={14} /> Logout Session
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-2">
              <Link 
                href="/login" 
                className="text-[10px] font-bold uppercase tracking-widest text-deep-olive hover:text-sulfur transition-colors"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} transition={iconTransition}>
                <Link 
                  href="/register" 
                  className="text-[10px] font-bold uppercase tracking-widest bg-deep-olive text-bone px-6 py-3 hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 block"
                >
                  Register
                </Link>
              </motion.div>
            </div>
          )}
          
          <button className="md:hidden p-2.5 text-deep-olive hover:bg-clay rounded-full flex items-center justify-center"><Menu size={18} /></button>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            ref={searchRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-20 left-0 w-full overflow-hidden bg-bone border-b border-sage z-40 shadow-2xl"
          >
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-6 py-12">
              <input 
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="TYPE TO SEARCH..."
                className="w-full bg-transparent text-5xl md:text-8xl font-black uppercase tracking-tighter placeholder:text-sage focus:outline-none"
              />
              <p className="text-[10px] font-bold text-sage uppercase tracking-[0.5em] mt-8 flex items-center gap-4">
                <span className="w-12 h-px bg-sage" /> INITIALIZING SEARCH PROTOCOL
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
