// import * as React from "react";

// import { cn } from "@/lib/utils";

// function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
//   return (
//     <textarea
//       data-slot="textarea"
//       className={cn(
//         "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
//         className,
//       )}
//       {...props}
//     />
//   );
// }

// export { Textarea };

import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full rounded-lg border border-black/20 bg-transparent px-2.5 py-2 text-base transition-all duration-200 outline-none resize-none placeholder:text-muted-foreground focus-visible:border-black/40 focus-visible:ring-0.5 focus-visible:ring-black/10 focus-visible:shadow-[0_0_10px_rgba(249,115,22,0.1)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 aria-invalid:shadow-destructive/20 md:text-sm dark:border-white/20 dark:bg-input/30 dark:focus-visible:border-white/40 dark:focus-visible:ring-white/10 dark:focus-visible:shadow-[0_0_15px_rgba(255,255,255,0.08)] dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
