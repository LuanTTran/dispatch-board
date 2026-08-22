import { ThemeProvider as NextThemesProvider } from "next-themes";

import { ThemeStyles } from "@/components/ThemeStyles";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ThemeStyles />
      {children}
    </NextThemesProvider>
  );
}
