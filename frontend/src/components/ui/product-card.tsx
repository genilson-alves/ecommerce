"use client";

import { motion } from "framer-motion";
import { Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/shop/${product.id}?buy=true`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: Number(product.price) });
    toast.success(`${product.name.toUpperCase()} ADDED TO COLLECTION`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={iconTransition}
      className="group relative border border-sage bg-bone overflow-hidden flex flex-col h-[500px] cursor-pointer"
      onClick={() => router.push(`/shop/${product.id}`)}
    >
      <div className="relative flex-1 bg-clay/20 overflow-hidden">
        <div 
          className="w-full h-full bg-clay/30 grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Hover Reveal Buttons */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={iconTransition}
            onClick={handleBuyNow}
            className="w-full bg-deep-olive text-bone py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-colors border-t border-sage cursor-pointer"
          >
            <ShoppingBag size={14} /> Buy Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={iconTransition}
            onClick={handleAddToCart}
            className="w-full bg-sulfur text-deep-olive py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#d9d78d] transition-colors border-t border-sage cursor-pointer"
          >
            <Plus size={14} /> Add to Cart
          </motion.button>
        </div>
      </div>

      <div className="p-6 border-t border-sage text-deep-olive">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-black text-lg tracking-tighter uppercase leading-none truncate pr-4">
            {product.name}
          </h3>
          <span className="font-bold text-sm tabular-nums shrink-0 italic text-sage">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>
        <p className="text-[10px] text-sage font-bold uppercase tracking-widest leading-relaxed line-clamp-2 mb-4">
          {product.category || "General"} / {product.description || "Premium Essential Object"}
        </p>
        
        <div className="flex items-center gap-2">
           <span className="text-[8px] font-black uppercase tracking-[0.3em] px-2 py-1 border border-sage/30 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">Explore Details</span>
        </div>
      </div>
    </motion.div>
  );
};
