"use client";

import { AdminLayout } from "@/components/admin/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: activeOrders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["admin-active-orders"],
    queryFn: async () => {
      // Get all orders for the admin panel, not just active ones to allow viewing everything
      // If we only want active, we can pass active=true. We will fetch all here.
      const response = await axios.get(`${API_URL}/orders/admin/list`, { withCredentials: true });
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

  if (isOrdersLoading) return <div className="h-screen flex items-center justify-center bg-bone pt-32"><Loader2 className="animate-spin text-sage" size={48} /></div>;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-12 text-deep-olive">
        <header className="border-b border-sage pb-12 flex justify-between items-end">
          <div>
            <h1 className="text-8xl font-black uppercase tracking-tighter italic leading-none">ORDERS</h1>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-sage mt-4">Order Management Protocol</p>
          </div>
        </header>

        <div className="space-y-8">
          <div className="flex justify-between items-end border-b border-sage pb-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">ALL ORDERS</h3>
            <p className="text-[10px] font-bold text-sage uppercase tracking-widest">
              {activeOrders?.filter((o: any) => o.status !== 'CANCELLED' && o.status !== 'DELIVERED').length || 0} PENDING ACTIONS
            </p>
          </div>
          
          <div className="space-y-4">
            {activeOrders?.map((order: any) => {
              const isCancelled = order.status === 'CANCELLED';
              const isDelivered = order.status === 'DELIVERED';
              return (
                <div key={order.id} className={`border border-sage p-6 bg-bone hover:bg-clay/5 transition-colors ${isCancelled ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black text-sage uppercase tracking-widest mb-1">USER: {order.user.email} | ID: {order.id}</p>
                      <p className="text-xs font-bold uppercase text-deep-olive">${Number(order.totalAmount).toFixed(2)} — {order.items.length} ITEMS</p>
                    </div>
                    
                    <div className="flex gap-4">
                      <select 
                        value={order.status}
                        disabled={isCancelled}
                        onChange={(e) => statusMutation.mutate({ orderId: order.id, status: e.target.value })}
                        className={`bg-transparent border border-sage p-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-deep-olive transition-all ${isCancelled ? 'cursor-not-allowed border-dashed' : 'cursor-pointer hover:border-deep-olive'}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
