"use client";

import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WhitelistProvider } from "@/contexts/WhitelistContext";
import { IThemeData } from "@/services/settings/theme.service";
import { AuthProvider } from "./AuthProviders";

export default function Providers({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: IThemeData | null;
}) {
  return (
    <AuthProvider>
      <WhitelistProvider>
        <ThemeProvider initialTheme={initialTheme}>
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </WhitelistProvider>
    </AuthProvider>
  );
}
