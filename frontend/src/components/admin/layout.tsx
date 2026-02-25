"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { AdminSidebar } from "./sidebar";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, user } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // If user is not admin, redirect to login
    if (!isAdmin()) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [isAdmin, router]);

  if (!authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bone text-deep-olive">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-sage" size={48} />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-sage">Authenticating Admin Session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-bone min-h-screen text-deep-olive">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto pt-32">
        {children}
      </main>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon?: React.ReactNode;
}

export const StatsCard = ({ title, value, label, icon }: StatsCardProps) => {
  return (
    <div className="bg-bone border border-sage p-8 relative overflow-hidden group hover:border-deep-olive transition-colors">
      <div className="flex justify-between items-start mb-6">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">{title}</h4>
        <div className="text-sage group-hover:text-deep-olive transition-colors">{icon}</div>
      </div>
      
      <div className="flex items-baseline gap-4 mb-4">
        <span className="text-6xl font-black tracking-tighter leading-none bg-sulfur px-4 py-2 -ml-4">
          {value}
        </span>
      </div>

      {label && <p className="text-[10px] font-bold uppercase tracking-widest text-clay">{label}</p>}
      
      {/* Decorative lines - Brutalist style */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-sage group-hover:border-deep-olive" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-sage group-hover:border-deep-olive" />
    </div>
  );
};
