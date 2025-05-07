"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * ThemeProvider component that wraps your application to provide theme context
 * 
 * @param children - React children to be wrapped by the provider
 * @param props - Additional props for the NextThemesProvider
 * 
 * Available props include:
 * - attribute: HTML attribute to apply the theme with (default: "data-theme")
 * - defaultTheme: Default theme name (default: "system")
 * - enableSystem: Sync with system theme preference (default: true)
 * - disableTransitionOnChange: Disable transitions when switching themes (default: false)
 * - storageKey: Key used to store theme preference in localStorage (default: "theme")
 * - themes: List of theme names (default: ["light", "dark"])
 * - forcedTheme: Force a specific theme (useful for SSR/preview mode)
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

/**
 * Hook to access and manipulate the current theme
 * 
 * @returns Object containing:
 * - theme: Current theme
 * - setTheme: Function to update the theme
 * - themes: Available theme options
 * - systemTheme: Current system theme (if enableSystem is true)
 */
export { useTheme } from "next-themes"
