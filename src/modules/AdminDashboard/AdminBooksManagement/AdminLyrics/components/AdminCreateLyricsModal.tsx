"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";

const ALLOWED_EXTENSIONS = ["txt", "docx", "pdf"];

function getFileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

interface FormErrors {
  title?: string;
  content?: string;
}

export interface CreateLyricsPayload {
  title: string;
  content?: string;
  file?: File | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateLyricsPayload) => Promise<void>;
  saving: boolean;
}

export default function AdminCreateLyricsModal({
  open,
  onOpenChange,
  onSubmit,
  saving,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"editor" | "file">("editor");

  const resetLocal = () => {
    setTitle("");
    setContent("");
    setErrors({});
    setFile(null);
    setMode("editor");
  };

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

    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";

    if (mode === "editor") {
      if (!content.trim()) newErrors.content = "Content is required";
    } else {
      if (!file) newErrors.content = "Please select a file (.txt, .docx, .pdf)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      title,
      content: mode === "editor" ? content : undefined,
      file: mode === "file" ? file : null,
    });

    resetLocal();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetLocal();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Lyrics</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              Title <span className="text-destructive ml-0.5">*</span>
            </Label>
            <Input
              placeholder="Lyrics title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-[0.75rem] text-destructive flex items-center gap-1">
                <span>⚠</span> {errors.title}
              </p>
            )}
          </div>

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
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-slate-500">
                Upload File (.txt, .docx, .pdf)
              </Label>

              {!file ? (
                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-8 cursor-pointer hover:border-slate-300 transition-colors">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    Click to select a file
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
                <p className="text-[0.75rem] text-destructive flex items-center gap-1">
                  <span>⚠</span> {errors.content}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="min-w-[140px]">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create Lyrics"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
