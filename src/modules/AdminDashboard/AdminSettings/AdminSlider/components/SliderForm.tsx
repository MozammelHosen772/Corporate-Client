"use client";

import { ImageIcon, Loader2, RefreshCw, Save } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createSlider,
  TPosition,
} from "@/services/settings/bannerSlider.service";
import PositionToggle from "./PositionToggle";

interface Props {
  onSuccess: () => void;
}

export default function SliderForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [position, setPosition] = useState<TPosition>("center");
  const [link, setLink] = useState("");

  // ─── File preview ──────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  // ─── Reset ─────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setTitle("");
    setIsActive(true);
    setFile(null);
    setPreview(null);
    setPosition("center");
    setLink("");
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!file) return toast.error("Slider image is required");

    const toastId = toast.loading("Uploading slider image...");
    try {
      setLoading(true);
      await createSlider({ title, isActive, position, link, file });
      toast.success("Slider created successfully", { id: toastId });
      resetForm();
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
        { id: toastId },
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Card className="border-slate-200 shadow-sm ">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-slate-700">Add New Slider</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 ">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Enter slider title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-slate-200 focus-visible:ring-slate-400"
            />
          </div>

          {/* Link */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Link{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              placeholder="https://example.com/product"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border-slate-200 focus-visible:ring-slate-400"
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-slate-700">
            Banner Image <span className="text-red-500">*</span>
          </Label>
          <label className="group flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-slate-300 p-4 transition hover:border-slate-400 hover:bg-slate-50">
            {preview ? (
              <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg border">
                <Image
                  src={preview}
                  alt="preview"
                  fill
                  sizes="(max-width: 768px) 80px, 112px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition">
                <ImageIcon className="h-6 w-6 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700">
                {file ? file.name : "Choose slider image"}
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: 1689 × 600px · PNG, JPG, WEBP
              </p>
            </div>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Status</Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${isActive ? "bg-emerald-500" : "bg-slate-200"}`}
                >
                  <div
                    className={`h-4 w-4 transform rounded-full bg-white shadow transition-transform mt-0.5 ${isActive ? "translate-x-4 ml-0.5" : "translate-x-0.5"}`}
                  />
                </div>
              </div>
              <span className="text-sm text-slate-600">
                {isActive ? (
                  <span className="font-medium text-emerald-600">
                    Active — visible on homepage
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Inactive — hidden from homepage
                  </span>
                )}
              </span>
            </label>
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Content Position
            </Label>
            <PositionToggle value={position} onChange={setPosition} />
            <p className="text-xs text-muted-foreground">
              Where overlay text sits on the banner
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={resetForm}
            className="border-slate-200 text-slate-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Slider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
