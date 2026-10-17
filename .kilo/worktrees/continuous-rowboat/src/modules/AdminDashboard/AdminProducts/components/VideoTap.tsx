"use client";

import { CheckCircle, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  getProductVideo,
  removeProductVideo,
  saveProductVideo,
} from "@/services/products/productsVideo.service";

function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  if (url.match(/\.(mp4|webm|ogg)$/i)) return url;

  return null;
}

export default function VideoTab({ productId }: { productId: string }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const embedUrl = getEmbedUrl(videoUrl);

  // ─── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    getProductVideo(productId)
      .then((data) => {
        if (data.videoUrl) setVideoUrl(data.videoUrl);
      })
      .catch(() => toast.error("Failed to load video"));
  }, [productId]);

  // ─── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);
      await saveProductVideo(productId, { videoUrl });
      toast.success("Video link saved");
    } catch {
      toast.error("Failed to save video link");
    } finally {
      setSaving(false);
    }
  };

  // ─── Remove ───────────────────────────────────────────────────────────────────
  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeProductVideo(productId);
      setVideoUrl("");
      toast.success("Video removed");
    } catch {
      toast.error("Failed to remove video");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <source className="h-4 w-4 text-red-500" />
          Product Video
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Video URL
          </Label>
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="h-10 text-sm"
          />
          <p className="text-xs text-slate-400">
            YouTube, Vimeo, বা direct video link দাও
          </p>
        </div>

        {/* Preview */}
        {embedUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            {embedUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video controls className="w-full max-h-[280px]">
                <source src={embedUrl} />
              </video>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-[280px]"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
          </div>
        )}

        {/* Invalid URL warning */}
        {videoUrl && !embedUrl && (
          <p className="text-xs text-red-500">
            Valid YouTube, Vimeo, বা direct video URL দাও
          </p>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={removing || !videoUrl}
            onClick={handleRemove}
            className="gap-2 h-9 px-5"
          >
            {removing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Remove
              </>
            )}
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving || !embedUrl}
            className="bg-orange-500 hover:bg-orange-600 gap-2 h-9 px-5"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
