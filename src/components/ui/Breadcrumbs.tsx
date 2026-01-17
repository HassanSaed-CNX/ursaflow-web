import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  const location = useLocation();

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', path: '/' }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-spacing-xs text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isActive = item.path === location.pathname;

          return (
            <li key={index} className="flex items-center gap-spacing-xs">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-text-muted" aria-hidden="true" />
              )}

              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-spacing-xs transition-colors',
                    'text-text-muted hover:text-accent focus:text-accent',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-radius-sm px-1'
                  )}
                >
                  {index === 0 && showHome && (
                    <Home className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-spacing-xs',
                    isActive || isLast ? 'text-text font-medium' : 'text-text-muted'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {index === 0 && showHome && (
                    <Home className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
