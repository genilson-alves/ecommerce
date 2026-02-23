"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useAuth } from "@/lib/store";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const response = await axios.post(`${API_URL}/users/login`, data);
      
      const { user, token } = response.data;
      
      setAuth(user, token);
      
      if (user.role === 'ADMIN') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "AUTHENTICATION FAILURE");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-bone text-deep-olive">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-12">
          <div className="flex flex-col items-center gap-4 text-center">
             <div className="bg-deep-olive text-bone p-3 rounded-xl mb-4">
               <Globe size={32} />
             </div>
             <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
               ACCESS <br/>ECOMMERCE
             </h1>
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">Secure Authentication Required</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">01. IDENTIFICATION (EMAIL)</label>
              <input
                {...register("email")}
                className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30"
                placeholder="EMAIL@DOMAIN.COM"
              />
              {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage block">02. VERIFICATION (PASSWORD)</label>
              <input
                type="password"
                {...register("password")}
                className="w-full bg-bone border-b-2 border-sage p-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30"
                placeholder="********"
              />
              {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-4">
                 <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{error}</p>
              </div>
            )}

            <PrimaryButton type="submit" disabled={isSubmitting} className="w-full py-8 text-sm tracking-[0.3em] font-black uppercase flex items-center justify-center gap-4">
              {isSubmitting ? "AUTHORIZING..." : (
                <>AUTHORIZE SESSION <ArrowRight size={20} /></>
              )}
            </PrimaryButton>
          </form>

          <div className="text-center">
             <a href="/" className="text-[10px] font-bold uppercase tracking-widest text-sage underline underline-offset-8 hover:text-deep-olive transition-colors italic">Return to Marketplace</a>
          </div>
        </div>
      </div>
      
      <div className="p-8 border-t border-sage text-center">
         <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-clay">SYSTEM VERSION 1.0.4 — © 2026 ECOMMERCE CORP</p>
      </div>
    </div>
  );
}
