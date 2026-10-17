"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPaymentMethod,
  TPaymentCategory,
} from "@/services/paymentMethod/paymentmethods.service";
import { useState } from "react";
import { toast } from "sonner";
import {
  ACCOUNT_TYPES_BY_CATEGORY,
  PROVIDERS_BY_CATEGORY,
} from "../constants/Paymentmethod.constants";

type Props = {
  onSuccess: () => Promise<void> | void;
};

export default function PaymentMethodForm({ onSuccess }: Props) {
  const [category, setCategory] = useState<TPaymentCategory | "">("");
  const [provider, setProvider] = useState("");
  const [accountType, setAccountType] = useState("");
  const [amount, setAmount] = useState(""); // optional
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const providerOptions = category ? PROVIDERS_BY_CATEGORY[category] : [];
  const accountTypeOptions = category
    ? ACCOUNT_TYPES_BY_CATEGORY[category]
    : [];

  const resetForm = () => {
    setCategory("");
    setProvider("");
    setAccountType("");
    setAmount("");
    setAccountNumber("");
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as TPaymentCategory);
    setProvider("");
    setAccountType("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !provider || !accountType || !accountNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Adding payment method...");

    try {
      await createPaymentMethod({
        category,
        provider,
        accountType,
        accountNumber,
        ...(amount ? { amount: Number(amount) } : {}), // optional, only sent if filled
      });
      toast.success("Payment method added successfully", { id: toastId });
      resetForm();
      await onSuccess();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to add payment method",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-center text-lg font-semibold text-slate-800">
        Add Payment Method
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="category">Payment Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOBILE_WALLET">Mobile Wallet</SelectItem>
                <SelectItem value="BANK">Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {category && (
            <div className="space-y-1.5">
              <Label htmlFor="provider">
                {category === "MOBILE_WALLET" ? "Wallet Provider" : "Bank Name"}
              </Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger id="provider" className="w-full">
                  <SelectValue placeholder="Select Provider" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {category && (
            <div className="space-y-1.5">
              <Label htmlFor="accountType">Account Type</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger id="accountType" className="w-full">
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="amount">
              Payment Amount <span className="text-slate-400">(optional)</span>
            </Label>
            <Input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Payment Amount"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountNumber">
              {category === "MOBILE_WALLET"
                ? "Wallet Number"
                : "Bank Account Number"}
            </Label>
            <Input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={
                category === "MOBILE_WALLET"
                  ? "Enter Wallet Number"
                  : "Enter Bank Account Number"
              }
            />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Adding..." : "Add Payment Method"}
        </Button>
      </form>
    </div>
  );
}
