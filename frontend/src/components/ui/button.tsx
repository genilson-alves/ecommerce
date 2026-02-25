import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "bg-deep-olive text-bone px-8 py-3 font-bold uppercase tracking-widest text-[10px] transition-all duration-300 hover:bg-black hover:scale-[0.98] active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-deep-olive/5",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
PrimaryButton.displayName = "PrimaryButton";

export { PrimaryButton };
