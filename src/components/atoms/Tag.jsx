import { cn } from "@/utils/cn";

const Tag = ({ children, variant = "default", className, onClick, ...props }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    primary: "bg-primary/10 text-primary hover:bg-primary/20",
    accent: "bg-accent/10 text-accent hover:bg-accent/20"
  };
  
  const clickableStyles = onClick ? "cursor-pointer hover:scale-105" : "";
  
  return (
    <span
      className={cn(baseStyles, variants[variant], clickableStyles, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </span>
  );
};

export default Tag;