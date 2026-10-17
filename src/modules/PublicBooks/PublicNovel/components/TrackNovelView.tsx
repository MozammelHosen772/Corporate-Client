// "use client";

// import { incrementNovelViews } from "@/services/book/novel.service";
// import { Eye } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// // ─── Tracked ids (module-level, session-লাইফটাইম) ──────────────────────────
// const tracked = new Set<string>();

// interface Props {
//   id: string;
//   initialViews: number;
// }

// export default function TrackNovelView({ id, initialViews }: Props) {
//   const router = useRouter();
//   const [views, setViews] = useState(initialViews);

//   // ─── initialViews বদলালে views sync করা — effect না, render-এর সময়েই ───
//   const [prevInitialViews, setPrevInitialViews] = useState(initialViews);
//   if (initialViews !== prevInitialViews) {
//     setPrevInitialViews(initialViews);
//     setViews((current) => Math.max(current, initialViews));
//   }

//   // ─── View increment (once per session per novel) ────────────────────────
//   useEffect(() => {
//     const storageKey = `novel-view:${id}`;

//     if (tracked.has(id)) return;
//     if (sessionStorage.getItem(storageKey)) {
//       tracked.add(id);
//       return;
//     }

//     tracked.add(id);

//     void incrementNovelViews(id)
//       .then((nextViews) => {
//         sessionStorage.setItem(storageKey, "1");
//         setViews(nextViews);
//         router.refresh();
//       })
//       .catch(() => {
//         tracked.delete(id);
//       });
//   }, [id, router]);

//   return (
//     <div className="flex items-center gap-2">
//       <Eye className="h-4 w-4" />
//       <span>{Number(views ?? 0).toLocaleString()} views</span>
//     </div>
//   );
// }
"use client";

import { Eye } from "lucide-react";

interface Props {
  views: number;
}

export default function TrackNovelView({ views }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Eye className="h-4 w-4" />
      <span>{Number(views ?? 0).toLocaleString()} views</span>
    </div>
  );
}
