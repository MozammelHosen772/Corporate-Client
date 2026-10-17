"use client";

import { cn } from "@/lib/utils";
import { CharacterCount } from "@tiptap/extension-character-count";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  ChevronDown,
  Code,
  Code2,
  Columns,
  FileImage,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Pilcrow,
  Quote,
  Redo,
  RemoveFormatting,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Type,
  UnderlineIcon,
  Undo,
  Unlink,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

// ─── Lowlight setup ──────────────────────────────────────────────────────────
const lowlight = createLowlight(common);

// ─── Types ────────────────────────────────────────────────────────────────────
interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  error?: boolean;
  disabled?: boolean;
  characterLimit?: number;
  showCharacterCount?: boolean;
  showWordCount?: boolean;
  autofocus?: boolean;
  className?: string;
}

// ─── Portal Popup Hook ────────────────────────────────────────────────────────
function usePortalPosition(
  open: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [open, triggerRef]);

  return pos;
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────
interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
  btnRef?: React.RefObject<HTMLButtonElement | null>;
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  title,
  children,
  className,
  btnRef,
}: ToolbarButtonProps) => (
  <button
    ref={btnRef}
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    title={title}
    className={cn(
      "flex h-7 w-7 items-center justify-center rounded text-slate-600 transition-all duration-150",
      "hover:bg-slate-100 hover:text-slate-900",
      "disabled:cursor-not-allowed disabled:opacity-40",
      active && "bg-slate-900 text-white hover:bg-slate-700 hover:text-white",
      className,
    )}
  >
    {children}
  </button>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => <div className="mx-0.5 h-5 w-px shrink-0 bg-slate-200" />;

// ─── Dropdown ─────────────────────────────────────────────────────────────────
interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

interface DropdownProps {
  label: React.ReactNode;
  title: string;
  items: DropdownItem[];
  active?: boolean;
}

const Dropdown = ({ label, title, items, active }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pos = usePortalPosition(open, btnRef);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      setOpen(false);
    };
    // slight delay so the current click doesn't close immediately
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler),
      0,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        title={title}
        className={cn(
          "flex h-7 items-center gap-1 rounded px-1.5 text-xs font-medium text-slate-600 transition-all",
          "hover:bg-slate-100 hover:text-slate-900",
          active &&
            "bg-slate-900 text-white hover:bg-slate-700 hover:text-white",
        )}
      >
        {label}
        <ChevronDown size={10} />
      </button>

      {open &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            style={{ position: "absolute", top: pos.top, left: pos.left }}
            className="z-[9999] min-w-[140px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  item.onClick();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors",
                  "hover:bg-slate-50",
                  item.active
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-700",
                )}
              >
                {item.icon && (
                  <span className="text-slate-500">{item.icon}</span>
                )}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};

// ─── Color Picker ─────────────────────────────────────────────────────────────
interface ColorPickerProps {
  editor: Editor;
}

const TEXT_COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#FFFFFF",
];

const HIGHLIGHT_COLORS = [
  "#FEF9C3",
  "#FEE2E2",
  "#DCFCE7",
  "#DBEAFE",
  "#F3E8FF",
  "#FFE4E6",
  "#FED7AA",
  "#D1FAE5",
  "#E0E7FF",
  "#FCE7F3",
];

const ColorPicker = ({ editor }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"text" | "highlight">("text");
  const btnRef = useRef<HTMLButtonElement>(null);
  const pos = usePortalPosition(open, btnRef);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler),
      0,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        title="Colors"
        className="flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
      >
        <Palette size={13} />
      </button>

      {open &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            style={{ position: "absolute", top: pos.top, left: pos.left }}
            className="z-[9999] w-48 overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
          >
            <div className="mb-2 flex gap-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTab("text");
                }}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-xs font-medium transition-colors",
                  tab === "text"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                Text
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTab("highlight");
                }}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-xs font-medium transition-colors",
                  tab === "highlight"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                Highlight
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {(tab === "text" ? TEXT_COLORS : HIGHLIGHT_COLORS).map(
                (color) => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (tab === "text") {
                        editor.chain().focus().setColor(color).run();
                      } else {
                        editor.chain().focus().toggleHighlight({ color }).run();
                      }
                      setOpen(false);
                    }}
                    style={{ backgroundColor: color }}
                    className="h-6 w-6 rounded border border-slate-200 transition-transform hover:scale-110"
                    title={color}
                  />
                ),
              )}
            </div>
            {tab === "text" && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().unsetColor().run();
                  setOpen(false);
                }}
                className="mt-2 w-full rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                Reset Color
              </button>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

// ─── Link Modal ───────────────────────────────────────────────────────────────
interface LinkModalProps {
  editor: Editor;
  onClose: () => void;
}

const LinkModal = ({ editor, onClose }: LinkModalProps) => {
  const [url, setUrl] = useState(editor.getAttributes("link").href || "");
  const [text, setText] = useState("");

  const apply = () => {
    if (!url) return;
    if (editor.state.selection.empty && text) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank">${text}</a>`)
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-800">Insert Link</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="https://example.com"
              autoFocus
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          {editor.state.selection.empty && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Display Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Link text"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={apply}
              className="flex-1 rounded-lg bg-slate-900 py-2 text-xs font-medium text-white hover:bg-slate-700"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Image Modal ──────────────────────────────────────────────────────────────
interface ImageModalProps {
  editor: Editor;
  onClose: () => void;
}

const ImageModal = ({ editor, onClose }: ImageModalProps) => {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const insertUrl = () => {
    if (!url) return;
    editor.chain().focus().setImage({ src: url, alt }).run();
    onClose();
  };

  const insertFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url: uploadedUrl } = await res.json();
      editor
        .chain()
        .focus()
        .setImage({ src: uploadedUrl, alt: file.name })
        .run();
    } catch {
      // fallback to base64 if upload fails
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        editor.chain().focus().setImage({ src, alt: file.name }).run();
      };
      reader.readAsDataURL(file);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-800">Insert Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
          >
            <X size={14} />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Image URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Alt Text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Image description"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div className="relative flex items-center">
            <div className="flex-1 border-t border-slate-200" />
            <span className="mx-2 text-xs text-slate-400">or</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-3 text-xs text-slate-500 hover:border-slate-400 hover:bg-slate-50"
          >
            <FileImage size={14} />
            Upload from device
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) insertFile(file);
            }}
          />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={insertUrl}
              className="flex-1 rounded-lg bg-slate-900 py-2 text-xs font-medium text-white hover:bg-slate-700"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Table Inserter ───────────────────────────────────────────────────────────
interface TableInserterProps {
  editor: Editor;
}

const TableInserter = ({ editor }: TableInserterProps) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState({ rows: 0, cols: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const pos = usePortalPosition(open, btnRef);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler),
      0,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        title="Insert Table"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded text-slate-600 transition-all duration-150",
          "hover:bg-slate-100 hover:text-slate-900",
          editor.isActive("table") &&
            "bg-slate-900 text-white hover:bg-slate-700 hover:text-white",
        )}
      >
        <TableIcon size={13} />
      </button>

      {open &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            style={{ position: "absolute", top: pos.top, left: pos.left }}
            className="z-[9999] overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
          >
            <p className="mb-1.5 text-center text-xs text-slate-500">
              {hover.rows > 0 && hover.cols > 0
                ? `${hover.rows} × ${hover.cols}`
                : "Select size"}
            </p>
            <div
              className="grid gap-0.5"
              style={{ gridTemplateColumns: "repeat(8, 1fr)" }}
            >
              {Array.from({ length: 8 * 8 }).map((_, i) => {
                const row = Math.floor(i / 8) + 1;
                const col = (i % 8) + 1;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHover({ rows: row, cols: col })}
                    onMouseLeave={() => setHover({ rows: 0, cols: 0 })}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor
                        .chain()
                        .focus()
                        .insertTable({
                          rows: row,
                          cols: col,
                          withHeaderRow: true,
                        })
                        .run();
                      setOpen(false);
                    }}
                    className={cn(
                      "h-5 w-5 rounded-sm border transition-colors",
                      row <= hover.rows && col <= hover.cols
                        ? "border-slate-600 bg-slate-800"
                        : "border-slate-200 bg-slate-50 hover:border-slate-400",
                    )}
                  />
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

// ─── Toolbar ──────────────────────────────────────────────────────────────────
interface ToolbarProps {
  editor: Editor;
  onLinkModal: () => void;
  onImageModal: () => void;
}

const Toolbar = ({ editor, onLinkModal, onImageModal }: ToolbarProps) => {
  const headingItems = [
    {
      label: "Paragraph",
      icon: <Pilcrow size={12} />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      active: editor.isActive("paragraph"),
    },
    {
      label: "Heading 1",
      icon: <Heading1 size={12} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      label: "Heading 2",
      icon: <Heading2 size={12} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      label: "Heading 3",
      icon: <Heading3 size={12} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
    },
  ];

  const fontItems = [
    {
      label: "Default",
      onClick: () => editor.chain().focus().unsetFontFamily().run(),
    },
    {
      label: "Serif",
      onClick: () =>
        editor.chain().focus().setFontFamily("Georgia, serif").run(),
    },
    {
      label: "Monospace",
      onClick: () =>
        editor.chain().focus().setFontFamily("'Courier New', monospace").run(),
    },
    {
      label: "Cursive",
      onClick: () => editor.chain().focus().setFontFamily("cursive").run(),
    },
  ];

  const currentHeading = editor.isActive("heading", { level: 1 })
    ? "H1"
    : editor.isActive("heading", { level: 2 })
      ? "H2"
      : editor.isActive("heading", { level: 3 })
        ? "H3"
        : "¶";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/80 px-2 py-1.5 backdrop-blur-sm">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo size={13} />
      </ToolbarButton>
      <Divider />

      <Dropdown
        label={
          <span className="flex items-center gap-1">
            <Type size={11} />
            {currentHeading}
          </span>
        }
        title="Text Style"
        items={headingItems}
        active={editor.isActive("heading")}
      />
      <Dropdown
        label={<span className="flex items-center gap-1">Font</span>}
        title="Font Family"
        items={fontItems}
      />
      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline Code"
      >
        <Code size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        active={editor.isActive("subscript")}
        title="Subscript"
      >
        <SubscriptIcon size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        active={editor.isActive("superscript")}
        title="Superscript"
      >
        <SuperscriptIcon size={13} />
      </ToolbarButton>
      <Divider />

      <ColorPicker editor={editor} />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive("highlight")}
        title="Highlight"
      >
        <Highlighter size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive("taskList")}
        title="Task List"
      >
        <CheckSquare size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <AlignJustify size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code Block"
      >
        <Code2 size={13} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus size={13} />
      </ToolbarButton>
      <Divider />

      <TableInserter editor={editor} />
      {editor.isActive("table") && (
        <>
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            title="Add Column"
            className="w-auto px-1.5 text-xs"
          >
            <Columns size={13} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            title="Delete Table"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <X size={13} />
          </ToolbarButton>
        </>
      )}
      <Divider />

      <ToolbarButton
        onClick={onLinkModal}
        active={editor.isActive("link")}
        title="Insert Link"
      >
        <LinkIcon size={13} />
      </ToolbarButton>
      {editor.isActive("link") && (
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Remove Link"
        >
          <Unlink size={13} />
        </ToolbarButton>
      )}
      <ToolbarButton onClick={onImageModal} title="Insert Image">
        <ImageIcon size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        title="Clear Formatting"
      >
        <RemoveFormatting size={13} />
      </ToolbarButton>
    </div>
  );
};

// ─── Word / Char Count ────────────────────────────────────────────────────────
interface CountBarProps {
  editor: Editor;
  characterLimit?: number;
  showCharacterCount: boolean;
  showWordCount: boolean;
}

const CountBar = ({
  editor,
  characterLimit,
  showCharacterCount,
  showWordCount,
}: CountBarProps) => {
  const charCount = editor.storage.characterCount?.characters?.() ?? 0;
  const wordCount = editor.storage.characterCount?.words?.() ?? 0;
  const percentage = characterLimit
    ? Math.round((charCount / characterLimit) * 100)
    : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-100 px-3 py-1.5">
      <div className="flex gap-3 text-xs text-slate-400">
        {showWordCount && <span>{wordCount} words</span>}
        {showCharacterCount && (
          <span
            className={cn(
              isAtLimit && "text-red-500",
              isNearLimit && !isAtLimit && "text-amber-500",
            )}
          >
            {charCount}
            {characterLimit ? ` / ${characterLimit}` : ""} characters
          </span>
        )}
      </div>
      {characterLimit && (
        <div className="h-1 w-20 overflow-hidden rounded-full bg-slate-200">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isAtLimit
                ? "bg-red-500"
                : isNearLimit
                  ? "bg-amber-400"
                  : "bg-slate-400",
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

// ─── Main Editor ──────────────────────────────────────────────────────────────
export default function TiptapEditor({
  value,
  onChange,
  placeholder = "এখানে লিখুন...",
  minHeight = "200px",
  maxHeight,
  error = false,
  disabled = false,
  characterLimit,
  showCharacterCount = true,
  showWordCount = true,
  autofocus = false,
  className,
}: TiptapEditorProps) {
  const [linkModal, setLinkModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    autofocus,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      CodeBlockLowlight.configure({ lowlight }),
      ...(characterLimit !== undefined
        ? [CharacterCount.configure({ limit: characterLimit })]
        : [CharacterCount]),
    ],
    content: value,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: { attributes: { class: "outline-none" } },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) editor.commands.setContent(value || "");
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLinkModal(true);
    }
  }, []);

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-white transition-all duration-200",
          "focus-within:ring-1 focus-within:ring-offset-1",
          error
            ? "border-red-400 focus-within:ring-red-300"
            : "border-slate-200 focus-within:ring-slate-100 focus-within:border-slate-200",
          disabled && "opacity-60 cursor-not-allowed",
          className,
        )}
      >
        {editor && !disabled && (
          <Toolbar
            editor={editor}
            onLinkModal={() => setLinkModal(true)}
            onImageModal={() => setImageModal(true)}
          />
        )}
        <EditorContent
          editor={editor}
          onKeyDown={handleKeyDown}
          style={{
            minHeight,
            ...(maxHeight ? { maxHeight, overflowY: "auto" } : {}),
          }}
          className={cn(
            "prose prose-sm max-w-none px-4 py-3",
            "prose-headings:font-semibold prose-headings:text-slate-800",
            "prose-p:text-slate-700 prose-p:leading-relaxed",
            "prose-li:text-slate-700",
            "prose-ul:my-1 prose-ol:my-1",
            "prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600",
            "prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-rose-600 prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:rounded-lg prose-pre:bg-slate-900 prose-pre:text-slate-100",
            "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
            "prose-img:rounded-lg prose-img:shadow-sm",
            "[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
            "[&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-slate-700",
            "[&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2 [&_td]:text-slate-700",
            "[&_.task-list-item]:flex [&_.task-list-item]:items-start [&_.task-list-item]:gap-2",
            "[&_.task-list-item_input]:mt-0.5 [&_.task-list-item_input]:accent-slate-700",
            "[&_.tiptap]:outline-none",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:text-slate-400",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          )}
        />
        {editor && (showCharacterCount || showWordCount) && (
          <CountBar
            editor={editor}
            characterLimit={characterLimit}
            showCharacterCount={showCharacterCount}
            showWordCount={showWordCount}
          />
        )}
      </div>

      {linkModal && editor && (
        <LinkModal editor={editor} onClose={() => setLinkModal(false)} />
      )}
      {imageModal && editor && (
        <ImageModal editor={editor} onClose={() => setImageModal(false)} />
      )}
    </>
  );
}
