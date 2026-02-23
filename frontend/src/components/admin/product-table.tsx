"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, ArrowUpRight, Package, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  updatedAt: string;
}

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("name", {
    header: () => <span className="text-[10px] font-bold tracking-[0.3em] text-sage">NAME</span>,
    cell: (info) => <span className="text-xs font-black uppercase tracking-tighter italic">{info.getValue()}</span>,
  }),
  columnHelper.accessor("price", {
    header: () => <span className="text-[10px] font-bold tracking-[0.3em] text-sage">PRICE</span>,
    cell: (info) => <span className="text-xs font-bold tabular-nums">${Number(info.getValue()).toFixed(2)}</span>,
  }),
  columnHelper.accessor("stock", {
    header: () => <span className="text-[10px] font-bold tracking-[0.3em] text-sage">STOCK</span>,
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
    header: () => <span className="text-[10px] font-bold tracking-[0.3em] text-sage">ACTIONS</span>,
    cell: (info) => (
      <div className="flex gap-4">
        <button className="text-sage hover:text-deep-olive transition-colors"><ArrowUpRight size={16} /></button>
        <button className="text-sage hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
      </div>
    ),
  }),
];

export const ProductTable = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

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
              <tr key={row.id} className="border-b border-sage/30 last:border-0 hover:bg-clay/5 transition-colors">
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
