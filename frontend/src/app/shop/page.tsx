"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductCard } from "@/components/ui/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

export default function ShopPage() {
  const searchParams = useSearchParams();
  const nameQuery = searchParams.get("name") || "";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");

  const { data: allProductsData } = useQuery({
    queryKey: ["all-products-for-categories"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products`);
      return response.data.data;
    }
  });

  const categories = Array.from(new Set(allProductsData?.map((p: any) => p.category))).filter(Boolean) as string[];

  const { data, isLoading } = useQuery({
    queryKey: ["products", selectedCategory, priceRange, sortBy, nameQuery],
    queryFn: async () => {
      const params: any = { sortBy };
      if (selectedCategory) params.category = selectedCategory;
      if (priceRange) params.maxPrice = priceRange;
      if (nameQuery) params.name = nameQuery;
      
      const response = await axios.get(`${API_URL}/products`, { params });
      return response.data;
    },
  });

  const products = data?.data || [];

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-deep-olive">
      <div className="flex flex-col md:flex-row gap-16">
        <aside className="w-full md:w-64 space-y-12">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage mb-8 border-b border-sage pb-4 italic">
              01. CATEGORIES
            </h3>
            <div className="space-y-4">
              <motion.button 
                whileHover={{ scale: 1.05, x: 4 }}
                transition={iconTransition}
                onClick={() => setSelectedCategory(null)}
                className={`block text-xs font-bold uppercase tracking-widest transition-all group text-left cursor-pointer ${!selectedCategory ? 'text-deep-olive' : 'text-sage hover:text-deep-olive'}`}
              >
                <span className={`inline-block w-2 h-px bg-deep-olive mr-2 transition-all ${!selectedCategory ? 'opacity-100' : 'opacity-0'}`} />
                All Objects
              </motion.button>
              {categories.map((cat) => (
                <motion.button 
                  key={cat}
                  whileHover={{ scale: 1.05, x: 4 }}
                  transition={iconTransition}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block text-xs font-bold uppercase tracking-widest transition-all group text-left cursor-pointer ${selectedCategory === cat ? 'text-deep-olive' : 'text-sage hover:text-deep-olive'}`}
                >
                  <span className={`inline-block w-2 h-px bg-deep-olive mr-2 transition-all ${selectedCategory === cat ? 'opacity-100' : 'opacity-0'}`} />
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage mb-8 border-b border-sage pb-4 italic">
              02. PRICE RANGE
            </h3>
            <div className="space-y-6">
              <input 
                type="range" 
                min="0" 
                max="2050" 
                step="50"
                value={priceRange || 2050}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPriceRange(val > 2000 ? null : val);
                }}
                className="w-full accent-deep-olive bg-sage/20 h-px appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-sage">
                <span>$0</span>
                <span className={priceRange ? 'text-deep-olive' : ''}>{priceRange ? `UP TO $${priceRange}` : "NONE / NO LIMIT"}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage mb-8 border-b border-sage pb-4 italic">
              03. SORT BY
            </h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-transparent border border-sage p-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-deep-olive hover:bg-clay/10 transition-colors cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex justify-between items-end mb-12 border-b border-sage pb-8">
            <div>
              <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">COLLECTION</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage mt-2">
                {selectedCategory || "All"} / {products.length} Items Found
              </p>
            </div>
            <SlidersHorizontal size={24} className="text-sage" />
          </header>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px] border border-sage border-dashed">
              <Loader2 className="animate-spin text-sage mb-4" size={32} />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">Synchronizing...</span>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-40 border border-sage border-dashed">
               <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-sage italic">No items found matching criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
