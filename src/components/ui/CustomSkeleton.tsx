import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-border';
  
  const variantClasses = {
    text: 'rounded-radius-sm h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-radius',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'circular' ? width : undefined),
  };

  if (lines > 1 && variant === 'text') {
    return (
      <div className="space-y-spacing-xs">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses.text, className)}
            style={{ 
              ...style, 
              width: i === lines - 1 ? '75%' : '100%' 
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
  return (
    <div className="rounded-radius-lg border border-border bg-surface p-spacing-lg space-y-spacing-md">
      <div className="flex items-center gap-spacing-md">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-spacing-xs">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-radius-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-header p-spacing-md flex gap-spacing-md">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" className="bg-header-foreground/20" />
        ))}
      </div>
      {/* Rows */}
      <div className="bg-surface divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="p-spacing-md flex gap-spacing-md">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton key={colIdx} variant="text" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
