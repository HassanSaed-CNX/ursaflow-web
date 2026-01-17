import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { X } from 'lucide-react';

interface SingleScreenLayoutProps {
  children: ReactNode;
}

export function SingleScreenLayout({ children }: SingleScreenLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { roleConfig } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        showMenuButton={true} 
        onMenuClick={() => setMenuOpen(!menuOpen)} 
      />

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu panel */}
          <nav 
            className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border z-50 p-spacing-lg lg:hidden"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex items-center justify-between mb-spacing-lg">
              <span className="font-semibold text-text">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-radius hover:bg-background text-text-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="space-y-spacing-xs">
              {roleConfig?.navItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-radius
                      text-text hover:bg-background transition-colors
                      ${isActive(item.path) ? 'bg-accent/10 text-accent font-medium' : ''}
                    `}
                    activeClassName="bg-accent/10 text-accent font-medium"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* Horizontal nav tabs for larger screens */}
      <nav 
        className="hidden lg:block bg-surface border-b border-border px-spacing-lg"
        role="navigation"
        aria-label="Main navigation"
      >
        <ul className="flex gap-spacing-xs">
          {roleConfig?.navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={`
                  flex items-center gap-spacing-sm px-spacing-md py-spacing-sm
                  border-b-2 transition-colors text-sm font-medium
                  ${isActive(item.path) 
                    ? 'border-accent text-accent' 
                    : 'border-transparent text-text-muted hover:text-text hover:border-border'
                  }
                `}
                activeClassName="border-accent text-accent"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-spacing-lg">
        {children}
      </main>
    </div>
  );
}
