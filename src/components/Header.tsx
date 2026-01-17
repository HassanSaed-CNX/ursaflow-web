import { Package, Menu } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const { user, roleConfig } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-header border-b border-border-strong shadow-md">
      <div className="px-spacing-lg py-spacing-md flex items-center justify-between gap-spacing-md">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-spacing-md">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-radius hover:bg-header-foreground/10 text-header-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          <div className="flex items-center gap-spacing-sm">
            <Package className="h-8 w-8 text-accent" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-header-foreground leading-tight">
                Industrial MES
              </h1>
              <p className="text-xs text-header-foreground/60 leading-tight">
                Manufacturing Execution System
              </p>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-spacing-md">
          {/* Current role pill */}
          {roleConfig && (
            <div className="hidden md:flex items-center">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                {roleConfig.label}
              </span>
            </div>
          )}

          {/* Role switcher (demo) */}
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>

          {/* Theme switcher */}
          <ThemeSwitcher />
        </div>
      </div>

      {/* Mobile role display */}
      <div className="sm:hidden px-spacing-lg pb-spacing-sm flex items-center justify-between">
        <RoleSwitcher />
        {roleConfig && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
            {roleConfig.label}
          </span>
        )}
      </div>
    </header>
  );
}
