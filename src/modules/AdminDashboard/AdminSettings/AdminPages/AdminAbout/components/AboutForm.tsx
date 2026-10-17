"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SeoMetaDataPage, { SeoValues } from "@/shared/seoMetaData/SeoMetaData";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";
import {
  IAbout,
  ICreateAboutPayload,
} from "@/types/adminSettings/adminAbout.interface";
import { Loader2 } from "lucide-react";
import { useState } from "react";

// const TiptapEditor = dynamic(
//   () => import("@/shared/tiptapEditor/components/tip-tap-editor"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="h-[220px] animate-pulse rounded-xl bg-slate-100" />
//     ),
//   },
// );

interface AboutFormProps {
  initialData: IAbout | null;
  onSubmit: (payload: ICreateAboutPayload) => Promise<void>;
  onDelete: () => Promise<void>;
  saving: boolean;
}

function parseKeywords(raw?: string | string[]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export default function AboutForm({
  initialData,
  onSubmit,
  saving,
  onDelete,
}: AboutFormProps) {
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [seo, setSeo] = useState<SeoValues>({
    metaTitle: initialData?.metaTitle ?? "",
    metaDescription: initialData?.metaDescription ?? "",
    metaKeywords: parseKeywords(initialData?.metaKeywords),
  });

  const isSeoInvalid =
    seo.metaTitle.length > 60 || seo.metaDescription.length > 160;

  const isDescriptionEmpty =
    description.trim() === "" || description === "<p></p>";

  const isDisabled = saving || isSeoInvalid || isDescriptionEmpty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ICreateAboutPayload = {
      description,
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      metaKeywords: seo.metaKeywords.join(", "),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Card>
        <SeoMetaDataPage value={seo} onChange={setSeo} />

        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            value={description}
            onChange={setDescription}
            minHeight="220px"
            maxHeight="520px"
            showWordCount
            showCharacterCount
          />
        </CardContent>

        <div className="flex justify-end p-4">
          {initialData && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={saving}
            >
              Remove
            </Button>
          )}
          <Button type="submit" disabled={isDisabled} className="min-w-28">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : initialData ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
}
