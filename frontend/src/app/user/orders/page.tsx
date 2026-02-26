"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, Truck, CheckCircle, RefreshCcw, AlertCircle, Trash2, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

const statusConfig = {
  PENDING: { icon: Clock, color: "text-clay", bg: "bg-clay/10", border: "border-sage/30" },
  PAID: { icon: CheckCircle, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  PREPARING: { icon: RefreshCcw, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  SHIPPED: { icon: Truck, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  DELIVERED: { icon: Package, color: "text-deep-olive", bg: "bg-bone", border: "border-sage" },
  CANCELLED: { icon: AlertCircle, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
};

export default function OrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/orders`, { withCredentials: true });
      return response.data;
    },
    refetchInterval: 10000,
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return axios.post(`${API_URL}/orders/${orderId}/cancel`, {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      toast.success("ORDER TERMINATED SUCCESSFULLY");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "CANCELLATION FAILURE");
    }
  });

  if (!user) return null;

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <Link href="/profile" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sage hover:text-deep-olive transition-colors mb-8 group w-fit">
        <motion.div whileHover={{ x: -4 }} transition={iconTransition}>
          <ArrowLeft size={14} />
        </motion.div>
        Back to Profile
      </Link>

      <header className="border-b border-sage pb-12 mb-16 flex justify-between items-end">
        <div>
          <h1 className="text-8xl font-black uppercase tracking-tighter italic leading-none text-deep-olive text-balance">ORDERS</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-sage mt-4">Transaction History & Status</p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-sage border border-sage p-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-sulfur animate-pulse" />
          Live Synchronization Active
        </div>
      </header>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center border border-sage border-dashed italic text-sage uppercase text-[10px] font-bold tracking-widest">
          Syncing order logs...
        </div>
      ) : isError || !orders || !Array.isArray(orders) || orders.length === 0 ? (
        <div className="text-center py-40 border border-sage border-dashed">
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-sage italic mb-8">No transaction records found.</p>
           <motion.div whileHover={{ scale: 1.05 }} transition={iconTransition}>
             <Link href="/shop" className="bg-deep-olive text-bone px-8 py-4 text-xs font-bold uppercase tracking-widest hover:scale-95 transition-transform inline-block text-center">Start Shopping</Link>
           </motion.div>
        </div>
      ) : (
        <div className="space-y-12">
          {orders.map((order: any) => {
            const Config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING;
            const canCancel = order.status === 'PAID' || order.status === 'PENDING';

            return (
              <div key={order.id} className="border border-sage bg-bone group hover:border-deep-olive transition-colors shadow-sm">
                <div className="p-8 flex flex-col md:flex-row justify-between gap-8 border-b border-sage/30">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-sage">ID: {order.id}</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-deep-olive">
                      Order Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {canCancel && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        transition={iconTransition}
                        onClick={() => cancelMutation.mutate(order.id)}
                        disabled={cancelMutation.isPending}
                        className="flex items-center gap-2 px-6 py-2 border border-rose-200 text-rose-700 bg-rose-50 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 size={14} /> {cancelMutation.isPending ? "Terminating..." : "Cancel Order"}
                      </motion.button>
                    )}
                    <div className={`flex items-center gap-3 px-6 py-2 border ${Config.border} h-fit ${Config.bg}`}>
                      <Config.icon size={16} className={`${Config.color} ${order.status === 'PREPARING' ? 'animate-spin' : ''}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${Config.color}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-deep-olive">
                        <div className="flex gap-6 items-center">
                          <span className="text-sage italic">x{item.quantity}</span>
                          <span>{item.product?.name || "Product Archive"}</span>
                        </div>
                        <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-dashed border-sage flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-sage mb-1">Payment Method</p>
                      <p className="text-xs font-black uppercase tracking-tight">External Checkout (Mock)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-sage mb-1">Order Total</p>
                      <p className="text-4xl font-black uppercase tracking-tighter text-deep-olive italic">
                        ${Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
