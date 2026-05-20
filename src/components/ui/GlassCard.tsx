import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  hoverEffect?: boolean;
  children?: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -5, scale: 1.01 } : {}}
        className={cn(
          "glass-card p-6 overflow-hidden relative",
          hoverEffect && "transition-shadow hover:shadow-[0_15px_40px_rgba(14,165,233,0.15)]",
          className
        )}
        {...props}
      >
        {/* Subtle internal glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-xl" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
