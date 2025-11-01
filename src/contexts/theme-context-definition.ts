/**
 * Theme Context Definition
 * Separate file for Fast Refresh compatibility
 */

import { createContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // Resolved theme (system -> actual)
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

