import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const TextArea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-vertical",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;