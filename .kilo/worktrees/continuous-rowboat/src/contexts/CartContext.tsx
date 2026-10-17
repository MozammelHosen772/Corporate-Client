"use client";

import { validateCartProducts } from "@/services/products/validation.service";
import { CartContextType, CartItem } from "@/types/cartItem.interface";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

// ✅ Composite ID generator — একই product এর ভিন্ন variation কে আলাদা লাইন হিসেবে ট্র্যাক করে
function generateCartItemId(productId: string, color?: string, size?: string) {
  return [productId, color || "none", size || "none"].join("::");
}

const VALIDATE_STALE_TIME = 60_000; // ✅ 60 sec — এর মধ্যে আবার call korle skip hobe (performance safe)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const cartItemsRef = useRef<CartItem[]>([]);
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  const lastValidatedRef = useRef<number>(0);

  /* ================= LOAD CART (SSR SAFE + NO EFFECT LOOP ISSUE) ================= */
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
          const parsed: CartItem[] = JSON.parse(savedCart);

          const migrated = parsed.map((item) => ({
            ...item,
            cartItemId:
              item.cartItemId ??
              generateCartItemId(
                item.id,
                item.selectedColor,
                item.selectedSize,
              ),
            // ✅ purano localStorage cart data te maxPurchaseQty na thakle
            // stock diye fallback — pরে prothom validateCart call e thik hoye jabe
            maxPurchaseQty: item.maxPurchaseQty ?? item.stock,
          }));

          setCartItems(migrated);
        }
      } catch (error) {
        console.error("Cart parse error:", error);
      } finally {
        setHydrated(true);
      }
    };

    loadCart();
  }, []);

  /* ================= SAVE CART ================= */
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("cart", JSON.stringify(cartItems));

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: cartItems,
      }),
    );
  }, [cartItems, hydrated]);

  /* ================= MULTI-TAB / MULTI-MOUNT SYNC ================= */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "cart") return;
      try {
        setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
      } catch (error) {
        console.error("Cart sync error:", error);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ================= ADD TO CART ================= */
  const addToCart = useCallback((newItem: Omit<CartItem, "cartItemId">) => {
    const cartItemId = generateCartItemId(
      newItem.id,
      newItem.selectedColor,
      newItem.selectedSize,
    );

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.cartItemId === cartItemId,
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + newItem.quantity;

        // ✅ stock na, effective maxPurchaseQty diye check
        if (newQty > updated[existingIndex].maxPurchaseQty) return prev;

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      }

      return [...prev, { ...newItem, cartItemId }];
    });
  }, []);

  /* ================= REMOVE ================= */
  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.cartItemId !== cartItemId),
    );
  }, []);

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = useCallback((cartItemId: string, qty: number) => {
    if (qty < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              // ✅ stock na, effective maxPurchaseQty diye clamp
              quantity: qty > item.maxPurchaseQty ? item.maxPurchaseQty : qty,
            }
          : item,
      ),
    );
  }, []);

  /* ================= CLEAR ================= */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  /* ================= TOTAL PRICE ================= */
  const getCartTotal = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  /* ================= CART COUNT ================= */
  const getCartCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // CartContext.tsx এর ভিতরে (validateCart function এর কাছাকাছি)

  function resolvePrice(...prices: (number | null | undefined)[]) {
    for (const p of prices) {
      if (p != null && p > 0) return p;
    }
    return 0;
  }

  /* ================= VALIDATE CART (live stock/delete/maxQty/price check) =================
     এই function server action `validateCartProducts` কল করে সব cart item এর
     বিপরীতে বর্তমান (live) product state আনে এবং mismatch হলে fix করে:
     - Product delete/admin-block হলে → cart থেকে remove
     - Stock 0 হলে → remove
     - Variation (SKU) delete হলে → remove
     - maximumPurchaseQuantity/stock এর চেয়ে বেশি quantity থাকলে → clamp
     - Price change হলে (offer/flash sale end) → price sync
     Throttled — 60 sec এর মধ্যে বারবার call হলে skip হয়, শুধু force=true দিলে
     (checkout এর আগে) সবসময় latest data আনবে। */
  const validateCart = useCallback(async (force = false) => {
    const currentItems = cartItemsRef.current;
    if (currentItems.length === 0) return;

    const now = Date.now();
    if (!force && now - lastValidatedRef.current < VALIDATE_STALE_TIME) {
      return;
    }

    setIsValidating(true);
    try {
      const ids = [...new Set(currentItems.map((item) => item.id))];

      const products = await validateCartProducts(ids);
      const productMap = new Map(products.map((p) => [p.id, p]));

      let removedCount = 0;
      let adjustedCount = 0;
      const updated: CartItem[] = [];

      for (const item of currentItems) {
        const live = productMap.get(item.id);

        // ❌ Condition 1: Product delete/block
        if (!live || live.canPurchasable === false) {
          removedCount++;
          continue;
        }

        const variation = live.variations?.find((v) => v.sku === item.sku);

        // ✅ Stock shob shomoy product-level — variation e stock field nai
        const liveStock = live.stock ?? 0;

        // ✅ Effective purchase limit — maximumPurchaseQuantity ar stock,
        // jeta choto oitai final cap (product-detail page er shathe consistent formula)
        const maxPurchaseQty = Math.min(
          live.maximumPurchaseQuantity ?? liveStock,
          liveStock,
        );

        // ❌ Condition 2: Stock out
        if (liveStock <= 0 || live.showStockOut) {
          removedCount++;
          continue;
        }

        // ❌ Condition 3: SKU thakle kintu variation delete hoye gele
        if (item.sku && live.variations?.length > 0 && !variation) {
          removedCount++;
          continue;
        }

        // ✅ Condition 4: quantity clamp — ekhon maxPurchaseQty diye (stock+limit duitai consider kore)
        const clampedQty = Math.min(item.quantity, maxPurchaseQty);
        if (clampedQty !== item.quantity) adjustedCount++;

        // ✅ Condition 5: price — variation thakle variation.price, na thakle product.sellingPrice/mrpPrice
        const livePrice = resolvePrice(
          variation?.price,
          live.sellingPrice,
          live.mrpPrice,
        );

        updated.push({
          ...item,
          quantity: clampedQty,
          stock: liveStock,
          maxPurchaseQty, // ✅ ekhon cart item e store hocche
          price: livePrice ?? item.price,
        });
      }

      setCartItems(updated);
      lastValidatedRef.current = Date.now();

      if (removedCount > 0) {
        toast.error(
          `${removedCount}টা product আর available নেই, cart থেকে সরিয়ে দেওয়া হয়েছে`,
        );
      }
      if (adjustedCount > 0) {
        toast.info(
          `কিছু item এর quantity স্টক/লিমিট অনুযায়ী adjust করা হয়েছে`,
        );
      }
    } catch (error) {
      console.error("Cart validation error:", error);
    } finally {
      setIsValidating(false);
    }
  }, []);

  /* ================= Hydrate howar por ekbar validate ================= */
  useEffect(() => {
    if (!hydrated) return;

    const timeoutId = setTimeout(() => {
      validateCart();
    }, 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  /* ================= CONTEXT VALUE ================= */
  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      validateCart,
      isValidating,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      validateCart,
      isValidating,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
