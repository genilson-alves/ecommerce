"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, Edit2, Package, Trash2, ExternalLink, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  updatedAt: string;
}

const columnHelper = createColumnHelper<Product>();

export const ProductTable = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditForm] = useState<any>({});

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
      setEditingId(null);
      toast.success("INVENTORY UPDATED");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${API_URL}/products/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("PRODUCT REMOVED FROM INVENTORY");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO REMOVE THIS ITEM?")) {
      deleteMutation.mutate(id);
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const columns = [
    columnHelper.accessor("name", {
      header: () => <span className="text-[9px] font-black tracking-[0.3em] text-sage uppercase">NAME</span>,
      cell: (info) => editingId === info.row.original.id ? (
        <input 
          className="bg-clay/10 border border-sage p-1 text-xs font-bold uppercase w-full focus:outline-none"
          value={editValues.name}
          onChange={(e) => setEditForm({...editValues, name: e.target.value})}
        />
      ) : (
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-tighter italic">{info.getValue()}</span>
          <span className="text-[8px] font-bold text-sage">{info.row.original.category}</span>
        </div>
      ),
    }),
    columnHelper.accessor("price", {
      header: () => <span className="text-[9px] font-black tracking-[0.3em] text-sage uppercase">PRICE</span>,
      cell: (info) => editingId === info.row.original.id ? (
        <div className="flex items-center gap-1">
          $ <input 
            type="number"
            className="bg-clay/10 border border-sage p-1 text-xs font-bold w-20 focus:outline-none"
            value={editValues.price}
            onChange={(e) => setEditForm({...editValues, price: parseFloat(e.target.value)})}
          />
        </div>
      ) : (
        <span className="text-xs font-bold tabular-nums">${Number(info.getValue()).toFixed(2)}</span>
      ),
    }),
    columnHelper.accessor("stock", {
      header: () => <span className="text-[9px] font-black tracking-[0.3em] text-sage uppercase">STOCK</span>,
      cell: (info) => editingId === info.row.original.id ? (
        <input 
          type="number"
          className="bg-clay/10 border border-sage p-1 text-xs font-bold w-16 focus:outline-none"
          value={editValues.stock}
          onChange={(e) => setEditForm({...editValues, stock: parseInt(e.target.value)})}
        />
      ) : (
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
          {editingId === info.getValue() ? (
            <>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                transition={iconTransition}
                onClick={() => updateMutation.mutate({ id: info.getValue(), data: editValues })}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
              >
                <Save size={14} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                transition={iconTransition}
                onClick={() => setEditingId(null)}
                className="p-2 text-sage hover:bg-clay rounded-lg cursor-pointer"
              >
                <X size={14} />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                transition={iconTransition}
                onClick={() => startEditing(info.row.original)}
                className="p-2 text-sage hover:text-deep-olive hover:bg-clay transition-all rounded-lg cursor-pointer"
              >
                <Edit2 size={14} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                transition={iconTransition}
                onClick={() => handleDelete(info.getValue())}
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
            </>
          )}
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
    <div className="bg-bone border border-sage p-10 overflow-hidden text-deep-olive">
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
    </div>
  );
};
