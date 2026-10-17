"use client";
import { CartContext } from "@/contexts/CartContext";
import { useContext } from "react";

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
