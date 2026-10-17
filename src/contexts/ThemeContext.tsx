"use client";

import { IThemeData } from "@/services/settings/theme.service";
import { createContext, useContext } from "react";

interface ThemeContextType {
  theme: IThemeData | null;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  loading: false,
});

export const ThemeProvider = ({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: IThemeData | null;
}) => {
  return (
    <ThemeContext.Provider value={{ theme: initialTheme, loading: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
