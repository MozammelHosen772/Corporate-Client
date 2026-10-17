"use client";

import { validateCartProducts } from "@/services/products/validation.service";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export interface WhitelistItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  addedAt: number;
}

export type WhitelistContextType = {
  items: WhitelistItem[];
  isHydrated: boolean;
  isValidating: boolean;
  isInWhitelist: (productId: string) => boolean;
  addToWhitelist: (product: Omit<WhitelistItem, "addedAt">) => void;
  removeFromWhitelist: (productId: string) => void;
  toggleWhitelist: (product: Omit<WhitelistItem, "addedAt">) => void;
  clearWhitelist: () => void;
  validateWhitelist: (force?: boolean) => Promise<void>;
};

const STORAGE_KEY = "product_whitelist";
const VALIDATE_STALE_TIME = 60_000; // ✅ cart er moto — 60 sec er modhye repeat call skip hobe

const getInitialItems = (): WhitelistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const emptySubscribe = () => () => {};
const useHasMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

// ✅ shared empty array reference — protibar notun [] banale
// unnecessary re-render/memo-break hote pare, tai ekta constant rakha holo
const EMPTY_ITEMS: WhitelistItem[] = [];

export const WhitelistContext = createContext<WhitelistContextType>({
  items: [],
  isHydrated: false,
  isValidating: false,
  isInWhitelist: () => false,
  addToWhitelist: () => {},
  removeFromWhitelist: () => {},
  toggleWhitelist: () => {},
  clearWhitelist: () => {},
  validateWhitelist: async () => {},
});

export const useWhitelist = () => useContext(WhitelistContext);

export function WhitelistProvider({ children }: { children: React.ReactNode }) {
  // ✅ getInitialItems() ekhono lazy initializer hisebe real localStorage
  // data rakhbe internally (add/remove/toggle er jonno source of truth),
  // kintu eita ar shorasori context e "items" hisebe export hobe na —
  // nichey mounted onujayi filter kore export kora hocche
  const [rawItems, setRawItems] = useState<WhitelistItem[]>(getInitialItems);
  const [isValidating, setIsValidating] = useState(false);
  const mounted = useHasMounted();

  const rawItemsRef = useRef<WhitelistItem[]>(rawItems);
  useEffect(() => {
    rawItemsRef.current = rawItems;
  }, [rawItems]);

  const lastValidatedRef = useRef<number>(0);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rawItems));
    } catch {
      // storage full or blocked — silently ignore
    }
  }, [rawItems, mounted]);

  // ✅ CENTRAL FIX: mounted na hoya porjonto shobshomoy empty array —
  // eita server render + hydration-matching render dutoteoi same thakbe,
  // tai kono component e alada kore "isHydrated ? ... : false" likhte hobe na
  const items = mounted ? rawItems : EMPTY_ITEMS;

  // ✅ CENTRAL FIX: mounted na hoya porjonto shobshomoy false —
  // heart icon, badge count shob jaigay ekhon nirapod
  const isInWhitelist = useCallback(
    (productId: string) => {
      if (!mounted) return false;
      return rawItems.some((item) => item.id === productId);
    },
    [rawItems, mounted],
  );

  const addToWhitelist = useCallback(
    (product: Omit<WhitelistItem, "addedAt">) => {
      setRawItems((prev) => {
        if (prev.some((item) => item.id === product.id)) return prev;
        return [...prev, { ...product, addedAt: Date.now() }];
      });
    },
    [],
  );

  const removeFromWhitelist = useCallback((productId: string) => {
    setRawItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleWhitelist = useCallback(
    (product: Omit<WhitelistItem, "addedAt">) => {
      // ✅ note: rawItems direct check kora hocche (mounted true dhore),
      // karon toggle shobshomoy user interaction er por-i call hoy (client-e,
      // mounted howar por), tai ekhane extra mounted-guard lagbe na
      const exists = rawItems.some((item) => item.id === product.id);
      if (exists) {
        removeFromWhitelist(product.id);
      } else {
        addToWhitelist(product);
      }
    },
    [rawItems, addToWhitelist, removeFromWhitelist],
  );

  const clearWhitelist = useCallback(() => {
    setRawItems([]);
  }, []);

  /* ================= VALIDATE WHITELIST (cart er moto live check) =================
     validateCartProducts call kore protita whitelist item er against current
     (live) product state ante — mismatch hole silently fix kore:
     - Product delete/admin-block hole → whitelist theke remove
     - Price change hole (offer/flash sale end) → price live sync
     Stock out thakleo item wishlist e thakbe (user out-of-stock product
     shoja e wishlist korte pare — stock ফিরে এলে notify korar jonno).
     Throttled — 60 sec er modhye barbar call hole skip hoy, shudhu force=true
     dile (e.g. whitelist page open korle) shobshomoy latest data anbe. */
  const validateWhitelist = useCallback(async (force = false) => {
    const currentItems = rawItemsRef.current;
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

      const updated: WhitelistItem[] = [];

      for (const item of currentItems) {
        const live = productMap.get(item.id);

        // ❌ Product delete/admin-block hoye gele whitelist theke bad
        if (!live || live.canPurchasable === false) continue;

        // ✅ Price live sync — offer/flash sale shuru/shesh hole update hobe
        const livePrice = live.sellingPrice ?? live.mrpPrice ?? item.price;

        updated.push({
          ...item,
          price: livePrice,
        });
      }

      // ✅ shudhu remove ba price change thakle e re-render/localStorage write hobe
      const changed =
        updated.length !== currentItems.length ||
        updated.some((u, i) => u.price !== currentItems[i]?.price);

      if (changed) {
        setRawItems(updated);
      }

      lastValidatedRef.current = Date.now();
    } catch (error) {
      console.error("Whitelist validation error:", error);
    } finally {
      setIsValidating(false);
    }
  }, []);

  /* ================= Hydrate howar por ekbar validate ================= */
  useEffect(() => {
    if (!mounted) return;

    const timeoutId = setTimeout(() => {
      validateWhitelist();
    }, 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return (
    <WhitelistContext.Provider
      value={{
        items,
        isHydrated: mounted,
        isValidating,
        isInWhitelist,
        addToWhitelist,
        removeFromWhitelist,
        toggleWhitelist,
        clearWhitelist,
        validateWhitelist,
      }}
    >
      {children}
    </WhitelistContext.Provider>
  );
}
