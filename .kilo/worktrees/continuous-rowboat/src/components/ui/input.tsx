// import * as React from "react";

// import { cn } from "@/lib/utils";

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "h-10 w-full min-w-0 rounded-lg border border-black/20 bg-transparent px-2.5 py-1 text-base transition-all duration-200 outline-none  file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-black/40 focus-visible:ring-0.5 focus-visible:ring-black/10 focus-visible:shadow-[0_0_10px_rgba(249,115,22,0.1)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 aria-invalid:shadow-destructive/20 md:text-sm dark:border-white/20 dark:bg-input/30 dark:focus-visible:border-white/40 dark:focus-visible:ring-white/10 dark:focus-visible:shadow-[0_0_15px_rgba(255,255,255,0.08)] dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
//         className,
//       )}
//       {...props}
//     />
//   );
// }

// export { Input };
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-black/20 bg-transparent px-2.5 py-1 text-base transition-all duration-200 outline-none  file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-black/40 focus-visible:ring-0.5 focus-visible:ring-black/10 focus-visible:shadow-[0_0_10px_rgba(249,115,22,0.1)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:border-white/20 dark:bg-input/30 dark:focus-visible:border-white/40 dark:focus-visible:ring-white/10 dark:focus-visible:shadow-[0_0_15px_rgba(255,255,255,0.08)] dark:disabled:bg-input/80",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
