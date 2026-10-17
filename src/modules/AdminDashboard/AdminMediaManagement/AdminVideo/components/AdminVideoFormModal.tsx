"use client";

import { Label } from "@/components/ui/label";
import {
  IVideo,
  IVideoPayload,
} from "@/services/mediaContentManagement/video.service";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

interface Props {
  initialData: IVideo | null;
  onClose: () => void;
  onSubmit: (payload: IVideoPayload) => Promise<void>;
}

interface FormErrors {
  content?: string;
  youtubeUrl?: string;
}

export default function AdminVideoFormModal({
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.description ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!youtubeUrl.trim()) {
      nextErrors.youtubeUrl = "YouTube URL is required";
    }

    // Tiptap returns "<p></p>" for an empty editor, so strip tags before checking
    const plainContent = content.replace(/<[^>]*>/g, "").trim();
    if (!plainContent) {
      nextErrors.content = "Content is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim() || undefined,
        description: content,
        youtubeUrl: youtubeUrl.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="mb-4 flex items-center justify-between ">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditMode ? "Edit Video" : "Add Video"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              Content
            </Label>
            <TiptapEditor
              value={content}
              onChange={(val: string) => setContent(val)}
              minHeight="220px"
              maxHeight="400px"
              showWordCount
              showCharacterCount
            />
            {errors.content && (
              <p className="text-[0.75rem] text-destructive flex items-center gap-1">
                <span>⚠</span> {errors.content}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              YouTube URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
            />
            {errors.youtubeUrl && (
              <p className="mt-1 text-[0.75rem] text-destructive flex items-center gap-1">
                <span>⚠</span> {errors.youtubeUrl}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditMode ? "Save Changes" : "Add Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
