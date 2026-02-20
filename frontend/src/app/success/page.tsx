"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/store";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    clearCart();

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, [clearCart]);

  if (!mounted) return null;

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center h-[90vh] flex flex-col items-center justify-center">
      <div className="mb-8 p-4 border border-sage rounded-full bg-sulfur text-deep-olive animate-bounce">
        <CheckCircle size={48} strokeWidth={3} />
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 italic">
        ORDER CONFIRMED.
      </h1>
      
      <p className="text-sm font-bold uppercase tracking-[0.4em] text-sage mb-16 max-w-lg mx-auto leading-loose">
        Your payment has been successfully processed. 
        A confirmation email will be dispatched shortly to your inbox. 
        Thank you for choosing ECOMMERCE.
      </p>

      <Link 
        href="/" 
        className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] bg-deep-olive text-bone px-10 py-6 hover:scale-95 transition-transform"
      >
        BACK TO COLLECTION <ArrowRight size={20} />
      </Link>
    </div>
  );
}
