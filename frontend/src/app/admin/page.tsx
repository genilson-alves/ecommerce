"use client";

import { AdminLayout, StatsCard } from "@/components/admin/layout";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-12">
        <header className="border-b border-sage pb-12 flex justify-between items-end">
          <div>
            <h1 className="text-8xl font-black uppercase tracking-tighter italic leading-none">DASHBOARD</h1>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-sage mt-4">System Overview</p>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-clay italic">Updated: FEB 23, 2026</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="TOTAL REVENUE" 
            value="$42,850" 
            label="+12% FROM LAST MONTH"
            icon={<DollarSign size={24} />}
          />
          <StatsCard 
            title="ACTIVE ORDERS" 
            value="156" 
            label="12 PENDING SHIPMENT"
            icon={<ShoppingCart size={24} />}
          />
          <StatsCard 
            title="INVENTORY ITEMS" 
            value="1,204" 
            label="4 LOW STOCK ALERTS"
            icon={<Package size={24} />}
          />
          <StatsCard 
            title="CONVERSION RATE" 
            value="3.2%" 
            label="+0.5% FROM YESTERDAY"
            icon={<TrendingUp size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-bone border border-sage p-12">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-8 border-b border-sage pb-4">RECENT ACTIVITY</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center text-xs font-bold uppercase tracking-widest border-b border-sage/20 pb-4">
                  <div className="flex gap-4 items-center">
                    <span className="text-sage italic">0{i}.</span>
                    <span>NEW ORDER #230{i} RECEIVED</span>
                  </div>
                  <span className="text-clay">12m ago</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-deep-olive text-bone p-12">
             <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-8 border-b border-sage/20 pb-4">SYSTEM NOTICES</h3>
             <div className="p-8 border-2 border-dashed border-sage/30 bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">
                  Scheduled database maintenance for 02:00 UTC. 
                  Expect intermittent connectivity. Inventory sync disabled.
                </p>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
