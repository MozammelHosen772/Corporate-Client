"use client";

import { Plus, Tag, X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Types ─────────────────────────────────────────────────────────────
interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

// ─── Helper: normalize tag ─────────────────────────────────────────────
const normalize = (tag: string) =>
  tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// ─── Component ─────────────────────────────────────────────────────────
export function TagsInput({ keywords, onChange }: KeywordInputProps) {
  const [input, setInput] = useState("");

  // ➕ Add tag
  const add = () => {
    const cleaned = normalize(input);

    if (!cleaned || keywords.includes(cleaned)) return;

    onChange([...keywords, cleaned]);
    setInput("");
  };

  // ❌ Remove tag
  const remove = (kw: string) => {
    onChange(keywords.filter((k) => k !== kw));
  };

  // ⌨️ Keyboard handler
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }

    if (e.key === "Backspace" && input === "" && keywords.length > 0) {
      remove(keywords[keywords.length - 1]);
    }
  };

  // 📋 Paste multiple tags support
  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const text = e.clipboardData.getData("text");

    const newTags = text
      .split(",")
      .map(normalize)
      .filter((t) => t && !keywords.includes(t));

    if (newTags.length) {
      onChange([...keywords, ...newTags]);
    }
  };

  return (
    <div className="space-y-2">
      {/* INPUT + BUTTON */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder="Type tag, press Enter or comma"
            className="pl-8 text-sm"
          />
        </div>

        <Button type="button" size="sm" onClick={add} disabled={!input.trim()}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {/* TAGS LIST */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw) => (
            <Badge
              key={kw}
              variant="secondary"
              className="gap-1 pr-1 text-xs font-normal"
            >
              {kw}

              <button
                type="button"
                onClick={() => remove(kw)}
                aria-label={`Remove ${kw}`}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* COUNT */}
      <p className="text-xs text-muted-foreground">
        {keywords.length} tag{keywords.length !== 1 ? "s" : ""} added
      </p>
    </div>
  );
}
