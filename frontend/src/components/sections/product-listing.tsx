"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductCard } from "@/components/ui/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const ProductListing = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border border-sage animate-pulse bg-bone">
        <Loader2 className="animate-spin text-sage mb-4" size={32} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">Retrieving Collection</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border border-sage bg-bone p-12 text-center">
        <h3 className="text-xl font-black tracking-tighter mb-4 uppercase">Network Error</h3>
        <p className="text-xs font-bold text-sage mb-8 uppercase tracking-widest">Failed to retrieve the latest collection</p>
        <button 
          onClick={() => refetch()}
          className="bg-deep-olive text-bone px-8 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-95 transition-transform"
        >
          <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} /> Retry Fetch
        </button>
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase leading-none mb-2">Available Collection</h2>
          <p className="text-[10px] font-bold text-sage uppercase tracking-[0.3em]">Showing {products.length} Items</p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-sage" />
          <div className="w-2 h-2 rounded-full bg-sage/30" />
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
