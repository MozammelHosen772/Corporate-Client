"use client";

import {
  deleteAbout,
  upsertAbout,
} from "@/services/settings/adminAbout.service";
import {
  IAbout,
  ICreateAboutPayload,
} from "@/types/adminSettings/adminAbout.interface";
import { useState } from "react";
import { toast } from "sonner";
import AboutForm from "./components/AboutForm";

type Props = {
  initialData: IAbout | null;
};

export default function AdminAboutPages({ initialData }: Props) {
  const [about, setAbout] = useState<IAbout | null>(initialData);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (payload: ICreateAboutPayload) => {
    try {
      setSaving(true);
      const updated = await upsertAbout(payload);
      setAbout(updated);
      toast.success(
        about ? "About updated successfully" : "About created successfully",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await deleteAbout();
      setAbout(null);
      toast.success("About deleted successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete about",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">
          About Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage about page content
        </p>
      </div>

      <AboutForm
        initialData={about}
        onSubmit={handleSubmit}
        saving={saving}
        onDelete={handleDelete}
      />
    </div>
  );
}
