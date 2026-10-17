"use client";

import { Label } from "@/components/ui/label";
import {
  IMusic,
  TMusicType,
  uploadMusicAudio,
} from "@/services/mediaContentManagement/music.service";
import MediaUploader from "@/shared/mediaUploader/MediaUploader";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";
import { IUploadedMediaWithMeta } from "@/types/mediaUpload.interface";
import { Loader2, Music, Upload, X } from "lucide-react";
import { useState } from "react";

export interface MusicFormPayload {
  title?: string;
  description?: string;
  type?: TMusicType;
  youtubeUrl?: string;
  audioUrl?: string;
  publicId?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
}

interface Props {
  initialData: IMusic | null;
  onClose: () => void;
  onSubmit: (payload: MusicFormPayload) => Promise<void>;
}

export default function AdminMusicFormModal({
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [type, setType] = useState<TMusicType>(initialData?.type ?? "VIDEO");
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? "");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<{
    url: string;
    publicId: string;
  } | null>(
    initialData?.audioUrl && initialData?.publicId
      ? { url: initialData.audioUrl, publicId: initialData.publicId }
      : null,
  );

  const [thumbnails, setThumbnails] = useState<IUploadedMediaWithMeta[]>(
    initialData?.thumbnailUrl
      ? [
          {
            url: initialData.thumbnailUrl,
            publicId: initialData.thumbnailPublicId ?? "",
            name: "thumbnail",
            fileType: "image",
            resourceType: "image",
          },
        ]
      : [],
  );

  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudioFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setAudioFile(file);
    setError(null);
    setIsUploadingAudio(true);
    try {
      const uploaded = await uploadMusicAudio(file);
      setUploadedAudio(uploaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio upload failed");
      setAudioFile(null);
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (type === "VIDEO" && !youtubeUrl.trim()) {
      setError("YouTube URL is required");
      return;
    }
    if (type === "AUDIO" && !isEdit && !uploadedAudio) {
      setError("Please upload an audio file");
      return;
    }

    setIsSubmitting(true);
    try {
      const thumbnail = thumbnails[0];

      await onSubmit({
        title: title.trim() || undefined,
        description: description || undefined,
        type: isEdit ? undefined : type,
        youtubeUrl: type === "VIDEO" ? youtubeUrl.trim() : undefined,
        audioUrl: uploadedAudio?.url,
        publicId: uploadedAudio?.publicId,
        thumbnailUrl: thumbnail?.url,
        thumbnailPublicId: thumbnail?.publicId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? "Edit Music" : "Add Music"}
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
          {!isEdit && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("VIDEO")}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                  type === "VIDEO"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                Video (YouTube)
              </button>
              <button
                type="button"
                onClick={() => setType("AUDIO")}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                  type === "AUDIO"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                Audio File
              </button>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Music title"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              Description <span className="text-slate-400">(optional)</span>
            </Label>

            <TiptapEditor
              value={description}
              onChange={(val: string) => setDescription(val)}
              minHeight="180px"
              maxHeight="320px"
              showWordCount
              showCharacterCount
            />
          </div>

          {(isEdit ? initialData?.type : type) === "VIDEO" ? (
            <div>
              <Label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
                YouTube URL
              </Label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
              />
            </div>
          ) : (
            <>
              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-500">
                  Audio File{" "}
                  {!isEdit && <span className="text-red-500">*</span>}
                </Label>

                {uploadedAudio && !audioFile && isEdit && (
                  <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <Music className="h-4 w-4 text-slate-400" />
                    <audio
                      src={uploadedAudio.url}
                      controls
                      className="h-8 flex-1"
                    />
                  </div>
                )}

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500 hover:bg-slate-100">
                  {isUploadingAudio ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isUploadingAudio
                    ? "Uploading..."
                    : audioFile
                      ? audioFile.name
                      : uploadedAudio
                        ? "Replace audio file"
                        : "Choose audio file"}
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    disabled={isUploadingAudio}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-500">
                  Thumbnail <span className="text-slate-400">(optional)</span>
                </Label>
                <MediaUploader
                  key={thumbnails.length === 0 ? "empty" : "filled"}
                  uploadType="image"
                  multiple={false}
                  label="Upload Thumbnail"
                  required={false}
                  max="1mb"
                  defaultValue={thumbnails}
                  onChange={setThumbnails}
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-[0.75rem] text-destructive flex items-center gap-1">
              <span>⚠</span> {error}
            </p>
          )}

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
              disabled={isSubmitting || isUploadingAudio}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Music"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
