"use client";

import { AdminLayout } from "@/components/admin/layout";
import { ProductTable } from "@/components/admin/product-table";
import { CreateProductForm } from "@/components/admin/product-form";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState<"catalog" | "create">("catalog");

  return (
    <AdminLayout>
      <div className="flex flex-col gap-12 text-deep-olive">
        <header className="border-b border-sage pb-12 flex justify-between items-end">
          <div>
            <h1 className="text-8xl font-black uppercase tracking-tighter italic leading-none">INVENTORY</h1>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-sage mt-4">Manage Collection</p>
          </div>
          
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={iconTransition}
              onClick={() => setActiveTab("catalog")}
              className={cn(
                "px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 active:scale-95 cursor-pointer",
                activeTab === "catalog" 
                  ? "bg-deep-olive text-bone shadow-xl shadow-deep-olive/10" 
                  : "bg-bone border border-sage text-sage hover:text-deep-olive hover:bg-clay/10"
              )}
            >
              VIEW CATALOG
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={iconTransition}
              onClick={() => setActiveTab("create")}
              className={cn(
                "px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 active:scale-95 cursor-pointer",
                activeTab === "create" 
                  ? "bg-deep-olive text-bone shadow-xl shadow-deep-olive/10" 
                  : "bg-bone border border-sage text-sage hover:text-deep-olive hover:bg-clay/10"
              )}
            >
              ADD PRODUCT
            </motion.button>
          </div>
        </header>

        <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          {activeTab === "catalog" ? <ProductTable /> : <CreateProductForm />}
        </div>
      </div>
    </AdminLayout>
  );
}
