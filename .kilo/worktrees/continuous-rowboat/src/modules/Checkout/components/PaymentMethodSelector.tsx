"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TActivePaymentMethod } from "@/services/paymentMethod/paymentmethods.service";
import { CheckCircle2, Copy } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface PaymentMethodSelectorProps {
  paymentMethods: TActivePaymentMethod[];
  total: number;
  selectedMode: "cod" | "manual";
  onModeChange: (mode: "cod" | "manual") => void;
  selectedMethodId: string;
  onMethodChange: (id: string) => void;
  senderNumber: string;
  onSenderNumberChange: (v: string) => void;
  transactionId: string;
  onTransactionIdChange: (v: string) => void;
}

// ─── Mobile-safe clipboard copy ─────────────────────────────────────────────
// navigator.clipboard শুধু secure context (https/localhost) এ কাজ করে।
// অনেক mobile browser / in-app webview এ clipboard API থাকেই না — তাই fallback দরকার।
// Component-এর বাইরে রাখা হয়েছে যাতে re-render এ নতুন function তৈরি না হয়।
const copyText = async (text: string, label: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
      return;
    }
    throw new Error("Clipboard API unavailable");
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (success) {
        toast.success(`${label} copied`);
      } else {
        toast.error(
          `Couldn't copy ${label.toLowerCase()} — please copy manually`,
        );
      }
    } catch {
      toast.error(
        `Couldn't copy ${label.toLowerCase()} — please copy manually`,
      );
    }
  }
};

function PaymentMethodSelector({
  paymentMethods,
  total,
  selectedMode,
  onModeChange,
  selectedMethodId,
  onMethodChange,
  senderNumber,
  onSenderNumberChange,
  transactionId,
  onTransactionIdChange,
}: PaymentMethodSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Modal-এর ভিতরে draft state — Confirm না দেওয়া পর্যন্ত parent state touch হবে না ──
  const [draftMethodId, setDraftMethodId] = useState(selectedMethodId);
  const [draftSenderNumber, setDraftSenderNumber] = useState(senderNumber);
  const [draftTransactionId, setDraftTransactionId] = useState(transactionId);

  // ── useMemo: paymentMethods array change না হলে recompute হবে না ──────
  const confirmedMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedMethodId),
    [paymentMethods, selectedMethodId],
  );
  const draftMethod = useMemo(
    () => paymentMethods.find((m) => m.id === draftMethodId),
    [paymentMethods, draftMethodId],
  );

  const isManualConfirmed =
    selectedMode === "manual" &&
    selectedMethodId !== "" &&
    senderNumber.trim() !== "" &&
    transactionId.trim() !== "";

  // ── useCallback: প্রতিটা handler parent re-render এ নতুন reference পাবে না ──
  const openModal = useCallback(() => {
    setDraftMethodId(selectedMethodId);
    setDraftSenderNumber(senderNumber);
    setDraftTransactionId(transactionId);
    setIsModalOpen(true);
  }, [selectedMethodId, senderNumber, transactionId]);

  const handleConfirm = useCallback(() => {
    if (!draftMethodId) {
      toast.error("Please select a payment method");
      return;
    }
    if (!draftSenderNumber.trim() || !draftTransactionId.trim()) {
      toast.error("Please enter your number and transaction ID");
      return;
    }

    onModeChange("manual");
    onMethodChange(draftMethodId);
    onSenderNumberChange(draftSenderNumber);
    onTransactionIdChange(draftTransactionId);
    setIsModalOpen(false);
  }, [
    draftMethodId,
    draftSenderNumber,
    draftTransactionId,
    onModeChange,
    onMethodChange,
    onSenderNumberChange,
    onTransactionIdChange,
  ]);

  const handleCodSelect = useCallback(
    () => onModeChange("cod"),
    [onModeChange],
  );

  const handleCopyNumber = useCallback(() => {
    if (draftMethod) copyText(draftMethod.accountNumber, "Number");
  }, [draftMethod]);

  const handleCopyAmount = useCallback(() => {
    copyText(String(total), "Amount");
  }, [total]);

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium text-muted-foreground">
        Payment Method
      </Label>

      <div className="grid grid-cols-2 gap-1 md:gap-3">
        {/* ── Cash on Delivery ── */}
        <button
          type="button"
          onClick={handleCodSelect}
          className={`relative flex items-center gap-2 rounded-lg border-2 px-2 md:px-3 py-2 md:py-3 text-left transition-all ${
            selectedMode === "cod"
              ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
              : "border-input hover:bg-muted/50"
          }`}
        >
          {/* Banknote icon — mobile-e hidden, desktop-e visible */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden sm:block w-4 h-4 shrink-0"
          >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
          <span className="text-sm font-semibold">Cash on Delivery</span>
          {selectedMode === "cod" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 ml-auto shrink-0"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </button>

        {/* ── Manual Payment — click korle modal open ── */}
        <button
          type="button"
          onClick={openModal}
          disabled={paymentMethods.length === 0}
          className={`relative flex items-center gap-2 rounded-lg border-2 px-2 md:px-3 py-2 md:py-3 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedMode === "manual"
              ? "border-pink-600 bg-pink-50 text-pink-700 shadow-sm"
              : "border-input hover:bg-muted/50"
          }`}
        >
          {/* Wallet icon — mobile-e hidden, desktop-e visible */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden sm:block w-4 h-4 shrink-0"
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
          <span className="text-sm font-semibold">Manual Payment</span>
          {selectedMode === "manual" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 ml-auto shrink-0"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </button>
      </div>

      {paymentMethods.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No manual payment options available right now.
        </p>
      )}

      {/* ── Confirmed manual payment summary ── */}
      {isManualConfirmed && confirmedMethod && (
        <button
          type="button"
          onClick={openModal}
          className="w-full flex items-start gap-2.5 rounded-lg border border-pink-200 bg-pink-50/70 px-3.5 py-3 text-left hover:bg-pink-50 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
          <p className="text-xs text-pink-800 leading-relaxed">
            Paying via{" "}
            <span className="font-semibold">
              {confirmedMethod.provider} ({confirmedMethod.accountType})
            </span>{" "}
            — Txn ID:{" "}
            <span className="font-mono font-semibold">{transactionId}</span>.{" "}
            <span className="underline">Edit</span>
          </p>
        </button>
      )}

      {/* ── Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manual Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="payment-method-select"
                className="text-xs font-medium text-gray-600"
              >
                Select Payment Method *
              </Label>
              <Select value={draftMethodId} onValueChange={setDraftMethodId}>
                <SelectTrigger id="payment-method-select" className="w-full">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.provider} ({m.accountType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {draftMethod && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Send Payment To
                  </label>
                  <div className="flex items-center justify-between gap-2 rounded-md border border-input bg-gray-50 px-3 h-10">
                    <span className="text-sm font-mono font-semibold">
                      {draftMethod.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 px-2 py-1.5 rounded transition-colors shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Payment Amount
                  </label>
                  <div className="flex items-center justify-between gap-2 rounded-md border border-input bg-gray-50 px-3 h-10">
                    <span className="text-sm font-semibold">
                      ৳{total.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className="flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 px-2 py-1.5 rounded transition-colors shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="sender-number"
                    className="text-xs font-medium text-gray-600"
                  >
                    Your {draftMethod.provider} Number *
                  </Label>
                  <Input
                    id="sender-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={draftSenderNumber}
                    onChange={(e) => setDraftSenderNumber(e.target.value)}
                    onPaste={(e) => {
                      // paste explicitly allow, kono preventDefault na
                    }}
                    style={{ WebkitUserSelect: "text", userSelect: "text" }}
                    placeholder={`Enter your ${draftMethod.provider} number`}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="transaction-id"
                    className="text-xs font-medium text-gray-600"
                  >
                    Transaction ID *
                  </Label>
                  <Input
                    id="transaction-id"
                    type="text"
                    autoComplete="off"
                    value={draftTransactionId}
                    onChange={(e) => setDraftTransactionId(e.target.value)}
                    style={{ WebkitUserSelect: "text", userSelect: "text" }}
                    placeholder="Enter your transaction ID"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── React.memo: parent (OrderSummary) re-render হলেও props same থাকলে
// এই component আবার re-render হবে না ──────────────────────────────────
export default memo(PaymentMethodSelector);
