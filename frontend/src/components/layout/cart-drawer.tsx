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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      await axios.post(`${API_URL}/orders`, {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
      }, { withCredentials: true });

      toast.success("ORDER SYNCHRONIZED SUCCESSFULLY");
      clearCart();
      router.push("/orders");
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
        <button className="hover:text-sage transition-colors relative">
          <ShoppingCart size={20} />
          {getItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-deep-olive text-bone text-[8px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
              {getItemCount()}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="bg-clay flex flex-col h-full border-l border-sage p-0 sm:max-w-md">
        <SheetHeader className="p-6 border-b border-sage">
          <SheetTitle className="text-2xl font-black tracking-tighter uppercase text-deep-olive">
            Your Cart ({getItemCount()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-deep-olive/60">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
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
                    <h4 className="text-xs font-black uppercase tracking-tight text-deep-olive">
                      {item.name}
                    </h4>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-deep-olive/40 hover:text-deep-olive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-sage bg-bone">
                      <button 
                        onClick={() => decrement(item.id)}
                        className="p-1 hover:bg-clay transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-[10px] font-bold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => increment(item.id)}
                        className="p-1 hover:bg-clay transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-deep-olive">
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
            <p className="text-[10px] text-sage font-bold uppercase tracking-widest leading-relaxed">
              Shipping and taxes calculated at checkout.
            </p>
            <PrimaryButton 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full text-xs tracking-widest uppercase font-black py-4 flex items-center justify-center gap-3"
            >
              {isCheckingOut ? (
                <><Loader2 className="animate-spin" size={16} /> INITIALIZING...</>
              ) : (
                "Proceed to Checkout"
              )}
            </PrimaryButton>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
