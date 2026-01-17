import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface PageCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function PageCard({ children, className, padding = 'lg' }: PageCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-spacing-sm',
    md: 'p-spacing-md',
    lg: 'p-spacing-lg',
  };

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-radius-lg shadow-card',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ icon: Icon, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-spacing-md mb-spacing-lg', className)}>
      <div className="flex items-center gap-spacing-md">
        {Icon && (
          <div className="p-spacing-sm rounded-radius bg-accent/10">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-text">{title}</h1>
          {description && (
            <p className="text-sm text-text-muted mt-spacing-xs">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-spacing-sm">{actions}</div>}
    </div>
  );
}
