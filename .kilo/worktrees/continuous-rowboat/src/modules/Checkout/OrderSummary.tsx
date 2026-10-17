"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import {
  TValidateCouponResult,
  validateCoupon,
} from "@/services/coupon/coupon.service";
import { createOrder } from "@/services/orders/orders.service";
import { TActivePaymentMethod } from "@/services/paymentMethod/paymentmethods.service";
import { CheckoutFormData } from "@/types/checkout.interface";
import { Loader2, Lock, ShieldCheck, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import CouponBox from "./components/CouponBox";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import PriceBreakdown from "./components/PriceBreakdown";

interface OrderSummaryProps {
  formData: CheckoutFormData;
  isFormValid: boolean;
  paymentMethods?: TActivePaymentMethod[];
}

// ─── cartItems (custom shape) থেকে backend-expected order payload shape এ map ──
// component-এর বাইরে রাখা হয়েছে যাতে প্রতি render এ নতুন function না বানায়
const mapCartItemsToOrderPayload = (
  items: ReturnType<typeof useCart>["cartItems"],
) =>
  items.map((item) => ({
    productId: item.cartItemId ?? item.id,
    title: item.title,
    image: item.image ?? "",
    price: item.price,
    quantity: item.quantity,
    selectedColor: item.selectedColor ?? null,
    selectedSize: item.selectedSize ?? null,
    shippingType: item.shippingType,
    shippingCost: item.shippingCost,
  }));

export default function OrderSummary({
  formData,
  isFormValid,
  paymentMethods = [],
}: OrderSummaryProps) {
  const { cartItems } = useCart();
  const router = useRouter();
  const location = "dhaka";

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] =
    useState<TValidateCouponResult | null>(null);

  const [paymentMode, setPaymentMode] = useState<"cod" | "manual">("cod");
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ── useMemo: cartItems change না হলে recalculate হবে না ─────────────────
  const selectedManualMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedMethodId),
    [paymentMethods, selectedMethodId],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [cartItems],
  );
  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.quantity, 0),
    [cartItems],
  );

  const { delivery, hasMixedShipping, freeItemCount, paidItemCount } =
    useMemo(() => {
      let total = 0;
      const freeIds = new Set<string>();
      const paidCosts = new Map<string, number>();

      for (const item of cartItems) {
        const id = item.cartItemId ?? item.id;
        if (item.shippingType === "free") {
          freeIds.add(id);
          continue;
        }
        if (!paidCosts.has(id)) paidCosts.set(id, item.shippingCost);
      }
      for (const cost of paidCosts.values()) total += cost;
      if (paidCosts.size > 0) total += location === "dhaka" ? 0 : 60;

      return {
        delivery: total,
        hasMixedShipping: freeIds.size > 0 && paidCosts.size > 0,
        freeItemCount: freeIds.size,
        paidItemCount: paidCosts.size,
      };
    }, [cartItems, location]);

  const isCouponBelowMinimum = appliedCoupon
    ? subtotal < appliedCoupon.minOrderAmount
    : false;
  const effectiveCoupon = isCouponBelowMinimum ? null : appliedCoupon;
  const couponDiscount = effectiveCoupon?.freeDelivery
    ? 0
    : (effectiveCoupon?.discount ?? 0);
  const finalDelivery = effectiveCoupon?.freeDelivery ? 0 : delivery;
  const total = useMemo(
    () => Math.max(subtotal - couponDiscount + finalDelivery, 0),
    [subtotal, couponDiscount, finalDelivery],
  );

  const hasOutOfStockItem = useMemo(
    () => cartItems.some((i) => i.stock <= 0),
    [cartItems],
  );
  const isCartEmpty = cartItems.length === 0;

  const isManualPaymentValid =
    paymentMode === "cod" ||
    (selectedMethodId !== "" &&
      senderNumber.trim() !== "" &&
      transactionId.trim() !== "");

  const canPlaceOrder =
    !isCartEmpty &&
    isFormValid &&
    !hasOutOfStockItem &&
    agreedToTerms &&
    isManualPaymentValid;

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return toast.error("Please enter a coupon code");
    if (isCartEmpty) return toast.error("Your cart is empty");
    if (isApplyingCoupon) return; // ✅ double-click/double-call গার্ড

    setIsApplyingCoupon(true);
    try {
      const result = await validateCoupon(
        couponCode.trim().toUpperCase(),
        subtotal,
      );

      if (!result.success || !result.data) {
        toast.error(result.message || "Invalid or expired coupon code");
        return;
      }

      setAppliedCoupon(result.data);
      setCouponCode("");
      toast.success(
        result.data.freeDelivery
          ? `Coupon "${result.data.code}" applied — free delivery!`
          : `Coupon "${result.data.code}" applied — ৳${result.data.discount.toLocaleString()} off`,
      );
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponCode, isCartEmpty, subtotal, isApplyingCoupon]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  }, []);

  const handleModeChange = useCallback((mode: "cod" | "manual") => {
    setPaymentMode(mode);
    if (mode === "cod") {
      setSelectedMethodId("");
      setSenderNumber("");
      setTransactionId("");
    }
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (isCartEmpty) return toast.error("Your cart is empty");
    if (!isFormValid)
      return toast.error("Please fill in all required fields correctly");
    if (hasOutOfStockItem)
      return toast.error("Remove out-of-stock items before placing the order");
    if (!agreedToTerms)
      return toast.error("Please agree to the Terms & Conditions to continue");
    if (paymentMode === "manual" && !selectedMethodId)
      return toast.error("Please select a payment method");
    if (
      paymentMode === "manual" &&
      (!senderNumber.trim() || !transactionId.trim())
    )
      return toast.error("Please enter your number and transaction ID");

    setIsPlacingOrder(true);
    try {
      const result = await createOrder({
        customer: formData,
        cart: mapCartItemsToOrderPayload(cartItems),
        paymentMethod:
          paymentMode === "cod"
            ? { type: "cod" }
            : {
                type: "manual",
                paymentMethodId: selectedManualMethod?.id,
                provider: selectedManualMethod?.provider,
                receivingAccountNumber: selectedManualMethod?.accountNumber,
                senderNumber,
                transactionId,
              },
        coupon: effectiveCoupon
          ? {
              code: effectiveCoupon.code,
              type: effectiveCoupon.type,
              discount: couponDiscount,
              freeDelivery: effectiveCoupon.freeDelivery,
            }
          : null,
        summary: {
          subtotal,
          delivery: finalDelivery,
          discount: couponDiscount,
          total,
          totalQuantity,
        },
      });

      // ✅ Session expired — login page এ পাঠান
      if (result.isSessionExpired) {
        toast.error("Please log in to place your order");
        router.push(`/login?redirect=/checkout`);
        return;
      }

      if (!result.success || !result.data) {
        toast.error(
          result.message || "Something went wrong. Please try again.",
        );
        return;
      }

      router.push(`/order-success?orderNumber=${result.data.orderNumber}`);
      toast.success("Order placed successfully!");
    } finally {
      setIsPlacingOrder(false);
    }
  }, [
    isCartEmpty,
    isFormValid,
    hasOutOfStockItem,
    agreedToTerms,
    paymentMode,
    selectedMethodId,
    senderNumber,
    transactionId,
    formData,
    cartItems,
    selectedManualMethod,
    effectiveCoupon,
    couponDiscount,
    subtotal,
    finalDelivery,
    total,
    totalQuantity,
    router,
  ]);

  return (
    <Card className="sticky top-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <ShoppingBag className="w-4 h-4" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <PriceBreakdown
          subtotal={subtotal}
          totalQuantity={totalQuantity}
          effectiveCoupon={effectiveCoupon}
          couponDiscount={couponDiscount}
          finalDelivery={finalDelivery}
          hasMixedShipping={hasMixedShipping}
          freeItemCount={freeItemCount}
          paidItemCount={paidItemCount}
          total={total}
        />

        <CouponBox
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          isApplyingCoupon={isApplyingCoupon}
          appliedCoupon={appliedCoupon}
          isCouponBelowMinimum={isCouponBelowMinimum}
          couponDiscount={couponDiscount}
          subtotal={subtotal}
          onApply={handleApplyCoupon}
          onRemove={handleRemoveCoupon}
        />

        <Separator />

        <PaymentMethodSelector
          paymentMethods={paymentMethods}
          total={total}
          selectedMode={paymentMode}
          onModeChange={handleModeChange}
          selectedMethodId={selectedMethodId}
          onMethodChange={setSelectedMethodId}
          senderNumber={senderNumber}
          onSenderNumberChange={setSenderNumber}
          transactionId={transactionId}
          onTransactionIdChange={setTransactionId}
        />

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            I agree to the{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms &amp; Conditions
            </a>
            ,{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/refund-policy" className="text-blue-600 hover:underline">
              Return &amp; Refund Policy
            </a>
            .
          </span>
        </label>

        {isCartEmpty && (
          <p className="text-xs text-center text-muted-foreground">
            Your cart is empty — add items to continue.
          </p>
        )}
        {!isCartEmpty && !isFormValid && (
          <p className="text-xs text-center text-orange-600">
            Please complete the delivery address form above.
          </p>
        )}
        {hasOutOfStockItem && (
          <p className="text-xs text-center text-red-500">
            Some items in your cart are out of stock.
          </p>
        )}
        {paymentMode === "manual" && !isManualPaymentValid && (
          <p className="text-xs text-center text-orange-600">
            Please complete the manual payment details above.
          </p>
        )}

        <Button
          onClick={handlePlaceOrder}
          disabled={!canPlaceOrder || isPlacingOrder}
          className="w-full h-[50px] text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300"
        >
          {isPlacingOrder ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Placing Order...
            </>
          ) : (
            `Order & Pay ৳${total.toLocaleString()}`
          )}
        </Button>

        <div className="space-y-1.5 pt-1">
          <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Your information is protected
          </p>
          <ul className="space-y-1 text-xs text-muted-foreground pl-5">
            <li className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600" />
              End-to-end encrypted checkout
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600" />
              Your payment details are never stored
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600" />
              All data is encrypted &amp; secure
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
