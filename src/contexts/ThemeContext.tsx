import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'corporate-industrial' | 'dark-compact' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';

const themes: ThemeContextType['themes'] = [
  { 
    value: 'corporate-industrial', 
    label: 'Corporate Industrial', 
    description: 'Dark header with light content canvas' 
  },
  { 
    value: 'dark-compact', 
    label: 'Dark Compact', 
    description: 'Dark mode with reduced spacing' 
  },
  { 
    value: 'high-contrast', 
    label: 'High Contrast', 
    description: 'Maximum accessibility contrast' 
  },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (stored && themes.some(t => t.value === stored)) {
        return stored;
      }
    }
    return 'corporate-industrial';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme attributes
    root.removeAttribute('data-theme');
    
    // Apply theme attribute (corporate-industrial uses :root defaults)
    if (theme !== 'corporate-industrial') {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
