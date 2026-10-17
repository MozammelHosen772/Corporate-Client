"use client";

import { FileText, Loader2, Upload, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { IPoem } from "@/services/book/poem.service";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";

const ALLOWED_EXTENSIONS = ["txt", "docx", "pdf"];

function getFileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

interface FormErrors {
  title?: string;
  content?: string;
}

export interface EditPoemPayload {
  title: string;
  content?: string;
  file?: File | null;
}

interface Props {
  poem: IPoem;
  onSubmit: (payload: EditPoemPayload) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

export default function AdminEditPoemModal({
  poem,
  onSubmit,
  onClose,
  saving,
}: Props) {
  const [title, setTitle] = useState(poem.title);
  const [content, setContent] = useState(poem.content ?? "");
  const [errors, setErrors] = useState<FormErrors>({});

  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"editor" | "file">("editor");

  const hasExistingFile = useMemo(() => !!poem.fileType, [poem.fileType]);

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

  const handleSave = async () => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      title,
      content: mode === "editor" ? content : undefined,
      file: mode === "file" ? file : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Edit Poem</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-[300px] flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={
                errors.title
                  ? "border-destructive"
                  : "border-slate-200 focus-visible:ring-slate-400"
              }
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Mode switch */}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "editor" ? "default" : "outline"}
              onClick={() => {
                setMode("editor");
                setErrors((prev) => ({ ...prev, content: undefined }));
              }}
            >
              Write in Editor
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "file" ? "default" : "outline"}
              onClick={() => {
                setMode("file");
                setErrors((prev) => ({ ...prev, content: undefined }));
              }}
            >
              Upload File
            </Button>
          </div>

          {mode === "editor" ? (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Content
              </Label>
              {/* ✅ direct import, normal useState — no dynamic()/ssr:false, matches
                  the working ServiceDetail editor pattern */}
              <TiptapEditor
                value={content}
                onChange={(val: string) => setContent(val)}
                minHeight="220px"
                maxHeight="400px"
                showWordCount
                showCharacterCount
              />
              {errors.content && (
                <p className="text-xs text-destructive">{errors.content}</p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Upload File (.txt, .docx, .pdf)
              </Label>

              {hasExistingFile && !file && (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    Currently attached:{" "}
                    <span className="font-medium uppercase">
                      {poem.fileType}
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
                      : "Click to attach a file (optional)"}
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

              <p className="text-xs text-slate-500">
                Existing content will be kept if no new file is selected.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="bg-orange-500 text-white hover:bg-orange-600 min-w-[140px]"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Update Poem"}
          </Button>
        </div>
      </div>
    </div>
  );
}
