"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, Edit2, Package, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${API_URL}/products/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("PRODUCT REMOVED FROM INVENTORY");
    },
    onError: () => {
      toast.error("DELETION FAILED");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO REMOVE THIS ITEM?")) {
      deleteMutation.mutate(id);
    }
  };

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
      cell: (info) => <span className="text-xs font-bold tabular-nums">${Number(info.getValue()).toFixed(2)}</span>,
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
          <button 
            onClick={() => router.push(`/shop/${info.getValue()}`)}
            className="p-2 text-sage hover:text-deep-olive hover:bg-clay transition-all rounded-lg"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => handleDelete(info.getValue())}
            className="p-2 text-sage hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={() => router.push(`/shop/${info.getValue()}`)}
            className="p-2 text-sage hover:text-sulfur transition-all rounded-lg"
          >
            <ExternalLink size={14} />
          </button>
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
    <div className="bg-bone border border-sage p-10 overflow-hidden">
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
