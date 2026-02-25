"use client";

import { useAuthStore } from "@/lib/auth-store";
import { UserCircle, Package, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <Link 
        href="/" 
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sage hover:text-deep-olive transition-colors mb-12 group w-fit"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
        <div className="md:col-span-4 space-y-8">
          <div className="aspect-square bg-clay/20 border border-sage flex items-center justify-center">
            <UserCircle size={120} className="text-sage opacity-20" strokeWidth={1} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{user.email.split('@')[0]}</h1>
            <p className="text-[10px] font-bold text-sage uppercase tracking-[0.4em]">{user.role} ACCOUNT</p>
          </div>
        </div>

        <div className="md:col-span-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-sage border border-sage">
              <Link href="/user/orders" className="bg-bone p-10 group cursor-pointer transition-colors hover:bg-sulfur/10 block">
                 <Package size={24} className="mb-6 text-sage group-hover:text-deep-olive transition-colors" />
                 <h3 className="text-xl font-black uppercase tracking-tighter mb-2">My Orders</h3>
                 <p className="text-[10px] font-bold text-sage uppercase tracking-widest">View tracking and history</p>
              </Link>
              <div className="bg-bone p-10 group cursor-pointer transition-colors hover:bg-sulfur/10">
                 <Settings size={24} className="mb-6 text-sage group-hover:text-deep-olive transition-colors" />
                 <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Settings</h3>
                 <p className="text-[10px] font-bold text-sage uppercase tracking-widest">Update identification keys</p>
              </div>
           </div>
           
           <div className="mt-20 p-20 border border-dashed border-sage text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-sage italic">
                Secure profile interface under development. <br/> Further modules will be synchronized shortly.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
