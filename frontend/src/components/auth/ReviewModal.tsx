"use client";

import { useState, useEffect } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PrimaryButton } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const iconTransition = { type: "spring", stiffness: 400, damping: 17 };

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: string; name: string };
  orderId: string;
  existingReview?: { id: string; rating: number; comment?: string } | null;
}

export const ReviewModal = ({ isOpen, onClose, product, orderId, existingReview }: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    } else {
      setRating(5);
      setComment("");
    }
  }, [existingReview, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (existingReview) {
        return axios.put(`${API_URL}/reviews/${existingReview.id}`, data, { withCredentials: true });
      }
      return axios.post(`${API_URL}/reviews`, data, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", product.id] });
      toast.success(existingReview ? "REVIEW SYNCHRONIZED" : "REVIEW AUTHENTICATED AND LOGGED");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "REVIEW SYNCHRONIZATION FAILURE");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-deep-olive/60 backdrop-blur-sm cursor-pointer"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-bone border border-sage p-12 max-w-lg w-full shadow-2xl text-deep-olive"
      >
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-start border-b border-sage pb-6">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">
                {existingReview ? "Edit Review" : "Rate Product"}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage mt-2">{product.name}</p>
            </div>
            <motion.button whileHover={{ rotate: 90 }} onClick={onClose} className="cursor-pointer text-sage">
              <X size={20} />
            </motion.button>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">01. RATING INTENSITY</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  transition={iconTransition}
                  onClick={() => setRating(star)}
                  className="cursor-pointer"
                >
                  <Star 
                    size={28} 
                    fill={star <= rating ? "#E6E49F" : "transparent"} 
                    className={star <= rating ? "text-sulfur" : "text-sage"} 
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">02. OBSERVATIONS (COMMENT)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="VERIFIED ACQUISITION FEEDBACK..."
              className="w-full bg-clay/5 border border-sage p-4 text-xs font-bold leading-relaxed focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={onClose}
              className="py-6 border border-sage text-[10px] font-black uppercase tracking-widest hover:bg-clay/10 transition-colors cursor-pointer"
            >
              Discard
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }}>
              <PrimaryButton 
                onClick={() => mutation.mutate({ productId: product.id, orderId, rating, comment })}
                disabled={mutation.isPending}
                className="w-full py-6 flex items-center justify-center gap-3 cursor-pointer"
              >
                {mutation.isPending ? <Loader2 className="animate-spin" size={16} /> : (existingReview ? "Update Entry" : "Submit Review")}
              </PrimaryButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
