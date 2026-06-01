import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#E52E2D", // this is red
    secondary: "#161616", // this is dark black
    text: "#ffffff", // this is white
    dark: "#121212", // this is dark black
    white: "#ffffff", // this is white
    grey: "#383838", // this is dark grey
    info: "#427CC3", // this is light blue
    error: "#E52E2D", // this is red
    success: "#4BB543", // this is green
    warning: "#FFA500",
    darkGrey: "#2a2a2a",
    lightGrey: "#888888",
  },
  dark: {
    primary: "#161616", // this is dark black
    secondary: "#427CC3", // this is light blue
    text: "#ffffff", // this is white
    dark: "#121212", // this is dark black
    white: "#ffffff", // this is white
    grey: "#383838", // this is dark grey
    error: "#E52E2D", // this is red
    info: "#427CC3", // this is light blue
    success: "#4BB543", // this is green
    warning: "#FFA500",
    darkGrey: "#2a2a2a",
    lightGrey: "#888888",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
