"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, Edit2, Package, Trash2, ExternalLink, AlertCircle, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PrimaryButton } from "@/components/ui/button";

const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  description?: string;
  updatedAt: string;
}

const columnHelper = createColumnHelper<Product>();

export const ProductTable = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products`, { withCredentials: true });
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return axios.put(`${API_URL}/products/${id}`, data, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setEditingProduct(null);
      toast.success("INVENTORY UPDATED");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${API_URL}/products/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDeletingId(null);
      toast.success("PRODUCT REMOVED FROM INVENTORY");
    },
    onError: () => {
      setDeletingId(null);
      toast.error("DELETION FAILED. This object may have active logs.");
    }
  });

  const columns = [
    columnHelper.accessor("name", {
      header: () => <span className="text-[9px] font-black tracking-[0.3em] text-sage uppercase">NAME</span>,
      cell: (info) => (
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-tighter italic">{info.getValue()}</span>
          <span className="text-[8px] font-bold text-sage">{info.row.original.category}</span>
        </div>
      ),
    }),
    columnHelper.accessor("price", {
      header: () => <span className="text-[9px] font-black tracking-[0.3em] text-sage uppercase">PRICE</span>,
      cell: (info) => (
        <span className="text-xs font-bold tabular-nums">${Number(info.getValue()).toFixed(2)}</span>
      ),
    }),
    columnHelper.accessor("stock", {
      header: () => <span className="text-[9px] font-black tracking-[0.3em] text-sage uppercase">STOCK</span>,
      cell: (info) => (
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${info.getValue() < 10 ? 'text-red-500' : 'text-deep-olive'}`}>
            {info.getValue()}
          </span>
          {info.getValue() < 10 && <span className="text-[8px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-1 py-0.5 border border-red-200">LOW</span>}
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: () => <span className="text-[9px] font-black tracking-[0.3em] text-sage uppercase">ACTIONS</span>,
      cell: (info) => (
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            transition={iconTransition}
            onClick={() => setEditingProduct(info.row.original)}
            className="p-2 text-sage hover:text-deep-olive hover:bg-clay transition-all rounded-lg cursor-pointer"
          >
            <Edit2 size={14} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            transition={iconTransition}
            onClick={() => setDeletingId(info.getValue())}
            className="p-2 text-sage hover:text-red-500 hover:bg-red-50 transition-all rounded-lg cursor-pointer"
          >
            <Trash2 size={14} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            transition={iconTransition}
            onClick={() => router.push(`/shop/${info.getValue()}`)}
            className="p-2 text-sage hover:text-sulfur transition-all rounded-lg cursor-pointer"
          >
            <ExternalLink size={14} />
          </motion.button>
        </div>
      ),
    }),
  ];

  const products = data?.data || [];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[400px] border border-sage animate-pulse bg-bone/50">
      <Loader2 className="animate-spin text-sage mb-4" size={32} />
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">Synchronizing Catalog</span>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center h-[400px] border border-sage p-12 text-center bg-bone/50">
      <h3 className="text-xl font-black tracking-tighter mb-4 uppercase text-red-500">Database Connection Failure</h3>
    </div>
  );

  return (
    <div className="bg-bone border border-sage p-10 overflow-hidden text-deep-olive relative">
      <div className="flex justify-between items-end mb-12 border-b border-sage pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">PRODUCT CATALOG</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage mt-2">Active Inventory Control</p>
        </div>
        <Package size={32} className="text-sage" strokeWidth={3} />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-sage text-left">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="pb-6 px-4 first:pl-0">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-sage/30 last:border-0 hover:bg-clay/10 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-6 px-4 first:pl-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-deep-olive/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-bone border border-sage p-12 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-start border-b border-sage pb-6 mb-8">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Edit Object</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage mt-2">ID: {editingProduct.id}</p>
                </div>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setEditingProduct(null)} className="cursor-pointer text-sage hover:text-deep-olive transition-colors">
                  <X size={20} />
                </motion.button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">NAME</label>
                  <input 
                    className="w-full bg-clay/5 border border-sage p-3 text-xs font-bold focus:outline-none focus:border-deep-olive transition-colors"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">PRICE</label>
                    <input 
                      type="number"
                      className="w-full bg-clay/5 border border-sage p-3 text-xs font-bold focus:outline-none focus:border-deep-olive transition-colors tabular-nums"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">STOCK</label>
                    <input 
                      type="number"
                      className="w-full bg-clay/5 border border-sage p-3 text-xs font-bold focus:outline-none focus:border-deep-olive transition-colors tabular-nums"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">CATEGORY</label>
                  <input 
                    className="w-full bg-clay/5 border border-sage p-3 text-xs font-bold focus:outline-none focus:border-deep-olive transition-colors"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">IMAGE URL</label>
                  <input 
                    className="w-full bg-clay/5 border border-sage p-3 text-xs font-bold focus:outline-none focus:border-deep-olive transition-colors"
                    value={editingProduct.imageUrl || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">DESCRIPTION</label>
                  <textarea 
                    className="w-full bg-clay/5 border border-sage p-3 text-xs font-bold leading-relaxed focus:outline-none focus:border-deep-olive transition-colors"
                    rows={3}
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full pt-8 mt-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setEditingProduct(null)}
                  className="py-4 border border-sage text-[10px] font-black uppercase tracking-widest text-deep-olive hover:bg-clay/10 transition-colors cursor-pointer"
                >
                  Discard
                </motion.button>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <PrimaryButton 
                    onClick={() => updateMutation.mutate({ id: editingProduct.id, data: editingProduct })}
                    disabled={updateMutation.isPending}
                    className="w-full py-4 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : "Update Object"}
                  </PrimaryButton>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-deep-olive/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-bone border border-sage p-12 max-w-lg w-full shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-8">
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-full animate-pulse">
                  <AlertCircle size={32} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4 text-deep-olive text-balance">Expunge Object?</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage">
                    This action completely removes the object from the database and destroys all associated order logs and evaluations.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full pt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    transition={iconTransition}
                    onClick={() => setDeletingId(null)}
                    className="py-6 border border-sage text-[10px] font-black uppercase tracking-widest text-deep-olive hover:bg-clay/10 transition-colors cursor-pointer"
                  >
                    Abort
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.05 }} transition={iconTransition}>
                    <button 
                      onClick={() => deleteMutation.mutate(deletingId)}
                      disabled={deleteMutation.isPending}
                      className="w-full py-6 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors cursor-pointer flex items-center justify-center gap-3"
                    >
                      {deleteMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : "Confirm Deletion"}
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
