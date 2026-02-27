"use client";

import { useCart } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { PrimaryButton } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

export const CartDrawer = () => {
  const { items, removeItem, increment, decrement, getTotal, getItemCount, clearCart } = useCart();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("PLEASE AUTHENTICATE TO PROCEED");
      router.push("/login");
      return;
    }

    setIsCheckingOut(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await axios.post(`${API_URL}/orders`, {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
      }, { withCredentials: true });

      toast.success("ORDER SYNCHRONIZED SUCCESSFULLY");
      clearCart();
      router.push("/user/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "CHECKOUT SEQUENCE FAILED");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          transition={iconTransition}
          className="p-2.5 text-deep-olive hover:bg-clay transition-all rounded-full relative cursor-pointer flex items-center justify-center"
        >
          <ShoppingCart size={18} />
          {getItemCount() > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-sulfur text-white text-[7px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-black">
              {getItemCount()}
            </span>
          )}
        </motion.button>
      </SheetTrigger>
      <SheetContent className="bg-clay flex flex-col h-full border-l border-sage p-0 sm:max-w-md">
        <SheetHeader className="p-6 border-b border-sage">
          <SheetTitle className="text-2xl font-black uppercase tracking-tighter uppercase text-deep-olive">
            Your Cart ({getItemCount()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-deep-olive">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <ShoppingCart size={48} className="mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 pb-6 border-b border-dashed border-sage last:border-0"
              >
                <div className="w-20 h-20 bg-bone border border-sage flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-black uppercase tracking-tight">
                      {item.name}
                    </h4>
                    <motion.button 
                      whileHover={{ scale: 1.1, color: "#ef4444" }}
                      onClick={() => removeItem(item.id)}
                      className="text-sage cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-sage bg-bone">
                      <button 
                        onClick={() => decrement(item.id)}
                        className="p-1 hover:bg-clay transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-[10px] font-bold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => increment(item.id)}
                        className="p-1 hover:bg-clay transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-xs font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-bone border-t border-sage space-y-4">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-deep-olive">
              <span>Subtotal</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-sage font-bold uppercase tracking-widest leading-relaxed italic">
              * Order processing time approximately 24-48h.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} transition={iconTransition}>
              <PrimaryButton 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full text-xs tracking-widest uppercase font-black py-4 flex items-center justify-center gap-3 cursor-pointer"
              >
                {isCheckingOut ? (
                  <><Loader2 className="animate-spin" size={16} /> INITIALIZING...</>
                ) : (
                  "Proceed to Checkout"
                )}
              </PrimaryButton>
            </motion.div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
