"use client";

import { Label } from "@/components/ui/label";
import { IIdeaBrighter } from "@/services/mediaContentManagement/ideaBrighter.service";

import MediaUploader from "@/shared/mediaUploader/MediaUploader";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";
import { IUploadedMediaWithMeta } from "@/types/mediaUpload.interface";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

export interface AiExploreFormPayload {
  title?: string;
  description?: string;
  imageUrl?: string;
  publicId?: string;
}

interface Props {
  initialData: IIdeaBrighter | null;
  onClose: () => void;
  onSubmit: (payload: AiExploreFormPayload) => Promise<void>;
}

export default function AdminAiExploreFormModal({
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  const [uploadedImages, setUploadedImages] = useState<
    IUploadedMediaWithMeta[]
  >(
    initialData?.imageUrl
      ? [
          {
            url: initialData.imageUrl,
            publicId: initialData.publicId ?? "",
            name: initialData.imageUrl.split("/").pop() || "image",
            fileType: "image",
            resourceType: "image",
          },
        ]
      : [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const uploaded = uploadedImages[0];
      await onSubmit({
        title: title.trim() || undefined,
        description: content || undefined,
        imageUrl: uploaded?.url,
        publicId: uploaded?.publicId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditMode ? "Edit AI Explore Item" : "Add AI Explore Item"}
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
              Title <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="AI Explore title"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              Description / Prompt{" "}
              <span className="text-slate-400">(optional)</span>
            </Label>
            <TiptapEditor
              value={content}
              onChange={(val: string) => setContent(val)}
              minHeight="150px"
              maxHeight="300px"
              showWordCount
              showCharacterCount
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-500">
              Image <span className="text-slate-400">(optional)</span>
            </Label>
            <MediaUploader
              key={uploadedImages.length === 0 ? "empty" : "filled"}
              uploadType="image"
              multiple={false}
              label="Upload Image"
              required={false}
              max="1mb"
              defaultValue={uploadedImages}
              onChange={setUploadedImages}
            />
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
              {isEditMode ? "Save Changes" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
