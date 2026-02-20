"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group relative border border-sage bg-bone overflow-hidden flex flex-col h-[450px]"
    >
      {/* Grayscale to Color Image Placeholder */}
      <div className="relative flex-1 bg-clay/20 overflow-hidden">
        <div 
          className="w-full h-full bg-clay/30 grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Hover Reveal Button */}
        <motion.button
          initial={{ y: "100%" }}
          whileHover={{ y: 0 }}
          className="absolute bottom-0 left-0 w-full bg-sulfur text-deep-olive py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-transform duration-300 translate-y-full group-hover:translate-y-0"
        >
          <Plus size={16} /> Add to Cart
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-6 border-t border-sage">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-black text-lg tracking-tighter uppercase leading-none">
            {product.name}
          </h3>
          <span className="font-bold text-sm italic text-sage">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>
        <p className="text-[10px] text-sage font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
          {product.description || "Premium Essential Object"}
        </p>
      </div>
    </motion.div>
  );
};
