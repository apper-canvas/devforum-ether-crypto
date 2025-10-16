import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white focus:ring-primary/20 shadow-sm hover:shadow-md transform hover:scale-[1.02]",
    secondary: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary/20 shadow-sm hover:shadow-md",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/20",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    accent: "bg-accent hover:bg-accent/90 text-white focus:ring-accent/20 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;