"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Plus, Search, Tag, X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const META_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 160;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SeoValues {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[]; // array of strings
}

interface SeoPageProps {
  value: SeoValues;
  onChange: (values: SeoValues) => void;
}

// ─── Info Tooltip ─────────────────────────────────────────────────────────────
function InfoTip({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-56 text-xs">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Character Counter ────────────────────────────────────────────────────────
function CharCounter({
  current,
  max,
  label,
}: {
  current: number;
  max: number;
  label: string;
}) {
  const pct = (current / max) * 100;
  const isOver = current > max;
  const isNear = pct >= 80 && !isOver;

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          isOver
            ? "font-medium text-destructive"
            : isNear
              ? "font-medium text-amber-500"
              : "text-muted-foreground"
        }
      >
        {current} / {max}
      </span>
    </div>
  );
}

// ─── Keyword Input ────────────────────────────────────────────────────────────
interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

function KeywordInput({ keywords, onChange }: KeywordInputProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed || keywords.includes(trimmed)) return;
    onChange([...keywords, trimmed]);
    setInput("");
  };

  const remove = (kw: string) => onChange(keywords.filter((k) => k !== kw));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
    if (e.key === "Backspace" && !input && keywords.length) {
      remove(keywords[keywords.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="keyword লিখে Enter বা comma দিন"
            className="pl-8 text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          disabled={!input.trim()}
          aria-label="Add keyword"
          className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

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

      <p className="text-xs text-muted-foreground">
        {keywords.length} keyword{keywords.length !== 1 ? "s" : ""} added
      </p>
    </div>
  );
}

// ─── Main SeoPage Component ───────────────────────────────────────────────────
export default function SeoMetaDataPage({ value, onChange }: SeoPageProps) {
  const update = (patch: Partial<SeoValues>) =>
    onChange({ ...value, ...patch });

  const isTitleOver = value.metaTitle.length > META_TITLE_MAX;
  const isDescOver = value.metaDescription.length > META_DESCRIPTION_MAX;

  return (
    <section className="p-2 md:p-5">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
              <Search className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">
                SEO & Meta Information
              </CardTitle>
              <CardDescription className="text-xs">
                Search engine এ কিভাবে দেখাবে তা নিয়ন্ত্রণ করুন
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* ── Meta Title ── */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="seo-meta-title" className="text-sm font-semibold">
                Meta Title
              </Label>
              <InfoTip text="Browser tab ও search result এ যে title দেখায়। সর্বোচ্চ 60 character রাখুন।" />
            </div>
            <Input
              id="seo-meta-title"
              value={value.metaTitle}
              onChange={(e) => update({ metaTitle: e.target.value })}
              placeholder="e.g. About Us | IMechnanic"
              className={
                isTitleOver
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            <CharCounter
              current={value.metaTitle.length}
              max={META_TITLE_MAX}
              label="Ideal: 50–60 characters"
            />
          </div>
          {/* ── Meta Description ── */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="seo-meta-desc" className="text-sm font-semibold">
                Meta Description
              </Label>
              <InfoTip text="Search result এ title এর নিচে যে সংক্ষিপ্ত বিবরণ দেখায়। সর্বোচ্চ 160 character রাখুন।" />
            </div>
            <Textarea
              id="seo-meta-desc"
              value={value.metaDescription}
              onChange={(e) => update({ metaDescription: e.target.value })}
              placeholder="e.g. IMechnanic সম্পর্কে জানুন — আমাদের লক্ষ্য, মিশন এবং দল।"
              rows={3}
              className={isDescOver ? "resize-none  " : "resize-none"}
            />
            <CharCounter
              current={value.metaDescription.length}
              max={META_DESCRIPTION_MAX}
              label="Ideal: 120–160 characters"
            />
          </div>
          {/* ── Meta Keywords ── */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-semibold">Meta Keywords</Label>
              <InfoTip text="Search engine keyword। Enter বা comma চেপে একেকটি keyword যোগ করুন।" />
            </div>
            <KeywordInput
              keywords={value.metaKeywords}
              onChange={(kws) => update({ metaKeywords: kws })}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
