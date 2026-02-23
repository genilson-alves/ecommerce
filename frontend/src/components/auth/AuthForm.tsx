"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { PrimaryButton } from "@/components/ui/button";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  type: "login" | "register";
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    const endpoint = type === "login" ? "/auth/login" : "/auth/register";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // Required for cookies
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Authentication failed");
      }

      if (type === "login") {
        setAuth(result.user);
        toast.success("Login successful. Redirecting...");
        router.push("/");
      } else {
        toast.success("Registration successful. Please login.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none italic">
          {type === "login" ? "ACCESS SESSION" : "CREATE ACCOUNT"}
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">
          ECOMMERCE SECURE SYSTEM
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">01. IDENTIFICATION</label>
            <input
              {...register("email")}
              className="w-full bg-bone border border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30"
              placeholder="email@domain.com"
            />
            {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase italic mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">02. VERIFICATION</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full bg-bone border border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive transition-colors placeholder:text-sage/30 pr-12"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sage hover:text-deep-olive"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase italic mt-1">{errors.password.message}</p>}
          </div>
        </div>

        <PrimaryButton type="submit" disabled={loading} className="w-full py-8 text-sm tracking-[0.3em] font-black uppercase flex items-center justify-center gap-4">
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>CONFIRM {type === "login" ? "AUTH" : "ENTRY"}</>
          )}
        </PrimaryButton>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => router.push(type === "login" ? "/register" : "/login")}
            className="text-[10px] font-bold uppercase tracking-widest text-sage underline underline-offset-8 hover:text-deep-olive transition-colors italic"
          >
            {type === "login" ? "New here? Register entry" : "Already registered? Access session"}
          </button>
        </div>
      </form>
    </div>
  );
};
