"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  changePassword,
  verifyPasswordAction,
} from "@/services/auth/changePassword.service";
import PasswordInput from "./PasswordInput";

export default function ChangePassword() {
  const [step, setStep] = useState<"verify" | "change">("verify");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    startTransition(async () => {
      const res = await verifyPasswordAction(currentPassword);
      if (res.success) {
        setStep("change");
      } else {
        toast.error(res.message || "Incorrect password");
      }
    });
  };

  const handleChange = () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    startTransition(async () => {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setStep("verify");
      } else {
        toast.error(res.message || "Failed to change password");
        setStep("verify");
      }
    });
  };

  return (
    <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className=" text-lg md:text-xl font-semibold text-slate-800">
        Change Password
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        {step === "verify"
          ? "Enter your current password to continue"
          : "Set your new password"}
      </p>

      {/* Current Password */}
      <div className="mb-4">
        <label className="mb-1.5 block text-base font-semibold text-slate-700">
          Current Password
        </label>
        <PasswordInput
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={step === "change"}
          autoComplete="current-password"
        />
      </div>

      {/* Step 1 — Verify */}
      {step === "verify" && (
        <button
          onClick={handleVerify}
          disabled={isPending || !currentPassword}
          className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {isPending ? "Verifying..." : "Continue"}
        </button>
      )}

      {/* Step 2 — Change */}
      {step === "change" && (
        <>
          <div className="mb-4">
            <label className="mb-1 block text-base font-semibold text-slate-700">
              New Password
            </label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-base font-semibold text-slate-700">
              Confirm New Password
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep("verify");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              onClick={handleChange}
              disabled={isPending || !newPassword || !confirmPassword}
              className="flex-1 rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {isPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
