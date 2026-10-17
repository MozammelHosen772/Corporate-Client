"use client";

import { Label } from "@/components/ui/label";
import { IAudio } from "@/services/mediaContentManagement/audio.service";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";
import { Loader2, Music, UploadCloud, X } from "lucide-react";
import { useState } from "react";

export interface AudioFormPayload {
  title?: string;
  description?: string;
}

interface Props {
  initialData: IAudio | null;
  onClose: () => void;
  onSubmit: (payload: AudioFormPayload, file: File | null) => Promise<void>;
}

interface FormErrors {
  content?: string;
  file?: string;
}

export default function AdminAudioFormModal({
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    const plainContent = content.replace(/<[^>]*>/g, "").trim();
    if (!plainContent) {
      nextErrors.content = "Content is required";
    }

    // A file is only mandatory when creating a brand-new audio entry
    if (!isEditMode && !file) {
      nextErrors.file = "Please choose an audio file";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(
        {
          title: title.trim() || undefined,
          description: content,
        },
        file,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditMode ? "Edit Audio" : "Add Audio"}
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
              placeholder="Audio title"
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
              minHeight="180px"
              maxHeight="320px"
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
            <Label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Audio File{" "}
              {!isEditMode && <span className="text-red-500">*</span>}
            </Label>

            {isEditMode && initialData?.audioUrl && !file && (
              <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <Music className="h-4 w-4 text-slate-400" />
                <audio
                  src={initialData.audioUrl}
                  controls
                  className="h-8 flex-1"
                />
              </div>
            )}

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500 hover:bg-slate-100">
              <UploadCloud className="h-4 w-4" />
              {file
                ? file.name
                : isEditMode
                  ? "Replace audio file"
                  : "Choose audio file"}
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {errors.file && (
              <p className="mt-1 text-[0.75rem] text-destructive flex items-center gap-1">
                <span>⚠</span> {errors.file}
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
              {isEditMode ? "Save Changes" : "Add Audio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
