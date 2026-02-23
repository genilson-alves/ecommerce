"use client";

import { AdminLayout } from "@/components/admin/layout";
import { ProductTable } from "@/components/admin/product-table";
import { CreateProductForm } from "@/components/admin/product-form";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState<"catalog" | "create">("catalog");

  return (
    <AdminLayout>
      <div className="flex flex-col gap-12">
        <header className="border-b border-sage pb-12 flex justify-between items-end">
          <div>
            <h1 className="text-8xl font-black uppercase tracking-tighter italic leading-none">INVENTORY</h1>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-sage mt-4">Manage Collection</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("catalog")}
              className={cn(
                "px-8 py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all",
                activeTab === "catalog" ? "bg-deep-olive text-bone" : "bg-bone border border-sage hover:bg-clay/10"
              )}
            >
              VIEW CATALOG
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={cn(
                "px-8 py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all",
                activeTab === "create" ? "bg-deep-olive text-bone" : "bg-bone border border-sage hover:bg-clay/10"
              )}
            >
              ADD PRODUCT
            </button>
          </div>
        </header>

        {activeTab === "catalog" ? <ProductTable /> : <CreateProductForm />}
      </div>
    </AdminLayout>
  );
}
