"use client";

import { AdminLayout, StatsCard } from "@/components/admin/layout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DollarSign, Package, TrendingUp, Loader2, RefreshCcw } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/orders/admin/analytics`, { withCredentials: true });
      return response.data;
    }
  });

  if (isAnalyticsLoading) return <div className="h-screen flex items-center justify-center bg-bone pt-32"><Loader2 className="animate-spin text-sage" size={48} /></div>;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-16 text-deep-olive">
        <header className="border-b border-sage pb-12 flex justify-between items-end">
          <div>
            <h1 className="text-8xl font-black uppercase tracking-tighter italic leading-none">OVERVIEW</h1>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-sage mt-4">Real-time Intelligence Protocol</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="TOTAL REVENUE" 
            value={`$${analytics.totalRevenue.toLocaleString()}`} 
            label="NET GAIN (EXCL. CANCELLED)"
            icon={<DollarSign size={24} />}
          />
          <StatsCard 
            title="CONVERSION RATE" 
            value={analytics.conversionRate} 
            label="USER ACQUISITION"
            icon={<TrendingUp size={24} />}
          />
          <StatsCard 
            title="UNIQUE INVENTORY" 
            value={analytics.inventoryCount} 
            label="DISTINCT PRODUCT IDS"
            icon={<Package size={24} />}
          />
          <StatsCard 
            title="SYSTEM STATUS" 
            value="ACTIVE" 
            label="ALL SERVICES OPERATIONAL"
            icon={<RefreshCcw size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic border-b border-sage pb-6">RECENT ACTIVITY</h3>
            <div className="space-y-6">
              {analytics.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest">{activity.user.split('@')[0]}</p>
                    <p className="text-[9px] font-bold text-sage uppercase tabular-nums">{new Date(activity.time).toLocaleTimeString()}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-sulfur">${Number(activity.amount).toFixed(2)}</p>
                    <p className="text-[8px] font-bold text-sage uppercase">{activity.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
