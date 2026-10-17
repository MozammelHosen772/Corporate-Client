"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutFormData } from "@/types/checkout.interface";

import { cn } from "@/lib/utils";
import { CheckoutFormErrors, validateField } from "@/zod/checkoutValidation";
import { AlertCircle, MapPin } from "lucide-react";
import { useCallback, useState } from "react";
import { districtData } from "../constants/bddata";

type Props = {
  onChange?: (data: CheckoutFormData, isValid: boolean) => void;
};

export default function CheckoutForm({ onChange }: Props) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    district: "",
    upazila: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  // ✅ শুধু touched field-এই error দেখাবো, প্রথমেই সব লাল দেখাবে না
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emitChange = useCallback(
    (data: CheckoutFormData, currentErrors: CheckoutFormErrors) => {
      const valid =
        Object.values(currentErrors).every((e) => !e) &&
        !!data.name &&
        !!data.phone &&
        !!data.district &&
        !!data.upazila &&
        !!data.address;
      onChange?.(data, valid);
    },
    [onChange],
  );

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    const updated = { ...formData, [field]: value };

    // District বদলালে upazila reset — stale selection থেকে যাওয়া ঠিক না
    if (field === "district") {
      updated.upazila = "";
    }

    setFormData(updated);

    // ✅ Blur validation — touched field হলে সাথে সাথে re-validate
    if (touched[field] && field in errors) {
      const fieldError = validateField(
        field as keyof CheckoutFormErrors,
        value,
      );
      const newErrors = { ...errors, [field]: fieldError };
      setErrors(newErrors);
      emitChange(updated, newErrors);
    } else {
      emitChange(updated, errors);
    }
  };

  const handleBlur = (field: keyof CheckoutFormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field]);
    const newErrors = { ...errors, [field]: fieldError };
    setErrors(newErrors);
    emitChange(formData, newErrors);
  };

  const showError = (field: keyof CheckoutFormErrors) =>
    touched[field] ? errors[field] : undefined;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <MapPin className="w-4 h-4" />
          ENTERING ADDRESS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-5">
        <div className="grid md:grid-cols-2 gap-4">
          {/* NAME */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="e.g. Nisith Roy"
              className={cn(
                showError("name") &&
                  "border-red-500 focus-visible:ring-red-500",
              )}
              aria-invalid={!!showError("name")}
            />
            {showError("name") && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {showError("name")}
              </p>
            )}
          </div>

          {/* PHONE */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="01XXXXXXXXX"
              className={cn(
                showError("phone") &&
                  "border-red-500 focus-visible:ring-red-500",
              )}
              aria-invalid={!!showError("phone")}
            />
            {showError("phone") && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {showError("phone")}
              </p>
            )}
          </div>

          {/* DISTRICT */}
          <div className="space-y-1.5">
            <Label>
              District <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.district}
              onValueChange={(val) => {
                handleChange("district", val);
                setTouched((prev) => ({ ...prev, district: true }));
              }}
            >
              <SelectTrigger
                className={cn(showError("district") && "border-red-500")}
              >
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(districtData).map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showError("district") && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {showError("district")}
              </p>
            )}
          </div>

          {/* UPAZILA */}
          <div className="space-y-1.5">
            <Label>
              Upazila <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.upazila}
              onValueChange={(val) => {
                handleChange("upazila", val);
                setTouched((prev) => ({ ...prev, upazila: true }));
              }}
              disabled={!formData.district}
            >
              <SelectTrigger
                className={cn(showError("upazila") && "border-red-500")}
              >
                <SelectValue
                  placeholder={
                    formData.district
                      ? "Select Upazila"
                      : "Select district first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {formData.district &&
                  districtData[formData.district].map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {showError("upazila") && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {showError("upazila")}
              </p>
            )}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="space-y-1.5">
          <Label htmlFor="address">
            House, Road, Area <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            onBlur={() => handleBlur("address")}
            placeholder="House no, road, area, landmark..."
            className={cn(
              showError("address") &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            rows={3}
          />
          {showError("address") && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="w-3 h-3" /> {showError("address")}
            </p>
          )}
        </div>

        {/* NOTES */}
        <div className="space-y-1.5">
          <Label htmlFor="notes">Order Notes (optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Any special instructions for delivery..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
