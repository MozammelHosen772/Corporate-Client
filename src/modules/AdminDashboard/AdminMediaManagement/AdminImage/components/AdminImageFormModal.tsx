"use client";

import { Label } from "@/components/ui/label";
import { IImage } from "@/services/mediaContentManagement/image.service";
import MediaUploader from "@/shared/mediaUploader/MediaUploader";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";
import { IUploadedMediaWithMeta } from "@/types/mediaUpload.interface";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

export interface ImageFormSubmitPayload {
  title?: string;
  description?: string;
  imageUrl?: string;
  publicId?: string;
}

interface Props {
  initialData: IImage | null;
  onClose: () => void;
  onSubmit: (payload: ImageFormSubmitPayload) => Promise<void>;
}

interface FormErrors {
  content?: string;
  file?: string;
}

export default function AdminImageFormModal({
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.description ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  // ✅ MediaUploader নিজেই backend-এর generic /upload-image endpoint হিট করে
  // Cloudinary-তে আপলোড করে দেয় — শুধু ফলাফলটা এখানে ধরে রাখছি
  const [uploadedImages, setUploadedImages] = useState<
    IUploadedMediaWithMeta[]
  >(
    initialData?.imageUrl
      ? [
          {
            url: initialData.imageUrl,
            publicId: initialData.publicId,
            name: initialData.imageUrl.split("/").pop() || "image",
            fileType: "image",
            resourceType: "image",
          },
        ]
      : [],
  );

  const validate = () => {
    const nextErrors: FormErrors = {};

    const plainContent = content.replace(/<[^>]*>/g, "").trim();
    if (!plainContent) {
      nextErrors.content = "Content is required";
    }

    // নতুন image তৈরির সময় ছবি থাকতেই হবে
    if (!isEditMode && uploadedImages.length === 0) {
      nextErrors.file = "Please upload an image";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const uploaded = uploadedImages[0];

      await onSubmit({
        title: title.trim() || undefined,
        description: content,
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
            {isEditMode ? "Edit Image" : "Add Image"}
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
              placeholder="Image title"
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
            <Label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-500">
              Image {!isEditMode && <span className="text-red-500">*</span>}
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
            {errors.file && (
              <p className="mt-1.5 text-[0.75rem] text-destructive flex items-center gap-1">
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
              {isEditMode ? "Save Changes" : "Add Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
