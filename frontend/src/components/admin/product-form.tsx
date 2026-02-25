"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PrimaryButton } from "@/components/ui/button";
import { Plus, Tag, Layers } from "lucide-react";
import axios from "axios";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export const CreateProductForm = () => {
  const queryClient = useQueryClient();
  const [isNewCategory, setIsNewCategory] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Get all products to extract unique categories
      const response = await axios.get(`${API_URL}/products`);
      const products = response.data.data;
      const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category))).filter(Boolean);
      return uniqueCategories as string[];
    }
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "",
    }
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await axios.post(`${API_URL}/products`, data, {
        withCredentials: true,
      });

      reset();
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("PRODUCT SYNCED TO CATALOG");
    } catch (error) {
      toast.error("CATALOG SYNC FAILURE");
    }
  };

  return (
    <div className="bg-bone border border-sage p-12">
      <div className="flex items-center gap-4 mb-12 border-b border-sage pb-8">
        <Plus size={32} className="text-sage" strokeWidth={3} />
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-deep-olive">CREATE PRODUCT</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-deep-olive">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">PRODUCT NAME</label>
            <input
              {...register("name")}
              className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive transition-all hover:bg-clay/5"
              placeholder="e.g. Monolith Vase"
            />
            {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">PRICE (USD)</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive transition-all hover:bg-clay/5"
              placeholder="0.00"
            />
            {errors.price && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.price.message}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">CATEGORY</label>
              <button 
                type="button"
                onClick={() => setIsNewCategory(!isNewCategory)}
                className="text-[8px] font-black uppercase tracking-widest text-sulfur hover:underline"
              >
                {isNewCategory ? "SELECT EXISTING" : "+ CREATE NEW"}
              </button>
            </div>
            
            {isNewCategory ? (
              <div className="relative">
                <input
                  {...register("category")}
                  className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive transition-all"
                  placeholder="NEW CATEGORY NAME"
                />
                <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-sage" size={14} />
              </div>
            ) : (
              <div className="relative">
                <select
                  {...register("category")}
                  className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive transition-all hover:bg-clay/5 cursor-pointer appearance-none"
                >
                  <option value="">CHOOSE CATEGORY</option>
                  {categoriesData?.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
                <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-sage pointer-events-none" size={14} />
              </div>
            )}
            {errors.category && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.category.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">STOCK LEVEL</label>
            <input
              type="number"
              {...register("stock")}
              className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive transition-all hover:bg-clay/5"
              placeholder="0"
            />
            {errors.stock && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.stock.message}</p>}
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">DESCRIPTION</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full bg-bone border border-sage p-4 text-xs font-bold leading-relaxed focus:outline-none focus:border-deep-olive transition-all hover:bg-clay/5"
              placeholder="Minimalist essential object"
            />
          </div>
        </div>

        <PrimaryButton 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full py-8 text-sm tracking-[0.3em] font-black uppercase shadow-xl shadow-deep-olive/5 hover:bg-black"
        >
          {isSubmitting ? "TRANSMITTING DATA..." : "AUTHORIZE PRODUCT CREATION"}
        </PrimaryButton>
      </form>
    </div>
  );
};
