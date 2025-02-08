import { ThemeKeys } from "@/components/desktop/CodeEditor/themes/PrismThemes";
import { create } from "zustand";

export const useThemeStore = create<{
  selectedTheme: ThemeKeys;
  setSelectedTheme: (theme: ThemeKeys) => void;
}>((set) => ({
  selectedTheme: "atom-dark",
  setSelectedTheme: (theme) => set({ selectedTheme: theme }),
}));
