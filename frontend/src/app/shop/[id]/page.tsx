"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { PrimaryButton } from "@/components/ui/button";
import { Loader2, ArrowLeft, Edit2, Save, X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function ProductContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [editForm, setEditForm] = useState<any>(null);
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    },
    enabled: !!id,
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

  useEffect(() => {
    if (product && !editForm) {
      setEditForm({ ...product });
    }
    if (product && searchParams.get("buy") === "true") {
      setShowBuyConfirm(true);
    }
  }, [product, searchParams]);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-bone"><Loader2 className="animate-spin text-sage" size={48} /></div>;
  if (isError || !product) return (
    <div className="h-screen flex flex-col items-center justify-center bg-bone gap-6 text-center p-6">
      <h1 className="text-4xl font-black uppercase tracking-tighter italic text-deep-olive">Product Not Found</h1>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage">Verify Identification Code: {id}</p>
      <button onClick={() => router.push("/shop")} className="text-xs font-bold uppercase tracking-widest underline underline-offset-8 text-sage hover:text-deep-olive transition-colors">Return to Collection</button>
    </div>
  );

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
    
    setIsCheckingOut(true);
    try {
      await axios.post(`${API_URL}/orders`, {
        items: [{ productId: product.id, quantity }]
      }, { withCredentials: true });
      
      toast.success("ORDER PLACED SUCCESSFULLY");
      router.push("/orders");
    } catch (error) {
      toast.error("PURCHASE FAILED");
    } finally {
      setIsCheckingOut(false);
      setShowBuyConfirm(false);
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
              className="absolute top-8 right-8 bg-deep-olive text-bone p-4 hover:bg-black transition-colors z-10"
            >
              {isEditing ? <X size={20} /> : <Edit2 size={20} />}
            </button>
          )}
        </div>

        <div className="md:col-span-5 flex flex-col justify-center space-y-10">
          <div className="space-y-4">
            {isEditing ? (
              <input 
                className="text-6xl font-black uppercase tracking-tighter italic bg-transparent border-b-2 border-deep-olive w-full focus:outline-none"
                value={editForm?.name || ""}
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
                  value={editForm?.category || ""}
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
                  value={editForm?.price || 0}
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
                value={editForm?.description || ""}
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
                  onClick={() => setShowBuyConfirm(true)}
                  className="py-8 text-xs tracking-[0.2em] font-black uppercase flex items-center justify-center gap-3 shadow-lg shadow-deep-olive/10"
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

      <AnimatePresence>
        {showBuyConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuyConfirm(false)}
              className="absolute inset-0 bg-deep-olive/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-bone border border-sage p-12 max-w-lg w-full shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-8">
                <div className="p-4 bg-sulfur border border-sage rounded-full animate-pulse">
                  <ShoppingBag size={32} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Confirm Acquisition</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage">
                    You are about to acquire {quantity}x {product.name} for ${(Number(product.price) * quantity).toFixed(2)}.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full pt-8">
                  <button 
                    onClick={() => setShowBuyConfirm(false)}
                    className="py-6 border border-sage text-[10px] font-black uppercase tracking-widest hover:bg-clay/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <PrimaryButton 
                    onClick={handleBuyNow}
                    disabled={isCheckingOut}
                    className="py-6 flex items-center justify-center gap-3"
                  >
                    {isCheckingOut ? <Loader2 className="animate-spin" size={16} /> : "Authorize"}
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-bone"><Loader2 className="animate-spin text-sage" size={48} /></div>}>
      <ProductContent />
    </Suspense>
  );
}
