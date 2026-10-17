"use client";

import { FileText, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IAiConversation } from "@/services/mediaContentManagement/aiConversation.service";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";

const ALLOWED_EXTENSIONS = ["txt", "docx", "pdf"];

function getFileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export interface AiConversationFormPayload {
  title?: string;
  content?: string;
  file?: File | null;
}

interface Props {
  initialData: IAiConversation | null;
  onClose: () => void;
  onSubmit: (payload: AiConversationFormPayload) => Promise<void>;
}

interface FormErrors {
  content?: string;
}

export default function AdminAiConversationFormModal({
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"editor" | "file">("editor");

  const hasExistingFile = Boolean(initialData?.fileType);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;

    if (selected) {
      const ext = getFileExtension(selected.name);
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setErrors((prev) => ({
          ...prev,
          content: "Only .txt, .docx, .pdf files are allowed",
        }));
        e.target.value = "";
        return;
      }
    }

    setFile(selected);
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim() || undefined,
        content: mode === "editor" ? content || undefined : undefined,
        file: mode === "file" ? file : null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-xl bg-white p-6 shadow-xl scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? "Edit AI Conversation" : "Add AI Conversation"}
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
              placeholder="Conversation title"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "editor" ? "default" : "outline"}
              onClick={() => setMode("editor")}
            >
              Write in Editor
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "file" ? "default" : "outline"}
              onClick={() => setMode("file")}
            >
              Upload File
            </Button>
          </div>

          {mode === "editor" ? (
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-slate-500">
                Content <span className="text-slate-400">(optional)</span>
              </Label>
              <TiptapEditor
                value={content}
                onChange={(val: string) => setContent(val)}
                minHeight="220px"
                maxHeight="400px"
                showWordCount
                showCharacterCount
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-slate-500">
                Upload File (.txt, .docx, .pdf){" "}
                <span className="text-slate-400">(optional)</span>
              </Label>

              {hasExistingFile && !file && (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    Currently attached:{" "}
                    <span className="font-medium uppercase">
                      {initialData?.fileType}
                    </span>{" "}
                    file
                  </span>
                </div>
              )}

              {!file ? (
                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-8 cursor-pointer hover:border-slate-300 transition-colors">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    {hasExistingFile
                      ? "Click to replace file"
                      : "Click to attach a file"}
                  </span>
                  <input
                    type="file"
                    accept=".txt,.docx,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <span className="text-sm text-slate-700 truncate">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {errors.content && (
                <p className="text-xs text-destructive">{errors.content}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Save Changes" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
