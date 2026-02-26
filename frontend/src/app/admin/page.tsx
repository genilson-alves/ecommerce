"use client";

import { AdminLayout, StatsCard } from "@/components/admin/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DollarSign, Package, ShoppingCart, TrendingUp, Loader2, CheckCircle, RefreshCcw, Truck, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/orders/admin/analytics`, { withCredentials: true });
      return response.data;
    }
  });

  const { data: activeOrders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["admin-active-orders"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/orders/admin/list?active=true`, { withCredentials: true });
      return response.data;
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      return axios.patch(`${API_URL}/orders/${orderId}/status`, { status }, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-active-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      toast.success("ORDER STATUS SYNCHRONIZED");
    }
  });

  if (isAnalyticsLoading || isOrdersLoading) return <div className="h-screen flex items-center justify-center bg-bone pt-32"><Loader2 className="animate-spin text-sage" size={48} /></div>;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-16">
        <header className="border-b border-sage pb-12 flex justify-between items-end">
          <div>
            <h1 className="text-8xl font-black uppercase tracking-tighter italic leading-none text-deep-olive">OVERVIEW</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-end border-b border-sage pb-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-deep-olive">ACTIVE ORDERS</h3>
              <p className="text-[10px] font-bold text-sage uppercase tracking-widest">{activeOrders?.length || 0} PENDING ACTIONS</p>
            </div>
            
            <div className="space-y-4">
              {activeOrders?.map((order: any) => (
                <div key={order.id} className="border border-sage p-6 bg-bone hover:bg-clay/5 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black text-sage uppercase tracking-widest mb-1">USER: {order.user.email}</p>
                      <p className="text-xs font-bold uppercase text-deep-olive">${Number(order.totalAmount).toFixed(2)} — {order.items.length} ITEMS</p>
                    </div>
                    
                    <div className="flex gap-4">
                      <select 
                        value={order.status}
                        onChange={(e) => statusMutation.mutate({ orderId: order.id, status: e.target.value })}
                        className="bg-transparent border border-sage p-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-deep-olive cursor-pointer"
                      >
                        <option value="PAID">PAID</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-deep-olive border-b border-sage pb-6 text-right">RECENT ACTIVITY</h3>
            <div className="space-y-6">
              {analytics.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex justify-between items-start text-right">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-deep-olive">{activity.user.split('@')[0]}</p>
                    <p className="text-[9px] font-bold text-sage uppercase tabular-nums">{new Date(activity.time).toLocaleTimeString()}</p>
                  </div>
                  <div className="space-y-1">
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
