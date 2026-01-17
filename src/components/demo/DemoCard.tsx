import { ReactNode } from 'react';

interface DemoCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  variant?: 'default' | 'surface';
}

export function DemoCard({ title, description, children, variant = 'default' }: DemoCardProps) {
  return (
    <div 
      className={`
        rounded-radius-lg border border-border p-spacing-lg
        ${variant === 'surface' ? 'bg-surface' : 'bg-background'}
        shadow-card transition-shadow hover:shadow-card-hover
      `}
    >
      <h3 className="text-lg font-semibold text-text mb-spacing-xs">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted mb-spacing-md">{description}</p>
      )}
      <div className="space-y-spacing-sm">
        {children}
      </div>
    </div>
  );
}
