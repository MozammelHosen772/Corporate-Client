"use client";

import { useCart } from "@/hooks/useCart";
import {
  ImageOff,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CartDrawer({ open, setOpen }: Props) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    validateCart,
    isValidating,
  } = useCart();

  const totalPrice = getCartTotal();
  const totalItems = getCartCount();

  // ✅ Drawer khulle throttled validate call hoy (60 sec er moddhe already
  // validate hoye thakle skip hobe, tai "sob somoy call" hoy na — performance safe).
  // Eita product delete/stock/maxQty live check kore cart auto-fix kore dey.
  useEffect(() => {
    if (!open) return;
    validateCart();
  }, [open, validateCart]);

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* DRAWER */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-[9999] h-screen w-full sm:w-[420px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="h-[68px] border-b border-gray-100 px-5 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0f3ea9]/10 flex items-center justify-center">
              <ShoppingBag className="w-[18px] h-[18px] text-[#0f3ea9]" />
            </div>
            <h2 className="text-[17px] font-bold text-gray-900">
              Shopping Cart
            </h2>
            {totalItems > 0 && (
              <span className="text-[12px] font-semibold text-[#0f3ea9] bg-[#0f3ea9]/10 rounded-full px-2 py-0.5">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            )}
            {/* ✅ Validation loading indicator */}
            {isValidating && (
              <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
            )}
          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-[18px] h-[18px] text-gray-500" />
          </button>
        </div>

        {/* EMPTY */}
        {cartItems.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-5">
              <ShoppingBag
                className="w-9 h-9 text-gray-300"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-[17px] font-semibold text-gray-900">
              Your cart is empty
            </h3>
            <p className="text-gray-400 mt-1.5 text-sm">
              Items you add will show up here.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 h-[42px] px-6 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* ITEMS */}
        {cartItems.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 bg-[#fafafa]">
              {cartItems.map((item) => {
                // ✅ image valid কিনা check — empty string / PDF / video হলে fallback icon দেখাবে
                const isValidImage =
                  !!item.image &&
                  !item.image.match(/\.(pdf|mp4|mov|avi|mkv|webm)(\?.*)?$/i);

                // ✅ max quantity ekhon item.stock (validateCart theke live update hoy)
                const isAtMaxQty = item.quantity >= item.maxPurchaseQty;

                return (
                  <div
                    key={item.cartItemId}
                    className="bg-white border border-gray-100 rounded-2xl p-3 flex gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
                  >
                    {/* IMAGE */}
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative w-[68px] h-[68px] rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50"
                    >
                      {isValidImage ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="68px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-gray-300">
                          <ImageOff className="w-5 h-5" strokeWidth={1.5} />
                          <span className="text-[8px] font-medium">
                            No image
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* INFO */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[13.5px] font-medium text-gray-800 leading-snug line-clamp-2">
                          {item.shortTitle || item.title}
                        </h3>

                        <p className="text-[15px] font-bold text-gray-900 whitespace-nowrap shrink-0">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* VARIANTS (COLOR + SIZE) */}
                      {(item.selectedColor || item.selectedSize) && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {item.selectedColor && (
                            <span className="text-[10.5px] font-medium px-2 py-[2px] rounded-full bg-gray-100 text-gray-600">
                              {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[10.5px] font-medium px-2 py-[2px] rounded-full bg-blue-50 text-blue-600">
                              {item.selectedSize}
                            </span>
                          )}
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="flex items-center justify-between mt-2.5">
                        {/* QUANTITY STEPPER */}
                        <div className="flex items-center gap-2.5 bg-gray-50 rounded-full px-1 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>

                          <span className="text-[13px] font-semibold min-w-[16px] text-center text-gray-800">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity + 1)
                            }
                            disabled={isAtMaxQty}
                            aria-label="Increase quantity"
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>

                        {/* DELETE */}
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label="Remove item"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-[15px] h-[15px]" />
                        </button>
                      </div>

                      {/* ✅ Max qty reached notice */}
                      {isAtMaxQty && (
                        <p className="text-[10.5px] text-orange-500 mt-1">
                          সর্বোচ্চ ক্রয়যোগ্য পরিমাণে পৌঁছেছেন
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="border-t border-gray-100 bg-white px-5 pt-4 pb-5 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
              {/* TOTAL */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-medium text-gray-500">
                  Subtotal
                </span>
                <span className="text-[22px] font-bold text-gray-900">
                  ৳{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* CHECKOUT */}
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="w-full h-[50px] flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-[15px] font-semibold transition-colors shadow-md"
              >
                Proceed to Checkout
              </Link>

              {/* CLEAR */}
              <button
                onClick={clearCart}
                className="w-full mt-2.5 h-[42px] rounded-xl text-gray-500 text-[13px] font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
// "use client";

// import { useCart } from "@/hooks/useCart";
// import { ImageOff, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// interface Props {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export default function CartDrawer({ open, setOpen }: Props) {
//   const {
//     cartItems,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartCount,
//   } = useCart();

//   const totalPrice = getCartTotal();
//   const totalItems = getCartCount();

//   return (
//     <>
//       {/* OVERLAY */}
//       <div
//         onClick={() => setOpen(false)}
//         aria-hidden="true"
//         className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
//           open ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//       />

//       {/* DRAWER */}
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-label="Shopping cart"
//         className={`fixed top-0 right-0 z-[9999] h-screen w-full sm:w-[420px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* HEADER */}
//         <div className="h-[68px] border-b border-gray-100 px-5 flex items-center justify-between shrink-0 bg-white">
//           <div className="flex items-center gap-2.5">
//             <div className="w-9 h-9 rounded-full bg-[#0f3ea9]/10 flex items-center justify-center">
//               <ShoppingBag className="w-[18px] h-[18px] text-[#0f3ea9]" />
//             </div>
//             <h2 className="text-[17px] font-bold text-gray-900">
//               Shopping Cart
//             </h2>
//             {totalItems > 0 && (
//               <span className="text-[12px] font-semibold text-[#0f3ea9] bg-[#0f3ea9]/10 rounded-full px-2 py-0.5">
//                 {totalItems} {totalItems === 1 ? "item" : "items"}
//               </span>
//             )}
//           </div>

//           <button
//             onClick={() => setOpen(false)}
//             aria-label="Close cart"
//             className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
//           >
//             <X className="w-[18px] h-[18px] text-gray-500" />
//           </button>
//         </div>

//         {/* EMPTY */}
//         {cartItems.length === 0 && (
//           <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
//             <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-5">
//               <ShoppingBag
//                 className="w-9 h-9 text-gray-300"
//                 strokeWidth={1.5}
//               />
//             </div>
//             <h3 className="text-[17px] font-semibold text-gray-900">
//               Your cart is empty
//             </h3>
//             <p className="text-gray-400 mt-1.5 text-sm">
//               Items you add will show up here.
//             </p>
//             <button
//               onClick={() => setOpen(false)}
//               className="mt-6 h-[42px] px-6 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         )}

//         {/* ITEMS */}
//         {cartItems.length > 0 && (
//           <>
//             <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 bg-[#fafafa]">
//               {cartItems.map((item) => {
//                 // ✅ image valid কিনা check — empty string / PDF / video হলে fallback icon দেখাবে
//                 const isValidImage =
//                   !!item.image &&
//                   !item.image.match(/\.(pdf|mp4|mov|avi|mkv|webm)(\?.*)?$/i);

//                 return (
//                   <div
//                     key={item.cartItemId}
//                     className="bg-white border border-gray-100 rounded-2xl p-3 flex gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
//                   >
//                     {/* IMAGE */}
//                     <Link
//                       href={`/products/${item.slug}`}
//                       onClick={() => setOpen(false)}
//                       className="relative w-[68px] h-[68px] rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50"
//                     >
//                       {isValidImage ? (
//                         <Image
//                           src={item.image}
//                           alt={item.title}
//                           fill
//                           sizes="68px"
//                           className="object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-gray-300">
//                           <ImageOff className="w-5 h-5" strokeWidth={1.5} />
//                           <span className="text-[8px] font-medium">
//                             No image
//                           </span>
//                         </div>
//                       )}
//                     </Link>

//                     {/* INFO */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2">
//                         <h3 className="text-[13.5px] font-medium text-gray-800 leading-snug line-clamp-2">
//                           {item.shortTitle || item.title}
//                         </h3>

//                         <p className="text-[15px] font-bold text-gray-900 whitespace-nowrap shrink-0">
//                           ৳{(item.price * item.quantity).toLocaleString()}
//                         </p>
//                       </div>

//                       {/* VARIANTS (COLOR + SIZE) */}
//                       {(item.selectedColor || item.selectedSize) && (
//                         <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
//                           {item.selectedColor && (
//                             <span className="text-[10.5px] font-medium px-2 py-[2px] rounded-full bg-gray-100 text-gray-600">
//                               {item.selectedColor}
//                             </span>
//                           )}
//                           {item.selectedSize && (
//                             <span className="text-[10.5px] font-medium px-2 py-[2px] rounded-full bg-blue-50 text-blue-600">
//                               {item.selectedSize}
//                             </span>
//                           )}
//                         </div>
//                       )}

//                       {/* ACTIONS */}
//                       <div className="flex items-center justify-between mt-2.5">
//                         {/* QUANTITY STEPPER */}
//                         <div className="flex items-center gap-2.5 bg-gray-50 rounded-full px-1 py-1">
//                           <button
//                             onClick={() =>
//                               updateQuantity(item.cartItemId, item.quantity - 1)
//                             }
//                             disabled={item.quantity <= 1}
//                             aria-label="Decrease quantity"
//                             className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
//                           >
//                             <Minus className="w-3 h-3 text-gray-600" />
//                           </button>

//                           <span className="text-[13px] font-semibold min-w-[16px] text-center text-gray-800">
//                             {item.quantity}
//                           </span>

//                           <button
//                             onClick={() =>
//                               updateQuantity(item.cartItemId, item.quantity + 1)
//                             }
//                             disabled={item.quantity >= item.stock}
//                             aria-label="Increase quantity"
//                             className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
//                           >
//                             <Plus className="w-3 h-3 text-gray-600" />
//                           </button>
//                         </div>

//                         {/* DELETE */}
//                         <button
//                           onClick={() => removeFromCart(item.cartItemId)}
//                           aria-label="Remove item"
//                           className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
//                         >
//                           <Trash2 className="w-[15px] h-[15px]" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* FOOTER */}
//             <div className="border-t border-gray-100 bg-white px-5 pt-4 pb-5 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
//               {/* TOTAL */}
//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-[14px] font-medium text-gray-500">
//                   Subtotal
//                 </span>
//                 <span className="text-[22px] font-bold text-gray-900">
//                   ৳{totalPrice.toLocaleString()}
//                 </span>
//               </div>

//               {/* CHECKOUT */}
//               <Link
//                 href="/checkout"
//                 onClick={() => setOpen(false)}
//                 className="w-full h-[50px] flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-[15px] font-semibold transition-colors shadow-md"
//               >
//                 Proceed to Checkout
//               </Link>

//               {/* CLEAR */}
//               <button
//                 onClick={clearCart}
//                 className="w-full mt-2.5 h-[42px] rounded-xl text-gray-500 text-[13px] font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }
