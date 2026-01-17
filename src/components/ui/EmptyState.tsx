import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Inbox, Search, FileX, type LucideIcon } from 'lucide-react';
import { BaseButton } from '@/components/BaseButton';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'error';
  className?: string;
  children?: ReactNode;
}

const variantIcons: Record<string, LucideIcon> = {
  default: Inbox,
  search: Search,
  error: FileX,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
  children,
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-spacing-xl px-spacing-lg text-center',
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="rounded-full bg-accent/10 p-spacing-lg mb-spacing-lg">
        <Icon className="h-10 w-10 text-accent" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-text mb-spacing-xs">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-text-muted max-w-sm mb-spacing-lg">
          {description}
        </p>
      )}

      {action && (
        <BaseButton variant="primary" onClick={action.onClick}>
          {action.label}
        </BaseButton>
      )}

      {children}
    </div>
  );
}
