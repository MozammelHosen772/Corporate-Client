export interface CartItem {
  cartItemId: string;
  id: string;
  maxPurchaseQty: number;
  slug: string;
  title: string;
  shortTitle: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  sku: string;
  stock: number;
  shippingType: "free" | "flat_rate";
  shippingCost: number;
  isQuantityMultiply: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "cartItemId">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  validateCart: (force?: boolean) => Promise<void>; // ✅ new
  isValidating: boolean; // ✅ new — loading state UI te dekhanor jonno
}
