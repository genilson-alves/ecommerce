"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { PrimaryButton } from "@/components/ui/button";
import { Loader2, ArrowLeft, Edit2, Save, X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [editForm, setEditForm] = useState<any>(null);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      return axios.put(`${API_URL}/products/${id}`, updatedData, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      setIsEditing(false);
      toast.success("PRODUCT SYNCHRONIZED SUCCESSFULLY");
    },
    onError: () => {
      toast.error("SYNCHRONIZATION FAILURE");
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-bone"><Loader2 className="animate-spin text-sage" size={48} /></div>;
  if (isError) return <div className="h-screen flex items-center justify-center bg-bone">Product Not Found</div>;

  const handleEditInit = () => {
    setEditForm({ ...product });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(editForm);
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("PLEASE LOGIN TO PURCHASE");
      router.push("/login");
      return;
    }
    try {
      await axios.post(`${API_URL}/orders`, {
        items: [{ productId: product.id, quantity }]
      }, { withCredentials: true });
      toast.success("ORDER PLACED");
      router.push("/orders");
    } catch (error) {
      toast.error("PURCHASE FAILED");
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sage hover:text-deep-olive transition-colors mb-12 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* Product Image */}
        <div className="md:col-span-7 bg-clay/10 border border-sage aspect-square relative overflow-hidden group">
           <div 
            className="w-full h-full bg-clay/20 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {user?.role === 'ADMIN' && (
            <button 
              onClick={isEditing ? () => setIsEditing(false) : handleEditInit}
              className="absolute top-8 right-8 bg-deep-olive text-bone p-4 hover:bg-black transition-colors"
            >
              {isEditing ? <X size={20} /> : <Edit2 size={20} />}
            </button>
          )}
        </div>

        {/* Product Details */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-10">
          <div className="space-y-4">
            {isEditing ? (
              <input 
                className="text-6xl font-black uppercase tracking-tighter italic bg-transparent border-b-2 border-deep-olive w-full focus:outline-none"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            ) : (
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none text-deep-olive">
                {product.name}
              </h1>
            )}
            
            <div className="flex items-center gap-4">
              {isEditing ? (
                <input 
                  className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage bg-transparent border-b border-sage focus:outline-none"
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                />
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">{product.category}</span>
              )}
              <span className="text-sage">/</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-clay">{product.salesCount} SALES TO DATE</span>
            </div>
          </div>

          <div className="text-4xl font-black tracking-tight tabular-nums">
            {isEditing ? (
              <div className="flex items-center gap-2">
                $ <input 
                  type="number"
                  className="bg-transparent border-b-2 border-deep-olive w-32 focus:outline-none"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                />
              </div>
            ) : (
              `$${Number(product.price).toFixed(2)}`
            )}
          </div>

          <div className="space-y-4 border-t border-sage pt-8">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block italic">Description</label>
            {isEditing ? (
              <textarea 
                className="w-full bg-clay/5 border border-sage p-4 text-xs font-bold leading-relaxed focus:outline-none"
                rows={6}
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            ) : (
              <p className="text-xs font-bold leading-relaxed text-clay uppercase tracking-widest">
                {product.description || "NO DATA LOGGED FOR THIS SPECIFIC OBJECT. PREMIUM QUALITY GUARANTEED."}
              </p>
            )}
          </div>

          {isEditing ? (
            <PrimaryButton 
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full py-8 text-sm tracking-[0.3em] font-black uppercase flex items-center justify-center gap-4"
            >
              {updateMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> SYNC CHANGES</>}
            </PrimaryButton>
          ) : (
            <div className="space-y-6 pt-10">
              <div className="flex items-center border border-sage w-fit bg-bone">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-clay/10 transition-colors border-r border-sage"
                >
                  <Minus size={16} />
                </button>
                <span className="w-16 text-center font-black text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-clay/10 transition-colors border-l border-sage"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PrimaryButton 
                  onClick={handleBuyNow}
                  className="py-8 text-xs tracking-[0.2em] font-black uppercase flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={18} /> Buy Now
                </PrimaryButton>
                <button 
                  onClick={() => {
                    addItem({ id: product.id, name: product.name, price: Number(product.price) });
                    toast.success("ADDED TO COLLECTION");
                  }}
                  className="bg-sulfur text-deep-olive py-8 text-xs tracking-[0.2em] font-black uppercase flex items-center justify-center gap-3 border border-sage hover:bg-[#d9d78d] transition-colors"
                >
                  <Plus size={18} /> Add to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
