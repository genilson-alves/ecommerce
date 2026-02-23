"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PrimaryButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
});

type ProductFormData = z.infer<typeof productSchema>;

export const CreateProductForm = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Assuming localhost:3000 as backend for consistency
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      
      // We'd normally get the token from an auth store
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/products`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      reset();
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      alert("Product created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
    }
  };

  return (
    <div className="bg-bone border border-sage p-12">
      <div className="flex items-center gap-4 mb-12 border-b border-sage pb-8">
        <Plus size={32} className="text-sage" strokeWidth={3} />
        <h2 className="text-4xl font-black uppercase tracking-tighter italic">CREATE PRODUCT</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">PRODUCT NAME</label>
            <input
              {...register("name")}
              className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30"
              placeholder="e.g. MONOLITH VASE"
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">PRICE (USD)</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30"
              placeholder="0.00"
            />
            {errors.price && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.price.message}</p>}
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">DESCRIPTION</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full bg-bone border border-sage p-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30"
              placeholder="MINIMALIST ESSENTIAL OBJECT"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">STOCK LEVEL</label>
            <input
              type="number"
              {...register("stock")}
              className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30"
              placeholder="0"
            />
            {errors.stock && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.stock.message}</p>}
          </div>
        </div>

        <PrimaryButton type="submit" disabled={isSubmitting} className="w-full py-8 text-sm tracking-[0.3em] font-black uppercase">
          {isSubmitting ? "SYNCING..." : "CONFIRM CREATION"}
        </PrimaryButton>
      </form>
    </div>
  );
};
