"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface Props {
  url: string;
  title: string;
}

export default function PublicBlogShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6B73]">
        Share
      </span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#14181C]/15 text-[#5B6B73] transition-colors hover:border-[#1877F2] hover:bg-[#1877F2]/5 hover:text-[#1877F2]"
      >
        <FacebookIcon className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#14181C]/15 text-[#5B6B73] transition-colors hover:border-[#14181C] hover:bg-[#14181C]/5 hover:text-[#14181C]"
      >
        <XIcon className="h-3.5 w-3.5" />
      </a>
      <button
        onClick={handleCopy}
        aria-label={copied ? "Link copied!" : "Copy link"}
        title={copied ? "Copied!" : "Copy link"}
        className={`flex h-7 w-7 items-center justify-center rounded-sm border transition-colors ${
          copied
            ? "border-green-400 bg-green-50 text-green-500"
            : "border-[#14181C]/15 text-[#5B6B73] hover:border-[#C9742C] hover:bg-[#C9742C]/5 hover:text-[#C9742C]"
        }`}
      >
        <Link2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
