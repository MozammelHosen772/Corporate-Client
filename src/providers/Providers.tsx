"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
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
      <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
    </AuthProvider>
  );
}
