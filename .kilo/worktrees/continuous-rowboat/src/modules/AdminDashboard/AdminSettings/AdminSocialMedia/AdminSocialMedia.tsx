"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSocialMedia } from "@/services/settings/socialMedia.service";
import { CheckCircle2, Loader2, Share2 } from "lucide-react";

type SocialForm = {
  facebook: string;
  youtube: string;
  instagram: string;
  twitter: string;
};

type Props = {
  initialData: SocialForm;
};

const socialFields: {
  name: keyof SocialForm;
  label: string;
  placeholder: string;
  hint: string;
}[] = [
  {
    name: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/yourpage",
    hint: "Add your Facebook page link",
  },
  {
    name: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
    hint: "Add your YouTube channel link",
  },
  {
    name: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourprofile",
    hint: "Add your Instagram profile link",
  },
  {
    name: "twitter",
    label: "Twitter (X)",
    placeholder: "https://twitter.com/yourprofile",
    hint: "Add your Twitter/X profile link",
  },
];

export default function AdminSocialMedia({ initialData }: Props) {
  const [saving, setSaving] = useState(false);

  // ✅ আগে useEffect দিয়ে fetch করতো, এখন server component থেকে
  // initialData prop হিসেবে আসছে — তাই loading state-ও লাগছে না
  const [form, setForm] = useState<SocialForm>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await saveSocialMedia(form);
      // ✅ save হওয়ার পর server থেকে আসা data দিয়ে form sync করে দেওয়া হলো
      setForm({
        facebook: updated.facebook ?? "",
        youtube: updated.youtube ?? "",
        instagram: updated.instagram ?? "",
        twitter: updated.twitter ?? "",
      });
      toast.success("Social media links সফলভাবে save হয়েছে।");
    } catch {
      toast.error("Please valid URL");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-100 px-2 md:px-4 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Share2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Social Media Settings
          </h2>
          <p className="text-sm text-slate-500">
            Manage your social media profile links
          </p>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="space-y-6 p-2 md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {socialFields.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="mb-3">
                <Label className="text-sm font-semibold text-slate-700">
                  {item.label}
                </Label>
                <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
              </div>
              <Input
                type="url"
                name={item.name}
                value={form[item.name]}
                onChange={handleChange}
                placeholder={item.placeholder}
              />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-11 rounded-xl bg-orange-500 px-6 text-sm font-medium hover:bg-orange-600"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
