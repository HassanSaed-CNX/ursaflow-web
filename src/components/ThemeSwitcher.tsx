import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Monitor, Moon, Eye } from 'lucide-react';

const themeIcons: Record<Theme, React.ReactNode> = {
  'corporate-industrial': <Monitor className="h-4 w-4" />,
  'dark-compact': <Moon className="h-4 w-4" />,
  'high-contrast': <Eye className="h-4 w-4" />,
};

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-surface border border-border p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
            transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
            ${theme === t.value 
              ? 'bg-accent text-accent-foreground shadow-sm' 
              : 'text-text-muted hover:text-text hover:bg-background'
            }
          `}
          title={t.description}
          aria-pressed={theme === t.value}
          aria-label={`Switch to ${t.label} theme`}
        >
          {themeIcons[t.value]}
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
