import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-bone text-deep-olive p-6">
      <AuthForm type="login" />
      <div className="absolute bottom-10 text-[8px] font-bold uppercase tracking-[0.5em] text-clay">
        SYSTEM VERSION 1.0.4 — © 2026 ECOMMERCE CORP
      </div>
    </div>
  );
}
