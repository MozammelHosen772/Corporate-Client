import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function SectionHeading({
  title,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-6 rounded-full bg-[#f97316]" />
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {title}
        </h2>
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="hidden items-center gap-1.5 text-sm font-semibold text-[#f97316] hover:text-[#ea6c0b] sm:inline-flex"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
