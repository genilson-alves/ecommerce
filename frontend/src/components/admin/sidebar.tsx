"use client";

import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-deep-olive text-bone h-screen sticky top-0 flex flex-col p-6">
      <div className="mb-12">
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase">
          ecommerce
        </Link>
        <p className="text-[10px] font-bold tracking-[0.3em] text-sage uppercase mt-2">Admin Portal</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-bone text-deep-olive" 
                  : "hover:bg-bone/10 text-bone/60 hover:text-bone"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button className="flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest text-bone/40 hover:text-sulfur transition-colors mt-auto border-t border-sage/20 pt-6">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};
