"use client";

import { FileText, Loader2, Upload, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ILyrics } from "@/services/book/lyrics.service";

const TiptapEditor = dynamic(
  () => import("@/shared/tiptapEditor/tip-tap-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] animate-pulse rounded-xl bg-slate-100" />
    ),
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LyricsFormPayload {
  title: string;
  content?: string;
  file?: File | null;
}

interface FormErrors {
  title?: string;
  content?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ILyrics | null;
  onSubmit: (payload: LyricsFormPayload) => Promise<void>;
  saving: boolean;
}

const ALLOWED_EXTENSIONS = ["txt", "docx", "pdf"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildInitialValues(data?: ILyrics | null) {
  return {
    title: data?.title ?? "",
    // ✅ content সবসময় pre-fill হবে — সোর্স file হোক বা editor হোক,
    // ব্যাকএন্ডে extract হয়ে এটা plain text/JSON হিসেবে সেভ থাকে
    content: data?.content ?? "",
  };
}

function getFileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

// ─── Inner Form (key দিয়ে remount হবে, তাই useEffect লাগছে না) ─────────────────
function LyricsFormBody({
  initialData,
  onSubmit,
  saving,
  onCancel,
}: {
  initialData?: ILyrics | null;
  onSubmit: (payload: LyricsFormPayload) => Promise<void>;
  saving: boolean;
  onCancel: () => void;
}) {
  const isEdit = !!initialData;

  // মাউন্ট হওয়ার সময়েই সঠিক initial state — effect লাগছে না
  const [values, setValues] = useState(buildInitialValues(initialData));
  const [errors, setErrors] = useState<FormErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);

  // ✅ default সবসময় "editor" — edit-এ existing content দেখা/এডিট করা যাবে
  const [mode, setMode] = useState<"editor" | "file">("editor");

  const set = useCallback((key: "title" | "content", value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

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
    setRemoveExistingFile(false);
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const handleRemoveFile = () => setFile(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!values.title.trim()) newErrors.title = "Title is required";

    if (mode === "editor") {
      if (!values.content.trim() && !isEdit) {
        newErrors.content = "Content is required";
      }
    } else {
      if (!file && !isEdit) {
        newErrors.content = "Please select a file (.txt, .docx, .pdf)";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      title: values.title,
      content: mode === "editor" ? values.content : undefined,
      file: mode === "file" ? file : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-slate-500">
          Title <span className="text-destructive ml-0.5">*</span>
        </Label>
        <Input
          placeholder="Lyrics title"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
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
            value={values.content}
            onChange={(v: string) => set("content", v)}
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

          {/* ✅ Edit-এ existing file থাকলে সেটার info দেখাবে */}
          {isEdit && initialData?.fileType && !file && !removeExistingFile && (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Currently attached:{" "}
                  <span className="font-medium uppercase">
                    {initialData.fileType}
                  </span>{" "}
                  file
                </span>
              </div>
            </div>
          )}

          {!file ? (
            <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-8 cursor-pointer hover:border-slate-300 transition-colors">
              <Upload className="h-6 w-6 text-slate-400" />
              <span className="text-sm text-slate-500">
                {isEdit && initialData?.fileType
                  ? "Click to replace file"
                  : isEdit
                    ? "Click to attach a file (optional)"
                    : "Click to select a file"}
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
                onClick={handleRemoveFile}
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

          {isEdit && !file && (
            <p className="text-xs text-slate-500">
              Existing content will be kept if no new file is selected.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
          ) : isEdit ? (
            "Update Lyrics"
          ) : (
            "Create Lyrics"
          )}
        </Button>
      </div>
    </form>
  );
}

// ─── Outer Modal Wrapper ────────────────────────────────────────────────────
export default function LyricsFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  saving,
}: Props) {
  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Lyrics" : "Create Lyrics"}</DialogTitle>
        </DialogHeader>

        {/* key বদলে গেলে পুরো ফর্ম fresh state নিয়ে remount হবে — effect লাগবে না */}
        {open && (
          <LyricsFormBody
            key={initialData?.id ?? "create"}
            initialData={initialData}
            onSubmit={onSubmit}
            saving={saving}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
